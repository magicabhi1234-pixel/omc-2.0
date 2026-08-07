import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().regex(/^[1-9]\d{9}$/),
  email: z.string().trim().email().max(254),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  specialization: z.string().trim().min(2).max(150),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!
  );

const serverSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? { url, serviceRoleKey } : null;
};

const emailConfig = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  return apiKey && from && adminEmail ? { apiKey, from, adminEmail } : null;
};

const EMAIL_RETRY_ATTEMPTS = 3;
const EMAIL_RETRY_DELAY_MS = 500;

/**
 * Resend's API can accept a send (no `error` in the response) and still fail
 * delivery moments later - confirmed directly against this project's Resend
 * account, where several admin-notification sends returned success from the
 * API but resolved to `last_event: "failed"` shortly after. A transient
 * failure at the API-call layer (network blip, momentary provider issue) is
 * a *different*, retriable failure mode from that async delivery failure,
 * and retrying here is cheap insurance against exactly the kind of
 * multi-minute failure cluster observed in that account's send history.
 */
async function sendWithRetry(
  resend: Resend,
  payload: Parameters<Resend["emails"]["send"]>[0],
  label: string,
  traceId: string
) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= EMAIL_RETRY_ATTEMPTS; attempt++) {
    try {
      const result = await resend.emails.send(payload);
      if (!result.error) {
        if (attempt > 1) {
          console.info("[lead:%s] %s succeeded on retry attempt %d", traceId, label, attempt);
        }
        return result;
      }
      lastError = result.error;
      console.error(
        "[lead:%s] %s attempt %d/%d failed: %s",
        traceId,
        label,
        attempt,
        EMAIL_RETRY_ATTEMPTS,
        JSON.stringify(result.error)
      );
    } catch (error) {
      lastError = error;
      console.error(
        "[lead:%s] %s attempt %d/%d threw: %s",
        traceId,
        label,
        attempt,
        EMAIL_RETRY_ATTEMPTS,
        error instanceof Error ? error.stack ?? error.message : String(error)
      );
    }
    if (attempt < EMAIL_RETRY_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, EMAIL_RETRY_DELAY_MS * attempt));
    }
  }
  return { data: null, error: lastError } as Awaited<ReturnType<Resend["emails"]["send"]>>;
}

export async function POST(request: Request) {
  const traceId = crypto.randomUUID();
  console.info("[lead:%s] request received", traceId);

  try {
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) {
      console.warn("[lead:%s] validation failed", traceId);
      return NextResponse.json({ success: false, message: "Please check the form fields and try again." }, { status: 400 });
    }

    const lead = parsed.data;
    let saved = false;
    let emailSent = false;
    let databaseError: string | undefined;
    let emailError: string | undefined;

    const supabaseConfig = serverSupabaseConfig();
    if (!supabaseConfig) {
      databaseError = "Server Supabase configuration is missing.";
      console.error("[lead:%s] %s", traceId, databaseError);
    } else {
      const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error } = await supabase.from("leads").insert({
        name: lead.name,
        mobile: lead.mobile,
        email: lead.email,
        city: lead.city || null,
        specialization: lead.specialization,
      });

      if (error) {
        databaseError = `${error.code ?? "database_error"}: ${error.message}`;
        console.error("[lead:%s] Supabase insert failed: %s", traceId, databaseError);
      } else {
        saved = true;
        console.info("[lead:%s] Supabase lead insert succeeded", traceId);
      }
    }

    const resendConfig = emailConfig();
    if (!resendConfig) {
      emailError = "Server email configuration is missing.";
      console.error("[lead:%s] %s", traceId, emailError);
    } else {
      const resend = new Resend(resendConfig.apiKey);
      const safeLead = {
        name: escapeHtml(lead.name),
        mobile: escapeHtml(lead.mobile),
        email: escapeHtml(lead.email),
        city: escapeHtml(lead.city || "N/A"),
        specialization: escapeHtml(lead.specialization),
      };
      const adminResult = await sendWithRetry(
        resend,
        {
          from: `OMC Leads <${resendConfig.from}>`,
          to: [resendConfig.adminEmail],
          subject: "🎓 New MBA Lead Received",
          html: `<h2>New MBA lead received</h2><p><strong>Name:</strong> ${safeLead.name}</p><p><strong>Mobile:</strong> ${safeLead.mobile}</p><p><strong>Email:</strong> ${safeLead.email}</p><p><strong>City:</strong> ${safeLead.city}</p><p><strong>Specialization:</strong> ${safeLead.specialization}</p>`,
        },
        "Resend admin email",
        traceId
      );

      if (adminResult.error) {
        emailError = `${adminResult.error.name}: ${adminResult.error.message}`;
        console.error(
          "[lead:%s] Resend admin email failed after %d attempts: %s",
          traceId,
          EMAIL_RETRY_ATTEMPTS,
          emailError
        );
      } else {
        emailSent = true;
        console.info("[lead:%s] Resend admin email succeeded", traceId);
      }

      // The lead's own confirmation email is sent independently of whether
      // the admin notification above succeeded - one failing should never
      // suppress the other, and `emailSent` (used for the API response and
      // the "did we notify the admin" signal) only ever reflects the admin
      // send's outcome.
      const confirmationResult = await sendWithRetry(
        resend,
        {
          from: `Online MBA Colleges <${resendConfig.from}>`,
          to: [lead.email],
          subject: "We received your MBA enquiry",
          html: `<h2>Thank you, ${safeLead.name}</h2><p>We received your enquiry for <strong>${safeLead.specialization}</strong>.</p><p>Our MBA counsellor will contact you shortly.</p>`,
        },
        "Resend confirmation email",
        traceId
      );
      if (confirmationResult.error) {
        console.error(
          "[lead:%s] Resend confirmation email failed after %d attempts: %s: %s",
          traceId,
          EMAIL_RETRY_ATTEMPTS,
          confirmationResult.error.name,
          confirmationResult.error.message
        );
      } else {
        console.info("[lead:%s] Resend confirmation email succeeded", traceId);
      }
    }

    if (!saved && !emailSent) {
      console.error("[lead:%s] submission failed; database=%s; email=%s", traceId, databaseError, emailError);
      return NextResponse.json(
        { success: false, message: "We couldn't submit your enquiry. Please try again shortly.", traceId },
        { status: 502 }
      );
    }

    console.info("[lead:%s] submission completed; saved=%s; emailSent=%s", traceId, saved, emailSent);
    return NextResponse.json({ success: true, saved, emailSent, traceId });
  } catch (error) {
    console.error("[lead:%s] unexpected error", traceId, error);
    return NextResponse.json(
      { success: false, message: "We couldn't submit your enquiry. Please try again shortly.", traceId },
      { status: 500 }
    );
  }
}
