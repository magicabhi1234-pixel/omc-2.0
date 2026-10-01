"use client";

import { useEffect, useState, useTransition } from "react";
import { ImageIcon, Loader2, Search, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { listMediaForPicker, type PickerMedia } from "../../../app/admin/(protected)/media/actions";
import { uploadToLibrary } from "@/lib/admin/upload-client";

/**
 * A URL field with "Choose from library" / "Upload" - the value is still a
 * plain URL in a named input, so it drops into any existing <form action>.
 */
export default function MediaPickerField({
  name,
  defaultValue = "",
  value: controlledValue,
  onChange,
  label,
  folder = "general",
  error,
  required,
  previewClassName = "h-16 w-16",
}: {
  /** Form field name (uncontrolled use inside a <form>). */
  name?: string;
  defaultValue?: string;
  /** Controlled use: current URL + change handler. */
  value?: string;
  onChange?: (url: string) => void;
  label: string;
  folder?: string;
  error?: string;
  required?: boolean;
  previewClassName?: string;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const setValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<PickerMedia[]>([]);
  const [loading, startLoading] = useTransition();
  const [uploading, startUploading] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const inputId = `${name ?? label.replace(/\W+/g, "-").toLowerCase()}-url`;

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      startLoading(async () => {
        try {
          setItems(await listMediaForPicker(query));
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Couldn't load the media library.");
        }
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [open, query]);

  function upload(file: File) {
    startUploading(async () => {
      const result = await uploadToLibrary(file, { folder });
      if (result.error) toast.error(result.error);
      else if (result.uploaded) {
        setValue(result.uploaded.url);
        toast.success("Uploaded and selected.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex flex-wrap items-start gap-4">
        {/* Preview doubles as a drop zone */}
        <div
          onDragOver={(e) => {
            if (Array.from(e.dataTransfer.types).includes("Files")) {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            const file = e.dataTransfer.files?.[0];
            if (!file) return;
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
            upload(file);
          }}
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:14px_14px] transition",
            previewClassName === "h-16 w-16" ? "h-24 w-36" : previewClassName,
            dragOver ? "border-2 border-dashed border-primary ring-4 ring-primary/15" : value ? "border-border" : "border-dashed border-input",
            error && "border-destructive"
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary URL
            <img src={value} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <span className="flex flex-col items-center gap-1 px-2 text-center text-[11px] text-muted-foreground">
              <ImageIcon size={18} aria-hidden="true" />
              Drop image
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-card/80 text-xs font-medium text-foreground">
              <Loader2 size={18} className="animate-spin text-primary" aria-label="Uploading" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://… or /path"
            required={required}
            aria-invalid={Boolean(error)}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
              <ImageIcon size={14} /> Choose from library
            </Button>
            <label className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-input bg-card px-3 text-[0.8rem] font-medium shadow-xs transition hover:bg-accent">
              <Upload size={14} /> {uploading ? "Uploading…" : "Upload new"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                  e.target.value = "";
                }}
              />
            </label>
            {value && (
              <Button type="button" size="sm" variant="ghost" onClick={() => setValue("")}>
                <X size={14} /> Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
            <DialogDescription>Pick an image for “{label}”.</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or alt text" className="pl-9" aria-label="Search media" />
          </div>
          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setValue(item.url);
                  setOpen(false);
                }}
                className={`group overflow-hidden rounded-lg border text-left transition hover:border-primary ${value === item.url ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
              >
                <div className="flex h-24 items-center justify-center bg-muted/50">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
                  <img src={item.url} alt={item.alt_text ?? ""} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <p className="truncate px-2 py-1 text-xs text-muted-foreground">{item.file_name}</p>
              </button>
            ))}
          </div>
          {!loading && items.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No images found.</p>}
          {loading && <p className="text-center text-xs text-muted-foreground">Loading…</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
