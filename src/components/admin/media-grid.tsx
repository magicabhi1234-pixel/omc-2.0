"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Copy, FileText, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteMedia, getMediaUsage, updateMediaDetails } from "../../../app/admin/(protected)/media/actions";
import { replaceInLibrary } from "@/lib/admin/upload-client";

export interface MediaFile {
  id: string;
  file_name: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  folder: string;
  uploaded_by: string | null;
  created_at: string;
}

const PAGE_SIZE = 40;

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("URL copied.");
  } catch {
    toast.error("Couldn't access the clipboard - copy the URL from the details panel.");
  }
}

export default function MediaGrid({
  files,
  folders,
  currentUserId,
  canManage,
}: {
  files: MediaFile[];
  folders: string[];
  currentUserId: string;
  canManage: boolean;
}) {
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("all");
  const [kind, setKind] = useState<"all" | "image" | "pdf">("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<MediaFile | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return files.filter((f) => {
      const matchesSearch = !term || f.file_name.toLowerCase().includes(term) || (f.alt_text ?? "").toLowerCase().includes(term);
      const matchesFolder = folder === "all" || f.folder === folder;
      const matchesKind =
        kind === "all" || (kind === "image" && f.mime_type?.startsWith("image/")) || (kind === "pdf" && f.mime_type === "application/pdf");
      return matchesSearch && matchesFolder && matchesKind;
    });
  }, [files, search, folder, kind]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of files) map[f.folder] = (map[f.folder] ?? 0) + 1;
    return map;
  }, [files]);

  return (
    <div>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by file name or alt text..."
            aria-label="Search media"
            className="pl-9"
          />
        </div>
        <select
          aria-label="Filter by category"
          value={folder}
          onChange={(e) => {
            setFolder(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm capitalize"
        >
          <option value="all">All categories ({files.length})</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f.replace("-", " ")} ({counts[f] ?? 0})
            </option>
          ))}
        </select>
        <div className="flex gap-1" role="group" aria-label="Filter by type">
          {(["all", "image", "pdf"] as const).map((k) => (
            <Button key={k} type="button" size="sm" variant={kind === k ? "default" : "outline"} onClick={() => setKind(k)} aria-pressed={kind === k}>
              {k === "all" ? "All" : k === "image" ? "Images" : "PDFs"}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">{filtered.length} matching</p>

      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {filtered.slice(0, visible).map((file) => (
          <li key={file.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button type="button" onClick={() => setSelected(file)} className="block w-full cursor-pointer text-left" aria-label={`Open details for ${file.file_name}`}>
              <div className="flex h-28 items-center justify-center bg-slate-50">
                {file.mime_type?.startsWith("image/") && file.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-only media catalog thumbnail
                  <img src={file.url} alt={file.alt_text ?? ""} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <FileText size={32} className="text-slate-400" aria-hidden="true" />
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-slate-900" title={file.file_name}>{file.file_name}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {file.folder.replace("-", " ")} · {formatBytes(file.size_bytes)}
                  {!file.alt_text && file.mime_type?.startsWith("image/") && <span className="text-amber-700"> · no alt</span>}
                </p>
              </div>
            </button>
            <div className="flex border-t border-slate-100">
              <Button type="button" size="sm" variant="ghost" className="flex-1 rounded-none" onClick={() => copy(file.url)} disabled={!file.url}>
                <Copy size={12} className="mr-1" /> Copy URL
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="mt-8 text-center text-sm text-slate-500">No files found.</p>}
      {visible < filtered.length && (
        <div className="mt-6 text-center">
          <Button type="button" variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Load more ({filtered.length - visible} remaining)
          </Button>
        </div>
      )}

      {selected && (
        <MediaDetails
          key={selected.id}
          file={selected}
          folders={folders}
          canEdit={canManage || selected.uploaded_by === currentUserId}
          canManage={canManage}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function MediaDetails({
  file,
  folders,
  canEdit,
  canManage,
  onClose,
}: {
  file: MediaFile;
  folders: string[];
  canEdit: boolean;
  canManage: boolean;
  onClose: () => void;
}) {
  const [fileName, setFileName] = useState(file.file_name);
  const [altText, setAltText] = useState(file.alt_text ?? "");
  const [folder, setFolder] = useState(file.folder);
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const result = await updateMediaDetails(file.id, { file_name: fileName, alt_text: altText, folder });
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Details saved.");
        onClose();
      }
    });

  const replace = (newFile: File) =>
    startTransition(async () => {
      const result = await replaceInLibrary(file.id, newFile);
      if (result.error) toast.error(result.error);
      else {
        toast.success("File replaced. Every page using it now shows the new version.");
        onClose();
      }
    });

  const remove = () =>
    startTransition(async () => {
      const usage = await getMediaUsage(file.id);
      const usedIn = usage.length ? `\n\nIt is used by ${usage.length} item(s): ${usage.slice(0, 5).map((u) => u.label).join(", ")}${usage.length > 5 ? "…" : ""}. Those images will break.` : "";
      if (!window.confirm(`Delete "${file.file_name}"? This cannot be undone.${usedIn}`)) return;
      const result = await deleteMedia(file.id);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Deleted.");
        onClose();
      }
    });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate">{file.file_name}</DialogTitle>
          <DialogDescription>
            {[file.mime_type, formatBytes(file.size_bytes), file.width && file.height ? `${file.width}×${file.height}` : null, new Date(file.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })]
              .filter(Boolean)
              .join(" · ")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex min-h-40 items-center justify-center rounded-lg bg-slate-50">
            {file.mime_type?.startsWith("image/") && file.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview
              <img src={file.url} alt={file.alt_text ?? ""} className="max-h-64 w-full object-contain" />
            ) : (
              <FileText size={48} className="text-slate-400" aria-hidden="true" />
            )}
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="media-url">URL</Label>
              <div className="flex gap-2">
                <Input id="media-url" value={file.url} readOnly onFocus={(e) => e.target.select()} />
                <Button type="button" variant="outline" size="icon" onClick={() => copy(file.url)} aria-label="Copy URL">
                  <Copy size={14} />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="media-name">File name</Label>
              <Input id="media-name" value={fileName} onChange={(e) => setFileName(e.target.value)} disabled={!canEdit} maxLength={150} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="media-alt">Alt text</Label>
              <Input id="media-alt" value={altText} onChange={(e) => setAltText(e.target.value)} disabled={!canEdit} maxLength={300} placeholder="Describe the image" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="media-folder">Category</Label>
              <select id="media-folder" value={folder} onChange={(e) => setFolder(e.target.value)} disabled={!canEdit} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm capitalize">
                {folders.map((f) => (
                  <option key={f} value={f}>{f.replace("-", " ")}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2">
            {canManage && (
              <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                <RefreshCw size={14} className="mr-1" /> Replace file
                <input
                  type="file"
                  className="sr-only"
                  accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,application/pdf"
                  disabled={pending}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) replace(f);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
            {canManage && (
              <Button type="button" variant="outline" onClick={remove} disabled={pending} className="text-red-600">
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            )}
          </div>
          {canEdit && (
            <Button type="button" onClick={save} disabled={pending}>
              <Pencil size={14} className="mr-1" /> {pending ? "Working..." : "Save details"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
