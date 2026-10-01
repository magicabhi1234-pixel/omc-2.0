import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import ContentBlockForm from "@/components/admin/content-block-form";
import { updateContentBlock } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default async function EditContentBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin.from("content_blocks").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <PageHeader title="Edit Content Item" />
      <div>
        <ContentBlockForm action={updateContentBlock.bind(null, id)} initial={data} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
