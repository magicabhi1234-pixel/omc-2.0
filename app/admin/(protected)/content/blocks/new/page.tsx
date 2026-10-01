import ContentBlockForm from "@/components/admin/content-block-form";
import { createContentBlock } from "../actions";
import { PageHeader } from "@/components/admin/page-kit";

export default function NewContentBlockPage() {
  return (
    <div>
      <PageHeader title="New Content Item" />
      <div>
        <ContentBlockForm action={createContentBlock} submitLabel="Create" />
      </div>
    </div>
  );
}
