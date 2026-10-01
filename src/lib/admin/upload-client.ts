import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createUploadTarget, replaceMedia, uploadMedia, type UploadMediaState } from "../../../app/admin/(protected)/media/actions";

let browserClient: SupabaseClient | null = null;
function storageClient() {
  // Anon key only: the signed upload token is what authorizes the write.
  browserClient ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return browserClient;
}

async function sendToStorage(file: File): Promise<{ path?: string; error?: string }> {
  const target = await createUploadTarget({ type: file.type, size: file.size });
  if (target.error || !target.path || !target.token) return { error: target.error ?? "Couldn't start the upload." };
  const { error } = await storageClient()
    .storage.from("media")
    .uploadToSignedUrl(target.path, target.token, file, { contentType: file.type });
  if (error) return { error: `Upload failed: ${error.message}` };
  return { path: target.path };
}

/** Uploads a file to the Media Library (browser -> Storage directly, then server-side validation/compression). */
export async function uploadToLibrary(
  file: File,
  opts: { folder?: string; altText?: string; optimize?: boolean } = {}
): Promise<UploadMediaState> {
  const sent = await sendToStorage(file);
  if (!sent.path) return { error: sent.error };
  return uploadMedia({ path: sent.path, type: file.type, fileName: file.name, folder: opts.folder, altText: opts.altText, optimize: opts.optimize });
}

/** Replaces an existing library file; every page using it is updated to the new URL. */
export async function replaceInLibrary(id: string, file: File, optimize = true): Promise<UploadMediaState> {
  const sent = await sendToStorage(file);
  if (!sent.path) return { error: sent.error };
  return replaceMedia({ id, path: sent.path, type: file.type, fileName: file.name, optimize });
}
