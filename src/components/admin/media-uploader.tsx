"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadToLibrary } from "@/lib/admin/upload-client";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,application/pdf";

/** Multi-file, drag-and-drop uploader. Files go straight to Storage, one at a time. */
export default function MediaUploader({ folders }: { folders: string[] }) {
  const [folder, setFolder] = useState("general");
  const [altText, setAltText] = useState("");
  const [optimize, setOptimize] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function uploadAll(files: File[]) {
    if (files.length === 0) return;
    startTransition(async () => {
      let ok = 0;
      for (const [index, file] of files.entries()) {
        setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        const result = await uploadToLibrary(file, { folder, optimize, altText: files.length === 1 ? altText : undefined });
        if (result.error) toast.error(`${file.name}: ${result.error}`);
        else ok += 1;
      }
      setProgress(null);
      setAltText("");
      if (ok) toast.success(`${ok} file${ok === 1 ? "" : "s"} uploaded.`);
    });
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        uploadAll(Array.from(e.dataTransfer.files));
      }}
      className={`rounded-xl border-2 border-dashed bg-white p-4 transition sm:p-6 ${dragging ? "border-[#0B3B68] bg-blue-50/50" : "border-slate-300"}`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload size={24} className="text-slate-400" aria-hidden="true" />
        <p className="text-sm text-slate-600">
          Drag files here, or{" "}
          <button type="button" onClick={() => inputRef.current?.click()} className="cursor-pointer font-medium text-[#0B3B68] underline" disabled={pending}>
            browse
          </button>
          . PNG, JPG, WebP, AVIF, GIF, SVG or PDF, up to 10MB each.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          aria-label="Choose files to upload"
          onChange={(e) => {
            uploadAll(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-end">
        <div className="space-y-1">
          <Label htmlFor="upload-folder" className="text-xs">Category</Label>
          <select id="upload-folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm capitalize sm:w-44">
            {folders.filter((f) => f !== "sanity").map((f) => (
              <option key={f} value={f}>{f.replace("-", " ")}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="upload-alt" className="text-xs">Alt text (single file)</Label>
          <Input id="upload-alt" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image for screen readers and SEO" maxLength={300} />
        </div>
        <label className="flex h-9 items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={optimize} onChange={(e) => setOptimize(e.target.checked)} className="h-4 w-4" />
          Compress images
        </label>
      </div>
      {progress && <p className="mt-3 text-sm text-slate-600" role="status">{progress}</p>}
    </div>
  );
}
