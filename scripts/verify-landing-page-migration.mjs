import { createClient } from "@sanity/client";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

async function readEnvFile(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function loadEnv() {
  const envFiles = [path.join(projectRoot, ".env"), path.join(projectRoot, ".env.local")];
  const values = {};

  for (const envFile of envFiles) {
    const content = await readEnvFile(envFile);
    if (!content) continue;

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['\"]|['\"]$/g, "");
      values[key] = process.env[key] || value;
    }
  }

  return values;
}

async function main() {
  const env = await loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = env.SANITY_API_TOKEN || env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_TOKEN;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || env.SANITY_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";

  if (!projectId || !dataset) {
    throw new Error("Missing Sanity projectId or dataset. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.");
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  const documents = await client.fetch(`*[_type == "landingPage"]{_id, title, heroHeading, heroDescription, heroImage, ctaButtonText, hero, cta}`);

  const remainingLegacyFields = documents.filter((doc) =>
    doc.heroHeading || doc.heroDescription || doc.heroImage || doc.ctaButtonText
  );

  const report = {
    checkedDocuments: documents.length,
    remainingLegacyFields: remainingLegacyFields.map((doc) => ({
      _id: doc._id,
      title: doc.title || "Untitled",
      heroHeading: Boolean(doc.heroHeading),
      heroDescription: Boolean(doc.heroDescription),
      heroImage: Boolean(doc.heroImage),
      ctaButtonText: Boolean(doc.ctaButtonText),
    })),
  };

  const reportPath = path.join(projectRoot, "landing-page-migration-verification.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
