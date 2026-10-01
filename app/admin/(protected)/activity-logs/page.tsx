import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/client";
import { requireProfile } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ActivityLogsPage() {
  const profile = await requireProfile();
  if (!profile.permissions.canViewActivityLogs) redirect("/admin/dashboard");

  const { data } = await supabaseAdmin
    .from("activity_logs")
    .select("id, user_email, action, content_type, content_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const logs = data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
      <p className="mt-1 text-slate-600">Most recent 200 actions.</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>Content ID</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user_email ?? "System"}</TableCell>
                <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                <TableCell>{log.content_type}</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{log.content_id ?? "—"}</TableCell>
                <TableCell className="text-slate-500">{new Date(log.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {logs.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No activity recorded yet.</p>}
      </div>
    </div>
  );
}
