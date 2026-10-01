import UniversityForm from "@/components/admin/university-form";
import { createUniversity } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default function NewUniversityPage() {
  return (
    <div>
      <PageHeader title="New University" />
      <div>
        <UniversityForm action={createUniversity} submitLabel="Create University" />
      </div>
    </div>
  );
}
