import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import UniversityForm from "@/components/admin/university-form";
import { updateUniversity } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin.from("universities").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <PageHeader title="Edit University" />
      <div>
        <UniversityForm
          action={updateUniversity.bind(null, id)}
          initial={data}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
