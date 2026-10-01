"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveNavigationItems } from "../../../app/admin/(protected)/settings/actions";

export interface NavItemDraft {
  label: string;
  href: string;
  opens_new_tab?: boolean;
}

interface Row extends NavItemDraft {
  key: string;
}

const newKey = () => Math.random().toString(36).slice(2);

export default function NavigationEditor({
  menuKey,
  title,
  description,
  initial,
}: {
  menuKey: string;
  title: string;
  description?: string;
  initial: NavItemDraft[];
}) {
  const [items, setItems] = useState<Row[]>(() => initial.map((i) => ({ ...i, key: newKey() })));
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  const update = (next: Row[]) => {
    setItems(next);
    setDirty(true);
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update(next);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {dirty && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Unsaved changes</span>}
      </div>

      <ol className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li
            key={item.key}
            draggable
            onDragStart={() => setDragKey(item.key)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              const from = items.findIndex((i) => i.key === dragKey);
              if (from >= 0 && from !== index) move(from, index);
              setDragKey(null);
            }}
            className={`grid gap-2 rounded-lg border p-2 sm:grid-cols-[auto_1fr_1fr_auto_auto] sm:items-center ${dragKey === item.key ? "border-[#0B3B68] bg-blue-50/40" : "border-slate-100"}`}
          >
            <span className="hidden cursor-grab text-slate-400 sm:block" aria-hidden="true">
              <GripVertical size={16} />
            </span>
            <Input
              aria-label={`Link ${index + 1} label`}
              placeholder="Label"
              value={item.label}
              maxLength={60}
              onChange={(e) => update(items.map((i) => (i.key === item.key ? { ...i, label: e.target.value } : i)))}
            />
            <Input
              aria-label={`Link ${index + 1} URL`}
              placeholder="/path or https://..."
              value={item.href}
              maxLength={500}
              onChange={(e) => update(items.map((i) => (i.key === item.key ? { ...i, href: e.target.value } : i)))}
            />
            <label className="flex items-center gap-2 text-xs whitespace-nowrap text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(item.opens_new_tab)}
                onChange={(e) => update(items.map((i) => (i.key === item.key ? { ...i, opens_new_tab: e.target.checked } : i)))}
                className="h-4 w-4"
              />
              New tab
            </label>
            <div className="flex justify-end gap-1">
              <Button type="button" variant="ghost" size="icon" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={`Move ${item.label || "link"} up`}>
                <ArrowUp size={16} />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label={`Move ${item.label || "link"} down`}>
                <ArrowDown size={16} />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => update(items.filter((i) => i.key !== item.key))} aria-label={`Remove ${item.label || "link"}`}>
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </div>
          </li>
        ))}
      </ol>
      {items.length === 0 && <p className="mt-3 text-sm text-slate-500">No links. The site shows its built-in default menu until you add some.</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { key: newKey(), label: "", href: "" }])}>
          <Plus size={14} className="mr-1" /> Add link
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={pending || !dirty}
          onClick={() =>
            startTransition(async () => {
              const result = await saveNavigationItems(
                menuKey,
                items.filter((i) => i.label.trim() || i.href.trim()).map(({ label, href, opens_new_tab }) => ({ label, href, opens_new_tab }))
              );
              if (result.error) toast.error(result.error);
              else {
                toast.success(`${title} saved.`);
                setDirty(false);
              }
            })
          }
        >
          {pending ? "Saving..." : "Save menu"}
        </Button>
      </div>
    </section>
  );
}
