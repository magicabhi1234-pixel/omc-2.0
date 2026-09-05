import Link from "next/link";
import { FileText, Newspaper, GraduationCap, MessageSquareQuote, Image as ImageIcon } from "lucide-react";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function countRows(table: string) {
  const { count } = await supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardPage() {
  const profile = await requireProfile();

  const [landingPages, blogPosts, universities, testimonials, media, recentLogs] = await Promise.all([
    countRows("landing_pages"),
    countRows("blog_posts"),
    countRows("universities"),
    countRows("testimonials"),
    countRows("media"),
    supabaseAdmin
      .from("activity_logs")
      .select("id, user_email, action, content_type, content_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const stats = [
    { label: "Landing Pages", value: landingPages, href: "/admin/pages", icon: FileText },
    { label: "Blog Posts", value: blogPosts, href: "/admin/blogs", icon: Newspaper },
    { label: "Universities", value: universities, href: "/admin/content/universities", icon: GraduationCap },
    { label: "Testimonials", value: testimonials, href: "/admin/content/testimonials", icon: MessageSquareQuote },
    { label: "Media Files", value: media, href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {profile.fullName || profile.email}</h1>
      <p className="mt-1 text-slate-600">Here&apos;s what&apos;s happening across your site.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition hover:shadow-md">
              <CardContent className="pt-6">
                <Icon className="text-[#0B3B68]" size={22} />
                <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.data && recentLogs.data.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {recentLogs.data.map((log) => (
                <li key={log.id} className="flex items-center justify-between py-3 text-sm">
                  <span>
                    <span className="font-medium text-slate-900">{log.user_email ?? "System"}</span>{" "}
                    <span className="text-slate-500">{log.action}</span>{" "}
                    <span className="text-slate-700">{log.content_type}</span>
                  </span>
                  <span className="text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No activity recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
