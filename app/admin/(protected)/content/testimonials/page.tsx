import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LinkButton from "@/components/admin/link-button";
import PublishToggle from "@/components/admin/publish-toggle";
import DeleteButton from "@/components/admin/delete-button";
import { deleteTestimonial, toggleTestimonialStatus } from "./actions";

export default async function TestimonialsListPage() {
  const profile = await requireProfile();

  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("id, name, university, rating, status")
    .order("created_at", { ascending: false });

  const testimonials = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="mt-1 text-slate-600">{testimonials.length} total</p>
        </div>
        <LinkButton href="/admin/content/testimonials/new"><Plus size={16} className="mr-2" /> New Testimonial</LinkButton>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-slate-500">{t.university ?? "—"}</TableCell>
                <TableCell>{"★".repeat(t.rating)}</TableCell>
                <TableCell>
                  <PublishToggle
                    status={t.status as "draft" | "published"}
                    action={async (next) => {
                      "use server";
                      await toggleTestimonialStatus(t.id, next);
                    }}
                  />
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <LinkButton href={`/admin/content/testimonials/${t.id}`} variant="ghost" size="sm">Edit</LinkButton>
                  {profile.permissions.canDeleteContent && (
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteTestimonial(t.id);
                      }}
                      confirmMessage={`Delete testimonial from "${t.name}"?`}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {testimonials.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
