import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import MediaUploader from "@/components/admin/media-uploader";
import MediaGrid, { type MediaFile } from "@/components/admin/media-grid";
import { MEDIA_FOLDERS } from "@/lib/admin/media";

export const metadata: Metadata = { title: "Media Library" };

export default async function MediaLibraryPage() {
  const profile = await requirePermission((p) => p.canUploadMedia);

  const { data, error } = await supabaseAdmin
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);

  // Normalise legacy rows (production's pre-existing media table has nullable
  // name/url columns and uses public_url) so the grid never crashes.
  const files: MediaFile[] = (data ?? []).map((row) => ({
    id: row.id,
    file_name: row.file_name || row.storage_path?.split("/").pop() || "Untitled",
    url: row.url || row.public_url || "",
    mime_type: row.mime_type ?? null,
    size_bytes: row.size_bytes ?? null,
    width: row.width ?? null,
    height: row.height ?? null,
    alt_text: row.alt_text ?? null,
    folder: row.folder ?? "general",
    uploaded_by: row.uploaded_by ?? null,
    created_at: row.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
      <p className="mt-1 text-slate-600">
        {files.length} files. Large JPG/PNG uploads are resized to 2400px and converted to WebP automatically.
      </p>
      {error && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="alert">
          Couldn&apos;t load the library: {error.message}
        </p>
      )}

      <div className="mt-6">
        <MediaUploader folders={[...MEDIA_FOLDERS]} />
      </div>

      <MediaGrid
        files={files}
        folders={[...MEDIA_FOLDERS]}
        currentUserId={profile.id}
        canManage={profile.permissions.canManageMedia}
      />
    </div>
  );
}
