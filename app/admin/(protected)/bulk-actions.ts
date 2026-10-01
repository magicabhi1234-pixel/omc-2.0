"use server";

import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { runBulk } from "@/lib/admin/bulk";
import type { BulkOp, BulkResult } from "@/components/admin/content-table";
import { deleteLandingPage, toggleLandingPageStatus } from "./pages/actions";
import { deleteBlogPost, toggleBlogPostStatus } from "./blogs/actions";
import { deleteUniversity, toggleUniversityStatus } from "./content/universities/actions";
import { deleteTestimonial, toggleTestimonialStatus } from "./content/testimonials/actions";
import { deleteContentBlock, toggleContentBlockStatus } from "./content/blocks/actions";

const statusFor = (op: BulkOp) => (op === "publish" ? "published" : "draft") as "published" | "draft";

async function slugs(table: "landing_pages" | "blog_posts", ids: string[]) {
  const { data } = await supabaseAdmin.from(table).select("id, slug").in("id", ids);
  return new Map((data ?? []).map((r) => [r.id as string, r.slug as string]));
}

export async function bulkLandingPages(ids: string[], op: BulkOp): Promise<BulkResult> {
  await requireProfile();
  if (op === "delete") return runBulk(ids, deleteLandingPage);
  const map = await slugs("landing_pages", ids);
  return runBulk(ids, (id) => toggleLandingPageStatus(id, map.get(id) ?? "", statusFor(op)));
}

export async function bulkBlogPosts(ids: string[], op: BulkOp): Promise<BulkResult> {
  await requireProfile();
  if (op === "delete") return runBulk(ids, deleteBlogPost);
  const map = await slugs("blog_posts", ids);
  return runBulk(ids, (id) => toggleBlogPostStatus(id, map.get(id) ?? "", statusFor(op)));
}

export async function bulkUniversities(ids: string[], op: BulkOp): Promise<BulkResult> {
  await requireProfile();
  return runBulk(ids, (id) => (op === "delete" ? deleteUniversity(id) : toggleUniversityStatus(id, statusFor(op))));
}

export async function bulkTestimonials(ids: string[], op: BulkOp): Promise<BulkResult> {
  await requireProfile();
  return runBulk(ids, (id) => (op === "delete" ? deleteTestimonial(id) : toggleTestimonialStatus(id, statusFor(op))));
}

export async function bulkContentBlocks(ids: string[], op: BulkOp): Promise<BulkResult> {
  await requireProfile();
  return runBulk(ids, (id) => (op === "delete" ? deleteContentBlock(id) : toggleContentBlockStatus(id, statusFor(op))));
}
