"use client";

import { useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { toast } from "sonner";
import { Copy, FileText, Image as ImageIcon, LayoutGrid, List, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/admin/page-kit";
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

const VIEW_KEY = "omc-admin-media-view";
const VIEW_EVENT = "omc-media-view";
function readView(): "grid" | "list" {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}
function subscribeView(onChange: () => void) {
  window.addEventListener(VIEW_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(VIEW_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

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

  // Remembered per browser; the server snapshot ("grid") keeps hydration consistent.
  const view = useSyncExternalStore(subscribeView, readView, () => "grid" as const);
  const changeView = (next: "grid" | "list") => {
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(VIEW_EVENT));
  };
  const isImage = (f: MediaFile) => Boolean(f.mime_type?.startsWith("image/") && f.url);

  return (
    <div className="rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
      <div className="flex flex-col gap-3 border-b border-border p-3 sm:p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by file name or alt text…"
            aria-label="Search media"
            className="h-9 pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by category"
            value={folder}
            onChange={(e) => {
              setFolder(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            className="h-9 cursor-pointer rounded-lg border border-input bg-card px-3 text-sm capitalize shadow-xs"
          >
            <option value="all">All categories ({files.length})</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f.replace("-", " ")} ({counts[f] ?? 0})
              </option>
            ))}
          </select>
          <div className="flex rounded-lg bg-muted p-1" role="group" aria-label="Filter by type">
            {(["all", "image", "pdf"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={cn("cursor-pointer rounded-md px-3 py-1 text-sm transition", kind === k ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {k === "all" ? "All" : k === "image" ? "Images" : "PDFs"}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg bg-muted p-1" role="group" aria-label="View">
            <button type="button" onClick={() => changeView("grid")} aria-pressed={view === "grid"} aria-label="Grid view" className={cn("cursor-pointer rounded-md p-1.5 transition", view === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <LayoutGrid size={16} />
            </button>
            <button type="button" onClick={() => changeView("list")} aria-pressed={view === "list"} aria-label="List view" className={cn("cursor-pointer rounded-md p-1.5 transition", view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="px-4 pt-3 text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "file" : "files"}</p>

      {view === "grid" ? (
        <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {filtered.slice(0, visible).map((file) => (
            <li key={file.id} className="group relative overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/30 hover:shadow-md">
              <button type="button" onClick={() => setSelected(file)} className="block w-full cursor-pointer text-left" aria-label={`Open details for ${file.file_name}`}>
                <div className="relative flex aspect-[4/3] items-center justify-center bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
                  {isImage(file) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-only media catalog thumbnail
                    <img src={file.url} alt={file.alt_text ?? ""} loading="lazy" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <FileText size={30} className="text-muted-foreground" aria-hidden="true" />
                  )}
                  {!file.alt_text && isImage(file) && (
                    <span className="absolute top-2 left-2 rounded-full bg-warning-soft px-1.5 py-0.5 text-[10px] font-semibold text-warning ring-1 ring-warning/20">No alt</span>
                  )}
                </div>
                <div className="border-t border-border/60 p-2.5">
                  <p className="truncate text-xs font-medium text-foreground" title={file.file_name}>{file.file_name}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {file.folder.replace("-", " ")} · {formatBytes(file.size_bytes)}
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => copy(file.url)}
                disabled={!file.url}
                aria-label={`Copy URL of ${file.file_name}`}
                title="Copy URL"
                className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-lg bg-card/90 text-muted-foreground opacity-0 shadow-sm ring-1 ring-border transition group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
              >
                <Copy size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto p-2">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2">File</th>
                <th className="hidden px-3 py-2 md:table-cell">Category</th>
                <th className="hidden px-3 py-2 sm:table-cell">Size</th>
                <th className="hidden px-3 py-2 lg:table-cell">Dimensions</th>
                <th className="hidden px-3 py-2 lg:table-cell">Alt text</th>
                <th className="px-3 py-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, visible).map((file) => (
                <tr key={file.id} className="border-t border-border/70 hover:bg-accent/50">
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => setSelected(file)} className="flex cursor-pointer items-center gap-3 text-left">
                      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted/50">
                        {isImage(file) ? (
                          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                          <img src={file.url} alt="" loading="lazy" className="size-full object-cover" />
                        ) : (
                          <FileText size={16} className="text-muted-foreground" aria-hidden="true" />
                        )}
                      </span>
                      <span className="max-w-56 truncate font-medium text-foreground hover:text-primary" title={file.file_name}>{file.file_name}</span>
                    </button>
                  </td>
                  <td className="hidden px-3 py-2 text-muted-foreground capitalize md:table-cell">{file.folder.replace("-", " ")}</td>
                  <td className="hidden px-3 py-2 text-muted-foreground tabular-nums sm:table-cell">{formatBytes(file.size_bytes)}</td>
                  <td className="hidden px-3 py-2 text-muted-foreground tabular-nums lg:table-cell">{file.width && file.height ? `${file.width}×${file.height}` : "—"}</td>
                  <td className="hidden max-w-64 truncate px-3 py-2 lg:table-cell">{file.alt_text || <span className="text-warning">Missing</span>}</td>
                  <td className="px-3 py-2 text-right">
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => copy(file.url)} aria-label={`Copy URL of ${file.file_name}`} title="Copy URL">
                      <Copy size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filtered.length === 0 && <EmptyState iconNode={<ImageIcon size={22} aria-hidden="true" />} title="No files found" description="Try another search, category or type." />}
      {visible < filtered.length && (
        <div className="pb-5 text-center">
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
          <div className="flex min-h-40 items-center justify-center rounded-lg bg-muted/50">
            {file.mime_type?.startsWith("image/") && file.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview
              <img src={file.url} alt={file.alt_text ?? ""} className="max-h-64 w-full object-contain" />
            ) : (
              <FileText size={48} className="text-muted-foreground" aria-hidden="true" />
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
              <select id="media-folder" value={folder} onChange={(e) => setFolder(e.target.value)} disabled={!canEdit} className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm capitalize">
                {folders.map((f) => (
                  <option key={f} value={f}>{f.replace("-", " ")}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-border/60 pt-4">
          <div className="flex flex-wrap gap-2">
            {canManage && (
              <label className="inline-flex cursor-pointer items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/50">
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
              <Button type="button" variant="outline" onClick={remove} disabled={pending} className="text-destructive">
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
