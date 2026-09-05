"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface UploadMediaState {
  error?: string;
}

export async function uploadMedia(
  _prevState: UploadMediaState,
  formData: FormData
): Promise<UploadMediaState> {
  const profile = await requirePermission((p) => p.canUploadMedia);

  const file = formData.get("file") as File | null;
  const altText = String(formData.get("alt_text") || "");

  if (!file || file.size === 0) return { error: "Please choose a file." };
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Allowed: PNG, JPG, WebP, SVG, GIF, PDF." };
  }
  if (file.size > MAX_SIZE_BYTES) return { error: "File is too large (max 10MB)." };

  const ext = file.name.split(".").pop() || "bin";
  const storagePath = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("media")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { data: publicUrlData } = supabaseAdmin.storage.from("media").getPublicUrl(storagePath);

  const { data, error } = await supabaseAdmin
    .from("media")
    .insert({
      file_name: file.name,
      storage_path: storagePath,
      url: publicUrlData.publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText || null,
      uploaded_by: profile.id,
    })
    .select("id")
    .single();

  if (error) {
    await supabaseAdmin.storage.from("media").remove([storagePath]);
    return { error: error.message };
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "upload",
    contentType: "media",
    contentId: data.id,
    newValue: { file_name: file.name, url: publicUrlData.publicUrl },
  });

  revalidatePath("/admin/media");
  return {};
}

export async function deleteMedia(id: string): Promise<void> {
  const profile = await requirePermission((p) => p.canManageMedia);

  const { data: media } = await supabaseAdmin.from("media").select("*").eq("id", id).maybeSingle();
  if (!media) return;

  await supabaseAdmin.storage.from("media").remove([media.storage_path]);
  const { error } = await supabaseAdmin.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "delete",
    contentType: "media",
    contentId: id,
    previousValue: media,
  });

  revalidatePath("/admin/media");
}
