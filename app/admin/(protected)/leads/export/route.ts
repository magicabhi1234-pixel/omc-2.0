import writeXlsxFile from "write-excel-file/node";
import type { SheetData } from "write-excel-file/node";
import { getCurrentProfile } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/activity-log";
import { fetchLeads, fetchSubscribers, parseLeadFilters } from "@/lib/admin/leads";

type ExportValue = string | Date | null;

/**
 * Neutralises spreadsheet formula injection: a lead named `=HYPERLINK(...)`
 * would otherwise execute when an admin opens the export in Excel/Sheets.
 */
function safeText(value: string | null | undefined): string {
  const text = value ?? "";
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

function toCsv(header: string[], rows: ExportValue[][]): string {
  const cell = (value: ExportValue) => {
    const text = value instanceof Date ? value.toISOString() : safeText(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  // BOM so Excel opens UTF-8 (Hindi names, ₹ etc.) correctly.
  return "﻿" + [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}

async function toXlsx(header: string[], rows: ExportValue[][], sheet: string): Promise<Buffer> {
  const data: SheetData = [
    header.map((value) => ({ value, fontWeight: "bold" as const })),
    ...rows.map((row) =>
      row.map((value) =>
        value instanceof Date
          ? { value, type: Date, format: "dd mmm yyyy hh:mm" }
          : { value: safeText(value), type: String }
      )
    ),
  ];
  return writeXlsxFile(data, {
    sheet,
    columns: header.map((h) => ({ width: Math.max(14, h.length + 4) })),
    stickyRowsCount: 1,
  }).toBuffer();
}

export async function GET(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile?.permissions.canManageLeads) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const filters = parseLeadFilters(Object.fromEntries(url.searchParams));
  const format = url.searchParams.get("format") === "xlsx" ? "xlsx" : "csv";

  let header: string[];
  let rows: ExportValue[][];
  if (filters.tab === "newsletter") {
    const result = await fetchSubscribers(filters);
    if (result.error) return new Response(`Export failed: ${result.error}`, { status: 500 });
    header = ["Email", "Status", "Source", "Page", "Subscribed At"];
    rows = result.rows.map((s) => [s.email, s.status, s.source, s.page_path, new Date(s.created_at)]);
  } else {
    const result = await fetchLeads(filters);
    if (result.error) return new Response(`Export failed: ${result.error}`, { status: 500 });
    header = ["Name", "Mobile", "Email", "City", "Specialization", "Type", "Source", "Page", "Status", "Notes", "Received At"];
    rows = result.rows.map((l) => [
      l.name,
      l.mobile,
      l.email,
      l.city,
      l.specialization,
      l.lead_type,
      l.source,
      l.page_path,
      l.status,
      l.notes,
      new Date(l.created_at),
    ]);
  }

  await logActivity({
    userId: profile.id,
    userEmail: profile.email,
    action: "export",
    contentType: filters.tab === "newsletter" ? "newsletter_subscriber" : "lead",
    newValue: { format, filters, rowCount: rows.length },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  const fileBase = `omc-${filters.tab}-leads-${stamp}`;
  const commonHeaders = { "Cache-Control": "private, no-store" };

  if (format === "xlsx") {
    const buffer = await toXlsx(header, rows, filters.tab);
    return new Response(new Uint8Array(buffer), {
      headers: {
        ...commonHeaders,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileBase}.xlsx"`,
      },
    });
  }

  return new Response(toCsv(header, rows), {
    headers: {
      ...commonHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileBase}.csv"`,
    },
  });
}
