"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
}

/**
 * Generic repeatable-record editor (e.g. Why Choose items, Stats, Benefits,
 * Career Roles). Two modes: pass `hiddenFieldName` for a self-contained
 * field usable directly in a form action (renders its own hidden JSON
 * input); pass `onChange` instead when a parent component needs to combine
 * these items with sibling fields (e.g. a heading) into one larger JSON
 * value - the parent then owns the hidden input.
 */
export default function RepeatableItemsEditor({
  fields,
  initial,
  hiddenFieldName,
  onChange,
  itemLabel = "Item",
}: {
  fields: FieldDef[];
  initial: Record<string, string>[];
  hiddenFieldName?: string;
  onChange?: (items: Record<string, string>[]) => void;
  itemLabel?: string;
}) {
  const [items, setItems] = useState<Record<string, string>[]>(initial);

  function update(next: Record<string, string>[]) {
    setItems(next);
    onChange?.(next);
  }

  return (
    <div className="space-y-3">
      {hiddenFieldName && <input type="hidden" name={hiddenFieldName} value={JSON.stringify(items)} readOnly />}

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 rounded-lg border border-border p-3">
          <div className="flex-1 space-y-2">
            {fields.map((field) => (
              <div key={field.name}>
                <Label className="text-xs">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    rows={2}
                    placeholder={field.placeholder}
                    value={item[field.name] ?? ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], [field.name]: e.target.value };
                      update(next);
                    }}
                  />
                ) : (
                  <Input
                    placeholder={field.placeholder}
                    value={item[field.name] ?? ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], [field.name]: e.target.value };
                      update(next);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => update(items.filter((_, i) => i !== index))}
            aria-label={`Remove ${itemLabel}`}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, {}])}>
        <Plus size={14} className="mr-1" /> Add {itemLabel}
      </Button>
    </div>
  );
}
