import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import ContentBlockForm from "@/components/admin/content-block-form";
import { updateContentBlock } from "../actions";

export default async function EditContentBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin.from("content_blocks").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit Content Item</h1>
      <div className="mt-6">
        <ContentBlockForm action={updateContentBlock.bind(null, id)} initial={data} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
