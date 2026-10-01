import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/db/client";
import { requirePermission } from "@/lib/auth/session";
import MediaUploader from "@/components/admin/media-uploader";
import { PageHeader } from "@/components/admin/page-kit";
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

  // Known categories plus any legacy folder present in the data (e.g. "images"), so every file is filterable.
  const folders = [...new Set([...MEDIA_FOLDERS, ...files.map((f) => f.folder)])];

  return (
    <div>
      <PageHeader
        title="Media Library"
        description={`${files.length} files · drag files anywhere on this page to upload. Large JPG/PNG images are resized to 2400px and converted to WebP.`}
        actions={<MediaUploader folders={[...MEDIA_FOLDERS]} />}
      />
      {error && (
        <p className="mb-4 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm text-warning" role="alert">
          Couldn&apos;t load the library: {error.message}
        </p>
      )}

      <MediaGrid
        files={files}
        folders={folders}
        currentUserId={profile.id}
        canManage={profile.permissions.canManageMedia}
      />
    </div>
  );
}
