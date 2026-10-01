import { getBlogPostsByDate, getLandingPagesForHub } from "@/data/registry";
import { getFaqs, getSettings } from "@/lib/db/queries";
import { blogPostHref } from "@/lib/blog-links";
import { SITE_URL } from "@/lib/structured-data";
import { DEFAULT_HOME_FAQS } from "@/components/home/faq";

export const revalidate = 3600;

/**
 * /llms.txt (llmstxt.org): a plain-Markdown map of the site for AI answer
 * engines - what OMC is, its canonical pages, and quotable FAQ answers -
 * generated from the same CMS content as the pages, so it never drifts.
 */
export async function GET() {
  const [info, landing, posts, faqs] = await Promise.all([
    getSettings("site_info"),
    getLandingPagesForHub(),
    getBlogPostsByDate(),
    getFaqs("home", DEFAULT_HOME_FAQS),
  ]);

  const byCategory = new Map<string, typeof landing>();
  for (const page of landing) byCategory.set(page.category, [...(byCategory.get(page.category) ?? []), page]);

  const lines = [
    `# ${info.site_name}`,
    "",
    `> ${info.footer_about}`,
    "",
    `${info.site_name} (${SITE_URL}) is an independent Indian platform that compares online and distance MBA programmes from UGC-entitled universities - fees, approvals (UGC, AICTE, NAAC), duration and specializations - and offers free admission counselling. Contact: ${info.email}, ${info.phone} (${info.footer_hours}).`,
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): overview, university finder and FAQs`,
    `- [All program comparisons](${SITE_URL}/landing-pages): every comparison page by category`,
    `- [Blog](${SITE_URL}/blog): admission guides and university reviews`,
    `- [About](${SITE_URL}/about-us)`,
    `- [Contact / free counselling](${SITE_URL}/contact)`,
    "",
  ];

  for (const [category, pages] of [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`## ${category}`);
    for (const page of pages) {
      lines.push(`- [${page.seoTitle}](${SITE_URL}/${page.slug})${page.seoDescription ? `: ${page.seoDescription}` : ""}`);
    }
    lines.push("");
  }

  if (posts.length) {
    lines.push("## Guides");
    for (const post of posts) lines.push(`- [${post.title}](${SITE_URL}${blogPostHref(post.slug)})${post.excerpt ? `: ${post.excerpt}` : ""}`);
    lines.push("");
  }

  if (faqs.length) {
    lines.push("## Frequently asked questions");
    for (const faq of faqs) lines.push(`### ${faq.question}`, faq.answer, "");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
