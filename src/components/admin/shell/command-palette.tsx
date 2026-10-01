"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, FileText, GraduationCap, HelpCircle, Inbox, Loader2, Newspaper, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PermissionSet } from "@/lib/auth/permissions";
import { visibleNav } from "./nav";
import { globalSearch, type SearchHit } from "../../../../app/admin/(protected)/shell-actions";

type Row = { key: string; group: string; label: string; hint?: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }> };

const HIT_ICONS: Record<SearchHit["type"], Row["icon"]> = {
  "Landing page": FileText,
  "Blog post": Newspaper,
  University: GraduationCap,
  Lead: Inbox,
  FAQ: HelpCircle,
};

export default function CommandPalette({
  open,
  onOpenChange,
  permissions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: PermissionSet;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searching, startSearch] = useTransition();
  const listRef = useRef<HTMLUListElement>(null);

  const staticRows = useMemo<Row[]>(() => {
    const actions: Row[] = [
      { key: "new-page", group: "Quick actions", label: "New landing page", href: "/admin/pages/new", icon: Plus },
      { key: "new-blog", group: "Quick actions", label: "New blog post", href: "/admin/blogs/new", icon: Plus },
      ...(permissions.canUploadMedia ? [{ key: "upload", group: "Quick actions", label: "Upload media", href: "/admin/media", icon: Plus }] : []),
    ];
    const pages = visibleNav(permissions).flatMap((g) =>
      g.items.map((i) => ({ key: i.href, group: "Go to", label: i.label, hint: g.label, href: i.href, icon: i.icon, keywords: i.keywords }))
    );
    return [...actions, ...pages];
  }, [permissions]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const timer = setTimeout(() => startSearch(async () => setHits(await globalSearch(q))), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const rows = useMemo<Row[]>(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? staticRows.filter((r) => `${r.label} ${(r as Row & { keywords?: string }).keywords ?? ""} ${r.hint ?? ""}`.toLowerCase().includes(q))
      : staticRows;
    const results = q.length >= 2 ? hits.map((h, i) => ({ key: `hit-${i}`, group: `Results`, label: h.title, hint: `${h.type}${h.subtitle ? ` · ${h.subtitle}` : ""}`, href: h.href, icon: HIT_ICONS[h.type] })) : [];
    return [...results, ...matched];
  }, [query, hits, staticRows]);

  const go = (row: Row | undefined) => {
    if (!row) return;
    onOpenChange(false);
    setQuery("");
    router.push(row.href);
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let lastGroup = "";
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setQuery("");
          setHits([]);
        }
      }}
    >
      <DialogContent showCloseButton={false} className="top-[15vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search the dashboard</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          {searching ? <Loader2 size={18} className="animate-spin text-muted-foreground" aria-hidden="true" /> : <Search size={18} className="text-muted-foreground" aria-hidden="true" />}
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
              if (e.target.value.trim().length < 2) setHits([]);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(rows.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(rows[activeIndex]);
              }
            }}
            placeholder="Search pages, posts, universities, leads…"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={rows[activeIndex] ? `cmd-${activeIndex}` : undefined}
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground sm:block">Esc</kbd>
        </div>
        <ul id="command-results" ref={listRef} role="listbox" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          {rows.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">{searching ? "Searching…" : "No results"}</li>}
          {rows.map((row, index) => {
            const header = row.group !== lastGroup ? row.group : null;
            lastGroup = row.group;
            const Icon = row.icon;
            return (
              <li key={row.key} role="presentation">
                {header && <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{header}</p>}
                <button
                  id={`cmd-${index}`}
                  data-index={index}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => go(row)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex ? "bg-secondary text-secondary-foreground" : "text-foreground"
                  )}
                >
                  <Icon size={16} className={index === activeIndex ? "text-primary" : "text-muted-foreground"} />
                  <span className="min-w-0 flex-1 truncate font-medium">{row.label}</span>
                  {row.hint && <span className="hidden max-w-[45%] truncate text-xs text-muted-foreground sm:block">{row.hint}</span>}
                  {index === activeIndex && <CornerDownLeft size={14} className="text-muted-foreground" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-border bg-muted/50 px-4 py-2 text-[11px] text-muted-foreground">
          <span><kbd className="font-sans">↑↓</kbd> navigate</span>
          <span><kbd className="font-sans">↵</kbd> open</span>
          <span><kbd className="font-sans">Ctrl/⌘ K</kbd> toggle</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
