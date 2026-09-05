import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import MediaUploader from "@/components/admin/media-uploader";
import MediaGrid from "@/components/admin/media-grid";

export default async function MediaLibraryPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("media")
    .select("id, file_name, url, mime_type, size_bytes, alt_text, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
      <p className="mt-1 text-slate-600">{(data ?? []).length} files</p>

      <div className="mt-6">
        <MediaUploader />
      </div>

      <MediaGrid files={data ?? []} canDelete={profile.permissions.canManageMedia} />
    </div>
  );
}
