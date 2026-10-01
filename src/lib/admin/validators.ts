import { z } from "zod";

/** An absolute https:// URL or a site-relative /path (Media Library and legacy images use both). */
export const urlOrPath = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => /^https:\/\/\S+$/.test(v) || /^\/\S*$/.test(v), "Must be an https:// URL or a /path");
