"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Upload, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToLibrary } from "@/lib/admin/upload-client";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,application/pdf";

/**
 * Compact upload toolbar + full-window drop zone: drag files anywhere on the
 * Media Library page. Files go straight to Storage, one at a time, then are
 * validated/compressed server-side. Alt text is added afterwards in the
 * file's details (files without it are flagged in the grid).
 */
export default function MediaUploader({ folders }: { folders: string[] }) {
  const [folder, setFolder] = useState("general");
  const [optimize, setOptimize] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; name: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const depth = useRef(0);

  const uploadAll = (files: File[]) => {
    if (files.length === 0) return;
    const options = { folder, optimize };
    startTransition(async () => {
      let ok = 0;
      for (const [index, file] of files.entries()) {
        setProgress({ done: index, total: files.length, name: file.name });
        const result = await uploadToLibrary(file, options);
        if (result.error) toast.error(`${file.name}: ${result.error}`);
        else ok += 1;
      }
      setProgress(null);
      if (ok) toast.success(`${ok} file${ok === 1 ? "" : "s"} uploaded.`);
    });
  };

  // Latest uploader for the window-level drop listener (registered once).
  const uploadRef = useRef(uploadAll);
  useEffect(() => {
    uploadRef.current = uploadAll;
  });

  useEffect(() => {
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const onEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth.current += 1;
      setDragging(true);
    };
    const onLeave = () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setDragging(false);
    };
    const onOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth.current = 0;
      setDragging(false);
      uploadRef.current(Array.from(e.dataTransfer?.files ?? []));
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("dragover", onOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="upload-folder">Upload category</label>
        <select
          id="upload-folder"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="h-9 cursor-pointer rounded-lg border border-input bg-card px-3 text-sm capitalize shadow-xs"
          title="Category for new uploads"
        >
          {folders.filter((f) => f !== "sanity").map((f) => (
            <option key={f} value={f}>{f.replace("-", " ")}</option>
          ))}
        </select>
        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm shadow-xs">
          <input type="checkbox" checked={optimize} onChange={(e) => setOptimize(e.target.checked)} className="size-4 accent-[var(--primary)]" />
          Compress
        </label>
        <Button type="button" onClick={() => inputRef.current?.click()} disabled={pending}>
          {pending ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {progress ? `Uploading ${progress.done + 1}/${progress.total}` : "Upload files"}
        </Button>
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

      {progress && (
        <div className="fixed right-4 bottom-4 z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl" role="status">
          <p className="truncate text-sm font-medium">Uploading {progress.name}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((progress.done + 0.5) / progress.total) * 100}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {progress.done + 1} of {progress.total}
          </p>
        </div>
      )}

      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-primary/10 p-6 backdrop-blur-[2px]" aria-hidden="true">
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-primary bg-card px-10 py-8 text-center shadow-2xl">
            <UploadCloud size={36} className="text-primary" />
            <p className="mt-3 text-base font-semibold">Drop to upload</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Into <span className="capitalize">{folder.replace("-", " ")}</span>
              {optimize ? " · compressed to WebP" : ""}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
