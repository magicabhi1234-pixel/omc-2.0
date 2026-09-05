import UniversityForm from "@/components/admin/university-form";
import { createUniversity } from "../actions";

export default function NewUniversityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New University</h1>
      <div className="mt-6">
        <UniversityForm action={createUniversity} submitLabel="Create University" />
      </div>
    </div>
  );
}
