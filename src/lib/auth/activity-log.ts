import { supabaseAdmin } from "@/lib/db/client";

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "login"
  | "logout"
  | "upload"
  | "user_create"
  | "user_update"
  | "user_delete"
  | "password_reset"
  | "export";

export type ActivityContentType =
  | "university"
  | "testimonial"
  | "blog_post"
  | "landing_page"
  | "media"
  | "user"
  | "settings"
  | "navigation"
  | "content_block"
  | "lead"
  | "newsletter_subscriber"
  | "faq"
  | "cms_sync";

interface LogActivityArgs {
  userId: string | null;
  userEmail: string | null;
  action: ActivityAction;
  contentType: ActivityContentType;
  contentId?: string | null;
  previousValue?: unknown;
  newValue?: unknown;
}

/** Never throws - a logging failure must not break the underlying content operation. */
export async function logActivity({
  userId,
  userEmail,
  action,
  contentType,
  contentId,
  previousValue,
  newValue,
}: LogActivityArgs): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("activity_logs").insert({
      user_id: userId,
      user_email: userEmail,
      action,
      content_type: contentType,
      content_id: contentId ?? null,
      previous_value: previousValue ?? null,
      new_value: newValue ?? null,
    });
    // Supabase reports failures in the result rather than throwing.
    if (error) console.error("[activity-log] insert rejected:", error.code, error.message, { action, contentType, contentId });
  } catch (error) {
    console.error("[activity-log] failed to record activity:", error);
  }
}
