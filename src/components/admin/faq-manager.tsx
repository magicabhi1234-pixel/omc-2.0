"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteFaq, reorderFaqs, saveFaq } from "../../../app/admin/(protected)/faqs/actions";

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  status: "draft" | "published";
}

type Draft = { id: string | null; question: string; answer: string; status: "draft" | "published" };

export default function FaqManager({
  placement,
  initial,
  canDelete,
}: {
  placement: string;
  initial: FaqRow[];
  canDelete: boolean;
}) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const persistOrder = (next: FaqRow[]) => {
    const previous = rows;
    setRows(next);
    startTransition(async () => {
      const result = await reorderFaqs(placement, next.map((r) => r.id));
      if (result.error) {
        setRows(previous);
        toast.error(result.error);
      } else toast.success("Order saved.");
    });
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= rows.length || from === to) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
  };

  const submit = () => {
    if (!editing) return;
    const draft = editing;
    startTransition(async () => {
      const result = await saveFaq(draft.id, { question: draft.question, answer: draft.answer, status: draft.status, placement });
      if (result.error) return void toast.error(result.error);
      const saved: FaqRow = { id: result.id!, question: draft.question.trim(), answer: draft.answer.trim(), status: draft.status };
      setRows((current) => (draft.id ? current.map((r) => (r.id === draft.id ? saved : r)) : [...current, saved]));
      setEditing(null);
      toast.success(draft.id ? "FAQ updated." : "FAQ added.");
    });
  };

  const remove = (row: FaqRow) => {
    if (!window.confirm(`Delete "${row.question}"?`)) return;
    startTransition(async () => {
      const result = await deleteFaq(row.id);
      if (result.error) return void toast.error(result.error);
      setRows((current) => current.filter((r) => r.id !== row.id));
      toast.success("FAQ deleted.");
    });
  };

  return (
    <div className="space-y-4">
      <ol className="space-y-2">
        {rows.map((row, index) => (
          <li
            key={row.id}
            draggable={!pending}
            onDragStart={() => setDragId(row.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              const from = rows.findIndex((r) => r.id === dragId);
              setDragId(null);
              if (from >= 0) move(from, index);
            }}
            className={`flex gap-3 rounded-xl border bg-white p-3 sm:p-4 ${dragId === row.id ? "border-[#0B3B68]" : "border-slate-200"}`}
          >
            <span className="mt-1 hidden cursor-grab text-slate-400 sm:block" aria-hidden="true">
              <GripVertical size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{row.question}</p>
                {row.status === "draft" && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Draft</span>}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.answer}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
              <Button type="button" variant="ghost" size="icon" onClick={() => move(index, index - 1)} disabled={index === 0 || pending} aria-label="Move up">
                <ArrowUp size={16} />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => move(index, index + 1)} disabled={index === rows.length - 1 || pending} aria-label="Move down">
                <ArrowDown size={16} />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setEditing({ ...row })} aria-label={`Edit "${row.question}"`}>
                <Pencil size={16} />
              </Button>
              {canDelete && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(row)} disabled={pending} aria-label={`Delete "${row.question}"`}>
                  <Trash2 size={16} className="text-red-600" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ol>
      {rows.length === 0 && !editing && <p className="text-sm text-slate-500">No FAQs on this page yet.</p>}

      {editing ? (
        <div className="space-y-3 rounded-xl border border-[#0B3B68]/30 bg-white p-4">
          <h3 className="font-semibold text-slate-900">{editing.id ? "Edit FAQ" : "New FAQ"}</h3>
          <div className="space-y-1">
            <Label htmlFor="faq-question">Question</Label>
            <Input id="faq-question" value={editing.question} maxLength={300} onChange={(e) => setEditing({ ...editing, question: e.target.value })} placeholder="Is an online MBA valid for government jobs?" />
            <p className="text-xs text-slate-500">Phrase it the way people search or ask a voice assistant.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea id="faq-answer" rows={5} value={editing.answer} maxLength={3000} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} />
            <p className="text-xs text-slate-500">Start with a direct one-sentence answer, then add detail. {editing.answer.length}/3000</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" checked={editing.status === "published"} onChange={(e) => setEditing({ ...editing, status: e.target.checked ? "published" : "draft" })} />
            Published (visible on the site and in FAQ rich results)
          </label>
          <div className="flex gap-2">
            <Button type="button" onClick={submit} disabled={pending}>{pending ? "Saving..." : "Save FAQ"}</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setEditing({ id: null, question: "", answer: "", status: "published" })}>
          <Plus size={14} className="mr-1" /> Add FAQ
        </Button>
      )}
    </div>
  );
}
