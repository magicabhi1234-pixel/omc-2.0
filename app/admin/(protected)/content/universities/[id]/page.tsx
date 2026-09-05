import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import UniversityForm from "@/components/admin/university-form";
import { updateUniversity } from "../actions";

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin.from("universities").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit University</h1>
      <div className="mt-6">
        <UniversityForm
          action={updateUniversity.bind(null, id)}
          initial={data}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
