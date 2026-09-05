"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Copy, Trash2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteMedia } from "../../../app/admin/(protected)/media/actions";

export interface MediaFile {
  id: string;
  file_name: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaGrid({ files, canDelete }: { files: MediaFile[]; canDelete: boolean }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "pdf">("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = f.file_name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "image" && f.mime_type?.startsWith("image/")) ||
        (filter === "pdf" && f.mime_type === "application/pdf");
      return matchesSearch && matchesFilter;
    });
  }, [files, search, filter]);

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by file name..."
          className="max-w-xs"
        />
        <div className="flex gap-1">
          {(["all", "image", "pdf"] as const).map((f) => (
            <Button key={f} type="button" size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "image" ? "Images" : "PDFs"}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((file) => (
          <div key={file.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex h-32 items-center justify-center bg-slate-50">
              {file.mime_type?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-only media catalog thumbnail, not the public site
                <img src={file.url} alt={file.alt_text ?? file.file_name} className="h-full w-full object-cover" />
              ) : (
                <FileText size={32} className="text-slate-400" />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium text-slate-900" title={file.file_name}>{file.file_name}</p>
              <p className="text-xs text-slate-500">{formatBytes(file.size_bytes)}</p>
              <div className="mt-2 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                    toast.success("URL copied.");
                  }}
                >
                  <Copy size={12} className="mr-1" /> Copy
                </Button>
                {canDelete && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm(`Delete "${file.file_name}"?`)) return;
                      startTransition(async () => {
                        try {
                          await deleteMedia(file.id);
                          toast.success("Deleted.");
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "Delete failed.");
                        }
                      });
                    }}
                  >
                    <Trash2 size={12} className="text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="mt-8 text-center text-sm text-slate-500">No files found.</p>}
    </div>
  );
}
