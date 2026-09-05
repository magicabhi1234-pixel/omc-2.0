import ContentBlockForm from "@/components/admin/content-block-form";
import { createContentBlock } from "../actions";

export default function NewContentBlockPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New Content Item</h1>
      <div className="mt-6">
        <ContentBlockForm action={createContentBlock} submitLabel="Create" />
      </div>
    </div>
  );
}
