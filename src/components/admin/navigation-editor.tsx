"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveNavigationItems } from "../../../app/admin/(protected)/settings/actions";

export interface NavItemDraft {
  label: string;
  href: string;
}

export default function NavigationEditor({
  menuKey,
  title,
  initial,
}: {
  menuKey: string;
  title: string;
  initial: NavItemDraft[];
}) {
  const [items, setItems] = useState<NavItemDraft[]>(initial);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Label"
              value={item.label}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...next[index], label: e.target.value };
                setItems(next);
              }}
            />
            <Input
              placeholder="/path or https://..."
              value={item.href}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...next[index], href: e.target.value };
                setItems(next);
              }}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => setItems(items.filter((_, i) => i !== index))}>
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { label: "", href: "" }])}>
          <Plus size={14} className="mr-1" /> Add Link
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                await saveNavigationItems(menuKey, items.filter((i) => i.label && i.href));
                toast.success("Saved.");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Save failed.");
              }
            })
          }
        >
          {pending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
