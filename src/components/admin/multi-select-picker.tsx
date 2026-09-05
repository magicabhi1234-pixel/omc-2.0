"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export interface PickableOption {
  id: string;
  label: string;
}

export default function MultiSelectPicker({
  options,
  initial,
  hiddenFieldName,
  searchPlaceholder = "Search...",
}: {
  options: PickableOption[];
  initial: string[];
  hiddenFieldName: string;
  searchPlaceholder?: string;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div className="space-y-2">
      <input type="hidden" name={hiddenFieldName} value={selected.join(",")} />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
      />
      <p className="text-xs text-slate-500">{selected.length} selected</p>
      <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-3">
        {filtered.length === 0 && <p className="text-sm text-slate-500">No matches.</p>}
        {filtered.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={selected.includes(option.id)}
              onCheckedChange={(checked: boolean) => {
                setSelected(checked ? [...selected, option.id] : selected.filter((id) => id !== option.id));
              }}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
