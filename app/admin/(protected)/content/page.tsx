import Link from "next/link";
import { FileText, Newspaper, GraduationCap, MessageSquareQuote, Layers } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

async function countRows(table: string) {
  const { count } = await supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function ContentHubPage() {
  const [pages, blogs, universities, testimonials, contentBlocks] = await Promise.all([
    countRows("landing_pages"),
    countRows("blog_posts"),
    countRows("universities"),
    countRows("testimonials"),
    countRows("content_blocks"),
  ]);

  const types = [
    { label: "Landing Pages", count: pages, href: "/admin/pages", icon: FileText, description: "Program/university comparison pages" },
    { label: "Blog Posts", count: blogs, href: "/admin/blogs", icon: Newspaper, description: "Articles with rich text content" },
    { label: "Universities", count: universities, href: "/admin/content/universities", icon: GraduationCap, description: "University profiles, fees, approvals" },
    { label: "Testimonials", count: testimonials, href: "/admin/content/testimonials", icon: MessageSquareQuote, description: "Student reviews" },
    { label: "Other Content", count: contentBlocks, href: "/admin/content/blocks", icon: Layers, description: "Any future content type - no code changes required" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">All Content</h1>
      <p className="mt-1 text-slate-600">Every content type manageable from this dashboard.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {types.map(({ label, count, href, icon: Icon, description }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition hover:shadow-md">
              <CardHeader>
                <Icon className="text-[#0B3B68]" size={22} />
                <CardTitle className="mt-2">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
