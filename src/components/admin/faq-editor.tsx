"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Repeatable question/answer list. Pass `hiddenFieldName` for standalone use
 * in a form action (renders its own hidden JSON input); pass `onChange`
 * instead when a parent needs to combine these with sibling fields (e.g. a
 * heading) into one larger JSON value.
 */
export default function FaqEditor({
  initial,
  hiddenFieldName,
  onChange,
}: {
  initial: FaqItem[];
  hiddenFieldName?: string;
  onChange?: (faqs: FaqItem[]) => void;
}) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initial.length > 0 ? initial : []);

  function update(next: FaqItem[]) {
    setFaqs(next);
    onChange?.(next);
  }

  return (
    <div className="space-y-3">
      {hiddenFieldName && <input type="hidden" name={hiddenFieldName} value={JSON.stringify(faqs)} readOnly />}

      {faqs.map((faq, index) => (
        <div key={index} className="flex gap-2 rounded-lg border border-border p-3">
          <div className="flex-1 space-y-2">
            <div>
              <Label className="text-xs">Question</Label>
              <Input
                value={faq.question}
                onChange={(e) => {
                  const next = [...faqs];
                  next[index] = { ...next[index], question: e.target.value };
                  update(next);
                }}
              />
            </div>
            <div>
              <Label className="text-xs">Answer</Label>
              <Textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => {
                  const next = [...faqs];
                  next[index] = { ...next[index], answer: e.target.value };
                  update(next);
                }}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => update(faqs.filter((_, i) => i !== index))}
            aria-label="Remove FAQ"
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => update([...faqs, { question: "", answer: "" }])}
      >
        <Plus size={14} className="mr-1" /> Add FAQ
      </Button>
    </div>
  );
}
