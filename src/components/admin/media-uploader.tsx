"use client";

import { useActionState, useRef } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadMedia, type UploadMediaState } from "../../../app/admin/(protected)/media/actions";

const initialState: UploadMediaState = {};

export default function MediaUploader() {
  const [state, formAction, pending] = useActionState(
    async (_prev: UploadMediaState, formData: FormData) => {
      const result = await uploadMedia(_prev, formData);
      if (!result.error) {
        toast.success("File uploaded.");
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4">
      <div className="space-y-1">
        <Label htmlFor="file" className="text-xs">File</Label>
        <Input id="file" name="file" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf" required className="w-64" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="alt_text" className="text-xs">Alt Text (optional)</Label>
        <Input id="alt_text" name="alt_text" className="w-48" />
      </div>
      <Button type="submit" disabled={pending}>
        <Upload size={16} className="mr-2" /> {pending ? "Uploading..." : "Upload"}
      </Button>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
