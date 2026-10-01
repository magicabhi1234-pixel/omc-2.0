import "server-only";
import { supabaseAdmin } from "@/lib/db/client";
import type { BlogPostRow, LandingPageRow, TestimonialRow, UniversityRow } from "@/lib/db/mappers";
import { BLOG_ROW, LANDING_ROW, PUBLISHED, TESTIMONIAL_ROW, UNIVERSITY_ROW, isSanityConfigured, sanityQuery } from "./source";
import { tombstonedKeys } from "./tombstones";

/**
 * Sanity -> dashboard sync. INSERT-ONLY by design:
 *  - a Sanity document is imported only if no dashboard row has its natural
 *    key (slug; name+review for testimonials) - so it can never duplicate;
 *  - existing dashboard rows are never modified - dashboard edits win;
 *  - items deleted in the dashboard (tombstoned) are never re-imported.
 * Images are copied into Supabase Storage so imported content doesn't depend
 * on the Sanity CDN.
 */

export interface SyncEntityResult {
  inSanity: number;
  alreadyInDashboard: number;
  deletedInDashboard: number;
  toImport: string[];
  imported: string[];
  failed: { key: string; reason: string }[];
}
export interface SyncResult {
  dryRun: boolean;
  startedAt: string;
  entities: Record<"universities" | "testimonials" | "blog_posts" | "landing_pages", SyncEntityResult>;
  images: { copied: number; reused: number; failed: number };
  status: "success" | "partial" | "failed";
  error?: string;
}

const LANDING_CATEGORIES = ["Online MBA", "Distance MBA", "MBA Specializations", "Executive MBA", "University Pages", "Bachelor Programs"];
const SANITY_CDN = /^https:\/\/cdn\.sanity\.io\/(images|files)\//;
const emptyEntity = (): SyncEntityResult => ({ inSanity: 0, alreadyInDashboard: 0, deletedInDashboard: 0, toImport: [], imported: [], failed: [] });

async function existingKeys(table: string, column: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabaseAdmin.from(table).select(`id, ${column}`).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    for (const row of (data ?? []) as unknown as Record<string, string>[]) map.set(row[column], row.id);
    if (!data || data.length < 1000) return map;
  }
}

function makeRehoster(images: SyncResult["images"]) {
  const cache = new Map<string, string>();
  async function rehost(rawUrl: string, alt?: string): Promise<string> {
    const clean = rawUrl.split("?")[0];
    const hit = cache.get(clean);
    if (hit) return hit;
    const fileName = clean.split("/").pop()!;
    const storagePath = `sanity/${fileName}`;
    const { data: existing } = await supabaseAdmin.from("media").select("url").eq("storage_path", storagePath).limit(1);
    if (existing?.[0]?.url) {
      images.reused += 1;
      cache.set(clean, existing[0].url);
      return existing[0].url;
    }
    try {
      const res = await fetch(clean);
      if (!res.ok) throw new Error(`download ${res.status}`);
      const contentType = res.headers.get("content-type") || "application/octet-stream";
      const bytes = Buffer.from(await res.arrayBuffer());
      const { error } = await supabaseAdmin.storage.from("media").upload(storagePath, bytes, { contentType, upsert: true, cacheControl: "31536000" });
      if (error) throw new Error(error.message);
      const url = supabaseAdmin.storage.from("media").getPublicUrl(storagePath).data.publicUrl;
      const dims = fileName.match(/-(\d+)x(\d+)\.\w+$/);
      await supabaseAdmin.from("media").insert({
        file_name: fileName,
        storage_path: storagePath,
        url,
        mime_type: contentType,
        size_bytes: bytes.length,
        alt_text: alt || null,
        width: dims ? Number(dims[1]) : null,
        height: dims ? Number(dims[2]) : null,
        folder: "sanity",
      });
      images.copied += 1;
      cache.set(clean, url);
      return url;
    } catch (error) {
      images.failed += 1;
      console.error("[sanity-sync] image not copied, keeping Sanity URL:", clean, error);
      cache.set(clean, rawUrl);
      return rawUrl;
    }
  }
  async function deep<T>(value: T, alt?: string): Promise<T> {
    if (typeof value === "string") return (SANITY_CDN.test(value) ? await rehost(value, alt) : value) as T;
    if (Array.isArray(value)) return (await Promise.all(value.map((v) => deep(v, alt)))) as T;
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const nextAlt = typeof obj.alt === "string" ? obj.alt : alt;
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) out[k] = await deep(v, nextAlt);
      return out as T;
    }
    return value;
  }
  return deep;
}

export async function runSanitySync({ dryRun, trigger, startedBy }: { dryRun: boolean; trigger: "manual" | "webhook" | "preview"; startedBy?: string | null }): Promise<SyncResult> {
  const result: SyncResult = {
    dryRun,
    startedAt: new Date().toISOString(),
    entities: { universities: emptyEntity(), testimonials: emptyEntity(), blog_posts: emptyEntity(), landing_pages: emptyEntity() },
    images: { copied: 0, reused: 0, failed: 0 },
    status: "success",
  };
  if (!isSanityConfigured) return { ...result, status: "failed", error: "Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID)." };

  try {
    const deep = makeRehoster(result.images);
    const source = await sanityQuery<{
      universities: (UniversityRow & { logo_alt?: string })[];
      testimonials: (TestimonialRow & { image_alt?: string })[];
      blogs: (BlogPostRow & { related_slugs?: string[] | null })[];
      pages: (LandingPageRow & { region?: string; universities?: UniversityRow[] | null; testimonials?: TestimonialRow[] | null })[];
    }>(
      `{
        "universities": *[_type == "university" && ${PUBLISHED}]${UNIVERSITY_ROW},
        "testimonials": *[_type == "testimonial" && ${PUBLISHED}]${TESTIMONIAL_ROW},
        "blogs": *[_type == "blogPost" && ${PUBLISHED}]${BLOG_ROW},
        "pages": *[_type == "landingPage" && ${PUBLISHED}]${LANDING_ROW}
      }`,
      {},
      { revalidate: false }
    );

    // ---- Universities (needed first: landing pages link to them) ----
    const uniKeys = await existingKeys("universities", "slug");
    const uniDeleted = await tombstonedKeys("university");
    const uniIdBySanityId = new Map<string, string>();
    const uniR = result.entities.universities;
    uniR.inSanity = source.universities.length;
    for (const u of source.universities) {
      if (!u.slug || !u.name) {
        uniR.failed.push({ key: u.id, reason: "missing name or slug" });
        continue;
      }
      const existing = uniKeys.get(u.slug);
      if (existing) {
        uniR.alreadyInDashboard += 1;
        uniIdBySanityId.set(u.id, existing);
        continue;
      }
      if (uniDeleted.has(u.slug)) {
        uniR.deletedInDashboard += 1;
        continue;
      }
      uniR.toImport.push(u.slug);
      if (dryRun) continue;
      const row = await deep({
        slug: u.slug,
        name: u.name,
        logo_url: u.logo_url ?? null,
        logo_alt: u.logo_alt || null,
        featured: u.featured ?? false,
        study_mode: ["Online", "Distance", "Online & Distance"].includes(u.study_mode) ? u.study_mode : "Online & Distance",
        duration: u.duration || "2 Years",
        eligibility: u.eligibility || "",
        starting_fee: u.starting_fee || "",
        emi: u.emi ?? null,
        placement_support: u.placement_support ?? null,
        rating: typeof u.rating === "number" ? Math.min(5, Math.max(0, u.rating)) : null,
        review_count: u.review_count ?? null,
        approvals: u.approvals ?? [],
        rankings: u.rankings ?? [],
        brochure_url: u.brochure_url ?? null,
        website_url: u.website_url ?? null,
        status: "published",
      });
      const { data, error } = await supabaseAdmin.from("universities").insert(row).select("id").single();
      if (error) uniR.failed.push({ key: u.slug, reason: error.message });
      else {
        uniR.imported.push(u.slug);
        uniIdBySanityId.set(u.id, data.id);
      }
    }

    // ---- Testimonials ----
    const { data: tRows, error: tErr } = await supabaseAdmin.from("testimonials").select("id, name, review");
    if (tErr) throw new Error(`testimonials: ${tErr.message}`);
    const tKeys = new Map((tRows ?? []).map((r) => [`${r.name}\u0000${r.review}`, r.id as string]));
    const tDeleted = await tombstonedKeys("testimonial");
    const tIdBySanityId = new Map<string, string>();
    const tR = result.entities.testimonials;
    tR.inSanity = source.testimonials.length;
    for (const t of source.testimonials) {
      const key = `${t.name}\u0000${t.review}`;
      if (!t.name || !t.review) {
        tR.failed.push({ key: t.id, reason: "missing name or review" });
        continue;
      }
      const existing = tKeys.get(key);
      if (existing) {
        tR.alreadyInDashboard += 1;
        tIdBySanityId.set(t.id, existing);
        continue;
      }
      if (tDeleted.has(key)) {
        tR.deletedInDashboard += 1;
        continue;
      }
      tR.toImport.push(t.name);
      if (dryRun) continue;
      const row = await deep({
        name: t.name,
        designation: t.designation ?? null,
        university: t.university ?? null,
        image_url: t.image_url ?? null,
        image_alt: t.image_alt || null,
        review: t.review,
        rating: Number.isInteger(t.rating) && t.rating >= 1 && t.rating <= 5 ? t.rating : 5,
        status: "published",
      });
      const { data, error } = await supabaseAdmin.from("testimonials").insert(row).select("id").single();
      if (error) tR.failed.push({ key: t.name, reason: error.message });
      else {
        tR.imported.push(t.name);
        tIdBySanityId.set(t.id, data.id);
      }
    }

    // ---- Blog posts ----
    const blogKeys = await existingKeys("blog_posts", "slug");
    const blogDeleted = await tombstonedKeys("blog_post");
    const bR = result.entities.blog_posts;
    bR.inSanity = source.blogs.length;
    const importedBlogs: { id: string; related: string[] }[] = [];
    for (const b of source.blogs) {
      if (!b.slug || !b.title) {
        bR.failed.push({ key: String((b as { sanity_id?: string }).sanity_id), reason: "missing title or slug" });
        continue;
      }
      if (blogKeys.has(b.slug)) {
        bR.alreadyInDashboard += 1;
        continue;
      }
      if (blogDeleted.has(b.slug)) {
        bR.deletedInDashboard += 1;
        continue;
      }
      bR.toImport.push(b.slug);
      if (dryRun) continue;
      const row = await deep({
        slug: b.slug,
        title: b.title,
        h1: b.h1 ?? null,
        featured_image_url: b.featured_image_url ?? "",
        featured_image_alt: b.featured_image_alt ?? "",
        excerpt: b.excerpt || "",
        content: b.content ?? [],
        author: b.author || "Admin",
        published_date: b.published_date,
        category: b.category?.trim() || null,
        tags: (b.tags ?? []).filter(Boolean),
        faqs: b.faqs ?? [],
        seo_meta_title: b.seo_meta_title ?? null,
        seo_meta_description: b.seo_meta_description ?? null,
        seo_keywords: b.seo_keywords ?? null,
        seo_canonical_url: b.seo_canonical_url ?? null,
        seo_og_image_url: b.seo_og_image_url ?? null,
        seo_no_index: b.seo_no_index ?? false,
        status: "published",
      });
      const { data, error } = await supabaseAdmin.from("blog_posts").insert(row).select("id").single();
      if (error) bR.failed.push({ key: b.slug, reason: error.message });
      else {
        bR.imported.push(b.slug);
        blogKeys.set(b.slug, data.id);
        importedBlogs.push({ id: data.id, related: (b.related_slugs ?? []).filter(Boolean) });
      }
    }
    for (const post of importedBlogs) {
      const rows = post.related
        .map((slug, i) => ({ blog_post_id: post.id, related_post_id: blogKeys.get(slug), sort_order: i }))
        .filter((r): r is { blog_post_id: string; related_post_id: string; sort_order: number } => Boolean(r.related_post_id) && r.related_post_id !== post.id);
      if (rows.length) await supabaseAdmin.from("blog_post_related").insert(rows);
    }

    // ---- Landing pages ----
    const lpKeys = await existingKeys("landing_pages", "slug");
    const lpDeleted = await tombstonedKeys("landing_page");
    const lR = result.entities.landing_pages;
    lR.inSanity = source.pages.length;
    for (const p of source.pages) {
      if (!p.slug || !p.title) {
        lR.failed.push({ key: String((p as { sanity_id?: string }).sanity_id), reason: "missing title or slug" });
        continue;
      }
      if (lpKeys.has(p.slug)) {
        lR.alreadyInDashboard += 1;
        continue;
      }
      if (lpDeleted.has(p.slug)) {
        lR.deletedInDashboard += 1;
        continue;
      }
      if (!LANDING_CATEGORIES.includes(p.category)) {
        lR.failed.push({ key: p.slug, reason: `category "${p.category}" isn't supported by the dashboard` });
        continue;
      }
      lR.toImport.push(p.slug);
      if (dryRun) continue;
      const row = await deep({
        slug: p.slug,
        title: p.title,
        category: p.category,
        region: ["north", "south", "east", "west", "none"].includes(p.region ?? "") ? p.region : "none",
        status: "published",
        hero: p.hero ?? {},
        university_section: p.university_section ?? {},
        compare_section: p.compare_section ?? null,
        why_choose: p.why_choose ?? null,
        stats: p.stats ?? null,
        specializations: p.specializations ?? null,
        benefits: p.benefits ?? null,
        career_scope: p.career_scope ?? null,
        highlight_banner: p.highlight_banner ?? null,
        faq: p.faq ?? null,
        testimonials_heading: p.testimonials_heading || "What Our Students Say",
        cta: p.cta ?? {},
        seo_meta_title: p.seo_meta_title ?? null,
        seo_meta_description: p.seo_meta_description ?? null,
        seo_keywords: p.seo_keywords ?? null,
        seo_canonical_url: p.seo_canonical_url ?? null,
        seo_og_image_url: p.seo_og_image_url ?? null,
        seo_no_index: p.seo_no_index ?? false,
      });
      const { data, error } = await supabaseAdmin.from("landing_pages").insert(row).select("id").single();
      if (error) {
        lR.failed.push({ key: p.slug, reason: error.message });
        continue;
      }
      lR.imported.push(p.slug);
      const uniLinks = (p.universities ?? [])
        .filter(Boolean)
        .map((u, i) => ({ landing_page_id: data.id, university_id: uniIdBySanityId.get(u.id), sort_order: i }))
        .filter((r) => r.university_id);
      if (uniLinks.length) await supabaseAdmin.from("landing_page_universities").insert(uniLinks);
      const tLinks = (p.testimonials ?? [])
        .filter(Boolean)
        .map((t, i) => ({ landing_page_id: data.id, testimonial_id: tIdBySanityId.get(t.id), sort_order: i }))
        .filter((r) => r.testimonial_id);
      if (tLinks.length) await supabaseAdmin.from("landing_page_testimonials").insert(tLinks);
    }

    const failures = Object.values(result.entities).reduce((n, e) => n + e.failed.length, 0);
    result.status = failures ? "partial" : "success";
  } catch (error) {
    result.status = "failed";
    result.error = error instanceof Error ? error.message : String(error);
  }

  if (!dryRun) {
    const summary = Object.fromEntries(
      Object.entries(result.entities).map(([k, v]) => [k, { inSanity: v.inSanity, imported: v.imported.length, skipped: v.alreadyInDashboard, deleted: v.deletedInDashboard, failed: v.failed }])
    );
    const { error } = await supabaseAdmin.from("cms_sync_runs").insert({
      trigger,
      mode: "insert-only",
      status: result.status,
      summary: { ...summary, images: result.images, error: result.error },
      started_by: startedBy ?? null,
    });
    if (error) console.error("[sanity-sync] run not logged (is migration 0004 applied?):", error.message);
  }
  return result;
}
