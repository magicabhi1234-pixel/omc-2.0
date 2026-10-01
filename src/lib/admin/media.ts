import "server-only";
import sharp, { type Metadata as SharpMetadata } from "sharp";
import { supabaseAdmin } from "@/lib/db/client";

export const MEDIA_BUCKET = "media";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const MEDIA_FOLDERS = ["general", "logos", "universities", "blog", "landing-pages", "testimonials", "documents", "sanity"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

const RASTER_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const OTHER_TYPES: Record<string, string> = {
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

/** Longest edge kept on upload - larger than any slot the site renders, at 2x. */
const MAX_DIMENSION = 2400;

export interface ProcessedUpload {
  bytes: Buffer;
  contentType: string;
  ext: string;
  width: number | null;
  height: number | null;
  optimized: boolean;
}

/**
 * SVG is XML that can carry script. We only accept SVGs without any active
 * content (scripts, event handlers, javascript: URLs, foreignObject, external
 * references) and only from roles that manage the whole library.
 */
function assertSafeSvg(text: string) {
  const dangerous = /<script|<foreignObject|\bon[a-z]+\s*=|javascript:|<iframe|<embed|<object|xlink:href\s*=\s*["']\s*(?!#)|href\s*=\s*["']\s*(?!#)/i;
  if (dangerous.test(text)) {
    throw new Error("This SVG contains scripts, event handlers or external links and can't be uploaded. Export a plain SVG or use PNG/WebP.");
  }
}

export const ALLOWED_UPLOAD_TYPES = [...Object.keys(RASTER_TYPES), ...Object.keys(OTHER_TYPES)];

/**
 * Validates and (optionally) compresses an uploaded file. `type` is the
 * client-declared MIME type; it's verified against the actual bytes.
 */
export async function processUpload(
  input: Buffer,
  type: string,
  opts: { allowSvg: boolean; optimize: boolean }
): Promise<ProcessedUpload> {
  if (input.length === 0) throw new Error("The file is empty.");
  if (input.length > MAX_UPLOAD_BYTES) throw new Error("File is too large (max 10MB).");

  if (type === "image/svg+xml") {
    if (!opts.allowSvg) throw new Error("Only Admins can upload SVG files. Use PNG, JPG or WebP instead.");
    assertSafeSvg(input.toString("utf8"));
    return { bytes: input, contentType: type, ext: "svg", width: null, height: null, optimized: false };
  }
  if (type === "application/pdf") {
    if (input.subarray(0, 5).toString() !== "%PDF-") throw new Error("This file isn't a valid PDF.");
    return { bytes: input, contentType: type, ext: "pdf", width: null, height: null, optimized: false };
  }
  if (!RASTER_TYPES[type]) {
    throw new Error(`Unsupported file type. Allowed: ${[...Object.keys(RASTER_TYPES), ...Object.keys(OTHER_TYPES)].map((t) => t.split("/")[1].replace("+xml", "")).join(", ").toUpperCase()}.`);
  }

  // Decoding with sharp also verifies the bytes really are the claimed image type.
  let meta: SharpMetadata;
  try {
    meta = await sharp(input, { animated: type === "image/gif" }).metadata();
  } catch {
    throw new Error("This file couldn't be read as an image.");
  }

  // GIFs (often animated) and already-modern formats under the size cap are kept as-is.
  const tooLarge = (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;
  const convertible = type === "image/png" || type === "image/jpeg";
  if (!opts.optimize || type === "image/gif" || (!tooLarge && !convertible)) {
    return { bytes: input, contentType: type, ext: RASTER_TYPES[type], width: meta.width ?? null, height: meta.height ?? null, optimized: false };
  }

  const pipeline = sharp(input).rotate().resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true });
  const outputIsAvif = type === "image/avif";
  const output = outputIsAvif ? await pipeline.avif({ quality: 60 }).toBuffer({ resolveWithObject: true }) : await pipeline.webp({ quality: 82 }).toBuffer({ resolveWithObject: true });

  // Keep the original if "optimizing" didn't actually make it smaller.
  if (output.data.length >= input.length && !tooLarge) {
    return { bytes: input, contentType: type, ext: RASTER_TYPES[type], width: meta.width ?? null, height: meta.height ?? null, optimized: false };
  }
  return {
    bytes: output.data,
    contentType: outputIsAvif ? "image/avif" : "image/webp",
    ext: outputIsAvif ? "avif" : "webp",
    width: output.info.width,
    height: output.info.height,
    optimized: true,
  };
}

/** Storage path: <folder>/<uuid>.<ext> - never derived from the user's file name. */
export function storagePathFor(folder: MediaFolder, ext: string) {
  return `${folder}/${crypto.randomUUID()}.${ext}`;
}

/**
 * Browsers upload straight to Storage (Vercel caps function request bodies
 * at ~4.5MB) under incoming/, via a one-time signed URL. The server then
 * validates/compresses from there and moves the result into the library.
 */
export const INCOMING_PREFIX = "incoming/";

export async function createIncomingUpload(type: string, size: number) {
  if (!ALLOWED_UPLOAD_TYPES.includes(type)) throw new Error("Unsupported file type.");
  if (size <= 0 || size > MAX_UPLOAD_BYTES) throw new Error("File is too large (max 10MB).");
  const path = `${INCOMING_PREFIX}${crypto.randomUUID()}`;
  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Couldn't start the upload.");
  return { path: data.path, token: data.token };
}

/** Reads (and then removes) a browser-uploaded file from incoming/. */
export async function takeIncomingUpload(path: string): Promise<Buffer> {
  if (!/^incoming\/[0-9a-f-]{36}$/.test(path)) throw new Error("Invalid upload reference.");
  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).download(path);
  await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([path]);
  if (error || !data) throw new Error("The uploaded file couldn't be found - please try again.");
  return Buffer.from(await data.arrayBuffer());
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\- ()]+/g, "_").slice(0, 150) || "file";
}

/** Tables (and columns) where content can reference a media URL. */
const URL_REFERENCE_TABLES = ["universities", "testimonials", "blog_posts", "landing_pages", "site_settings", "content_blocks"] as const;

/** Rows that mention `url` anywhere, per table - used for delete warnings and replace. */
export async function findMediaReferences(url: string) {
  const refs: { table: string; key: string; label: string }[] = [];
  for (const table of URL_REFERENCE_TABLES) {
    const { data } = await supabaseAdmin.from(table).select("*");
    for (const row of data ?? []) {
      if (!JSON.stringify(row).includes(url)) continue;
      const r = row as Record<string, unknown>;
      refs.push({
        table,
        key: String(r.id ?? r.key),
        label: String(r.title ?? r.name ?? r.slug ?? r.key ?? r.id),
      });
    }
  }
  return refs;
}

/** Rewrites every reference to `oldUrl` in content to `newUrl`. Returns the number of rows updated. */
export async function rewriteMediaReferences(oldUrl: string, newUrl: string): Promise<number> {
  let updated = 0;
  for (const table of URL_REFERENCE_TABLES) {
    const { data } = await supabaseAdmin.from(table).select("*");
    for (const row of data ?? []) {
      const json = JSON.stringify(row);
      if (!json.includes(oldUrl)) continue;
      const next = JSON.parse(json.split(oldUrl).join(newUrl)) as Record<string, unknown>;
      const keyColumn = "id" in next ? "id" : "key";
      const keyValue = next[keyColumn];
      delete next[keyColumn];
      delete next.created_at;
      delete next.updated_at;
      const { error } = await supabaseAdmin.from(table).update(next).eq(keyColumn, keyValue as string);
      if (error) throw new Error(`Updating ${table} failed: ${error.message}`);
      updated += 1;
    }
  }
  return updated;
}
