"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import {
  MEDIA_BUCKET,
  MEDIA_FOLDERS,
  findMediaReferences,
  processUpload,
  rewriteMediaReferences,
  sanitizeFileName,
  storagePathFor,
  createIncomingUpload,
  takeIncomingUpload,
  type MediaFolder,
} from "@/lib/admin/media";

export interface UploadMediaState {
  error?: string;
  uploaded?: { id: string; url: string; file_name: string };
}

const folderSchema = z.enum(MEDIA_FOLDERS);
const idSchema = z.string().uuid();

/** Content that embeds media URLs - flushed after a replace so pages show the new file. */
function revalidateContent() {
  for (const tag of ["landing-page", "blog", "testimonial", "settings"]) revalidateTag(tag, { expire: 0 });
  revalidatePath("/admin/media");
}

async function insertCatalogRow(row: Record<string, unknown>) {
  const result = await supabaseAdmin.from("media").insert(row).select("id").single();
  // `folder` arrives with migration 0004 (production's legacy table already has it).
  if (result.error && (result.error.code === "PGRST204" || result.error.code === "42703")) {
    const { folder: _folder, ...withoutFolder } = row;
    void _folder;
    return supabaseAdmin.from("media").insert(withoutFolder).select("id").single();
  }
  return result;
}

/** Step 1 of an upload: a one-time signed URL the browser uploads the raw file to. */
export async function createUploadTarget(input: { type: string; size: number }): Promise<{ path?: string; token?: string; error?: string }> {
  const profile = await requirePermission((p) => p.canUploadMedia);
  if (input.type === "image/svg+xml" && !profile.permissions.canManageMedia) {
    return { error: "Only Admins can upload SVG files. Use PNG, JPG or WebP instead." };
  }
  try {
    return await createIncomingUpload(String(input.type), Number(input.size));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't start the upload." };
  }
}

const finalizeSchema = z.object({
  path: z.string(),
  type: z.string(),
  fileName: z.string().max(300),
  folder: z.string().optional(),
  altText: z.string().max(300).optional(),
  optimize: z.boolean().optional(),
});

/** Step 2: validate + compress the uploaded file and add it to the library. */
export async function uploadMedia(input: z.input<typeof finalizeSchema>): Promise<UploadMediaState> {
  const profile = await requirePermission((p) => p.canUploadMedia);
  const parsedInput = finalizeSchema.safeParse(input);
  if (!parsedInput.success) return { error: "Invalid upload." };
  const { path, type, fileName: originalName } = parsedInput.data;
  const folder = folderSchema.catch("general").parse(parsedInput.data.folder ?? "general") as MediaFolder;
  const altText = (parsedInput.data.altText ?? "").trim();
  const optimize = parsedInput.data.optimize ?? true;
  const file = { name: originalName, size: 0 };

  let processed;
  try {
    const bytes = await takeIncomingUpload(path);
    file.size = bytes.length;
    processed = await processUpload(bytes, type, { allowSvg: profile.permissions.canManageMedia, optimize });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed." };
  }

  const storagePath = storagePathFor(folder, processed.ext);
  const { error: uploadError } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, processed.bytes, { contentType: processed.contentType, upsert: false, cacheControl: "31536000" });
  if (uploadError) return { error: uploadError.message };

  const { data: pub } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  const fileName = sanitizeFileName(processed.optimized ? file.name.replace(/\.\w+$/, `.${processed.ext}`) : file.name);
  const { data, error } = await insertCatalogRow({
    file_name: fileName,
    storage_path: storagePath,
    url: pub.publicUrl,
    mime_type: processed.contentType,
    size_bytes: processed.bytes.length,
    width: processed.width,
    height: processed.height,
    alt_text: altText || null,
    folder,
    uploaded_by: profile.id,
  });
  if (error || !data) {
    await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([storagePath]);
    return { error: error?.message ?? "Couldn't save the file to the library." };
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "upload",
    contentType: "media",
    contentId: data.id,
    newValue: { file_name: fileName, url: pub.publicUrl, folder, optimized: processed.optimized, original_bytes: file.size, stored_bytes: processed.bytes.length },
  });

  revalidatePath("/admin/media");
  return { uploaded: { id: data.id, url: pub.publicUrl, file_name: fileName } };
}

const detailsSchema = z.object({
  file_name: z.string().trim().min(1).max(150),
  alt_text: z.string().trim().max(300),
  folder: folderSchema,
});

export async function updateMediaDetails(
  id: string,
  details: { file_name: string; alt_text: string; folder: string }
): Promise<{ error?: string }> {
  const profile = await requirePermission((p) => p.canUploadMedia);
  const mediaId = idSchema.safeParse(id);
  const parsedDetails = detailsSchema.safeParse(details);
  if (!mediaId.success || !parsedDetails.success) return { error: parsedDetails.error?.issues[0]?.message ?? "Invalid input." };
  const parsed = parsedDetails.data;

  const { data: previous } = await supabaseAdmin.from("media").select("file_name, alt_text, folder, uploaded_by").eq("id", mediaId.data).maybeSingle();
  if (!previous) return { error: "File not found." };
  if (!profile.permissions.canManageMedia && previous.uploaded_by !== profile.id) {
    return { error: "You can only edit files you uploaded." };
  }

  const { error } = await supabaseAdmin
    .from("media")
    .update({ file_name: sanitizeFileName(parsed.file_name), alt_text: parsed.alt_text || null, folder: parsed.folder })
    .eq("id", mediaId.data);
  if (error) return { error: error.message };

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "update", contentType: "media", contentId: mediaId.data, previousValue: previous, newValue: parsed });
  revalidatePath("/admin/media");
  return {};
}

/**
 * Replaces a file's bytes. The new file gets a new storage path (so no CDN or
 * image-optimizer cache can keep serving the old one) and every content row
 * that referenced the old URL is rewritten to the new one.
 */
export async function replaceMedia(input: { id: string } & z.input<typeof finalizeSchema>): Promise<UploadMediaState> {
  const profile = await requirePermission((p) => p.canManageMedia);
  const parsedId = idSchema.safeParse(input.id);
  const parsedInput = finalizeSchema.safeParse(input);
  if (!parsedId.success || !parsedInput.success) return { error: "Invalid file." };
  const file = { name: parsedInput.data.fileName };

  const { data: current } = await supabaseAdmin.from("media").select("*").eq("id", parsedId.data).maybeSingle();
  if (!current) {
    await takeIncomingUpload(parsedInput.data.path).catch(() => undefined);
    return { error: "File not found." };
  }

  let processed;
  try {
    const bytes = await takeIncomingUpload(parsedInput.data.path);
    processed = await processUpload(bytes, parsedInput.data.type, { allowSvg: true, optimize: parsedInput.data.optimize ?? true });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Replace failed." };
  }

  const folder = folderSchema.catch("general").parse(current.folder ?? "general") as MediaFolder;
  const storagePath = storagePathFor(folder, processed.ext);
  const { error: uploadError } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, processed.bytes, { contentType: processed.contentType, upsert: false, cacheControl: "31536000" });
  if (uploadError) return { error: uploadError.message };
  const { data: pub } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

  let rewritten = 0;
  try {
    rewritten = await rewriteMediaReferences(current.url, pub.publicUrl);
  } catch (error) {
    await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([storagePath]);
    return { error: error instanceof Error ? error.message : "Couldn't update pages that use this file." };
  }

  const { error } = await supabaseAdmin
    .from("media")
    .update({
      storage_path: storagePath,
      url: pub.publicUrl,
      public_url: pub.publicUrl,
      mime_type: processed.contentType,
      size_bytes: processed.bytes.length,
      width: processed.width,
      height: processed.height,
      file_name: sanitizeFileName(file.name),
    })
    .eq("id", current.id);
  if (error) {
    // Legacy-free schemas (fresh installs) have no public_url column.
    const retry = await supabaseAdmin
      .from("media")
      .update({ storage_path: storagePath, url: pub.publicUrl, mime_type: processed.contentType, size_bytes: processed.bytes.length, width: processed.width, height: processed.height, file_name: sanitizeFileName(file.name) })
      .eq("id", current.id);
    if (retry.error) return { error: retry.error.message };
  }
  await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([current.storage_path]);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "update",
    contentType: "media",
    contentId: current.id,
    previousValue: { url: current.url, storage_path: current.storage_path },
    newValue: { url: pub.publicUrl, storage_path: storagePath, references_updated: rewritten },
  });

  revalidateContent();
  return { uploaded: { id: current.id, url: pub.publicUrl, file_name: file.name } };
}

/** Pages/settings that still use a file - shown before delete. */
export async function getMediaUsage(id: string) {
  await requirePermission((p) => p.canUploadMedia);
  const { data } = await supabaseAdmin.from("media").select("url").eq("id", idSchema.parse(id)).maybeSingle();
  return data ? findMediaReferences(data.url) : [];
}

export async function deleteMedia(id: string): Promise<{ error?: string }> {
  const profile = await requirePermission((p) => p.canManageMedia);
  const mediaId = idSchema.safeParse(id);
  if (!mediaId.success) return { error: "Invalid file." };

  const { data: media } = await supabaseAdmin.from("media").select("*").eq("id", mediaId.data).maybeSingle();
  if (!media) return { error: "File not found." };

  const { error } = await supabaseAdmin.from("media").delete().eq("id", mediaId.data);
  if (error) return { error: error.message };
  if (media.storage_path) {
    const { error: storageError } = await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([media.storage_path]);
    if (storageError) console.error("[media] catalog row deleted but storage object remains:", media.storage_path, storageError.message);
  }

  await logActivity({ userId: profile.id, userEmail: profile.email, action: "delete", contentType: "media", contentId: mediaId.data, previousValue: media });
  revalidatePath("/admin/media");
  return {};
}

export interface PickerMedia {
  id: string;
  url: string;
  file_name: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
}

/** Image search for the media picker used in content forms. */
export async function listMediaForPicker(query: string, folder?: string): Promise<PickerMedia[]> {
  await requirePermission((p) => p.canUploadMedia);
  let q = supabaseAdmin
    .from("media")
    .select("id, url, file_name, alt_text, width, height")
    .like("mime_type", "image/%")
    .order("created_at", { ascending: false })
    .limit(60);
  const term = query.replace(/[%_,()\\]/g, " ").trim().slice(0, 80);
  if (term) q = q.or(`file_name.ilike.%${term}%,alt_text.ilike.%${term}%`);
  if (folder && folderSchema.safeParse(folder).success) q = q.eq("folder", folder);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as PickerMedia[];
}
