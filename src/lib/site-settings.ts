import { z } from "zod";

/**
 * Global settings, stored as one site_settings row per group. Each schema's
 * defaults are the values the site rendered before these were editable, so
 * an empty/missing row changes nothing visible.
 */

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https:\/\/[^\s"'<>]+$/.test(v) || /^\/[^\s"'<>]*$/.test(v), "Must be an https:// URL or a /path")
  .optional()
  .default("");

export const siteInfoSchema = z.object({
  site_name: z.string().trim().min(1).max(100).default("Online MBA Colleges"),
  tagline: optionalText(200).default("Find Your Perfect Online MBA Program"),
  email: z.string().trim().email().max(254).default("info@onlinembacolleges.com"),
  phone: z.string().trim().min(1).max(30).default("+91 8421903846"),
  whatsapp: optionalText(30),
  address: optionalText(300),
  footer_about: optionalText(500).default(
    "India's AI-powered platform to compare online MBA universities, fees, rankings, placements and specializations."
  ),
  footer_hours: optionalText(100).default("Mon - Sat | 9:00 AM - 7:00 PM"),
});

export const brandingSchema = z.object({
  logo_url: optionalUrl.default("/universities/omc_logo.avif"),
  logo_alt: optionalText(150).default("Online MBA Colleges"),
  favicon_url: optionalUrl,
  og_image_url: optionalUrl,
});

export const socialLinksSchema = z.object({
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  youtube: optionalUrl,
});

// Tracking is configured by ID, never by pasted HTML: every value is
// validated against its vendor's format and rendered by our own templates,
// so a settings edit can't inject arbitrary script into every page.
export const trackingSchema = z.object({
  ga4_id: z.string().trim().regex(/^(G-[A-Z0-9]{4,15})?$/, "GA4 IDs look like G-XXXXXXX").optional().default(""),
  gtm_id: z.string().trim().regex(/^(GTM-[A-Z0-9]{4,10})?$/, "GTM IDs look like GTM-XXXXXX").optional().default(""),
  meta_pixel_id: z.string().trim().regex(/^(\d{10,20})?$/, "Meta Pixel IDs are 10-20 digits").optional().default(""),
  clarity_id: z.string().trim().regex(/^([a-z0-9]{6,20})?$/, "Clarity IDs are 6-20 lowercase letters/digits").optional().default(""),
  google_site_verification: z.string().trim().regex(/^([A-Za-z0-9_-]{10,100})?$/, "Paste only the content=\"...\" value").optional().default(""),
  bing_site_verification: z.string().trim().regex(/^([A-Za-z0-9]{10,100})?$/, "Paste only the content=\"...\" value").optional().default(""),
  meta_domain_verification: z.string().trim().regex(/^([a-z0-9]{10,100})?$/, "Paste only the content=\"...\" value").optional().default(""),
});

export type SiteInfo = z.infer<typeof siteInfoSchema>;
export type Branding = z.infer<typeof brandingSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
export type Tracking = z.infer<typeof trackingSchema>;

export const SETTINGS_GROUPS = {
  site_info: siteInfoSchema,
  branding: brandingSchema,
  social_links: socialLinksSchema,
  tracking: trackingSchema,
} as const;
export type SettingsGroup = keyof typeof SETTINGS_GROUPS;

/** Parses a stored value against its schema, falling back to defaults field-by-field. */
export function parseSettings<G extends SettingsGroup>(group: G, value: unknown): z.infer<(typeof SETTINGS_GROUPS)[G]> {
  const schema = SETTINGS_GROUPS[group];
  const input = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  // Treat empty strings in stored rows as "unset" so defaults apply.
  const cleaned = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== "" && v !== null));
  const parsed = schema.safeParse(cleaned);
  if (parsed.success) return parsed.data as z.infer<(typeof SETTINGS_GROUPS)[G]>;
  // One bad field shouldn't discard the rest: keep the valid ones.
  const shape = schema.shape as Record<string, z.ZodType>;
  const result: Record<string, unknown> = {};
  for (const [key, fieldSchema] of Object.entries(shape)) {
    const field = fieldSchema.safeParse(cleaned[key]);
    result[key] = field.success ? field.data : fieldSchema.parse(undefined);
  }
  return result as z.infer<(typeof SETTINGS_GROUPS)[G]>;
}

export const MENU_KEYS = {
  header: "Header Menu",
  mobile: "Mobile Menu",
  "footer-quick-links": "Footer Menu",
} as const;
export type MenuKey = keyof typeof MENU_KEYS;

export const FAQ_PLACEMENTS = {
  home: "Homepage",
  contact: "Contact page",
  about: "About page",
  general: "General (not shown on a page yet)",
} as const;
export type FaqPlacement = keyof typeof FAQ_PLACEMENTS;
