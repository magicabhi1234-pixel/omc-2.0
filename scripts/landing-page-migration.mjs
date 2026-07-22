import { createClient } from "@sanity/client";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function readEnvFile(filePath) {
  try {
    return fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function loadEnv() {
  const envFiles = [path.join(projectRoot, ".env"), path.join(projectRoot, ".env.local")];
  const values = {};

  for (const envFile of envFiles) {
    const content = readEnvFile(envFile);
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

function isPopulated(value) {
  return value !== undefined && value !== null && value !== "";
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = env.SANITY_API_TOKEN || env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_TOKEN;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || env.SANITY_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";

  if (!projectId || !dataset) {
    throw new Error("Missing Sanity projectId or dataset. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const query = `*[_type == "landingPage"]{_id, _rev, title, heroHeading, heroDescription, heroImage, ctaButtonText, hero, cta}`;
  const documents = await client.fetch(query);

  const report = {
    generatedAt: new Date().toISOString(),
    projectId,
    dataset,
    totalDocuments: documents.length,
    migratedDocuments: [],
    skippedDocuments: [],
    mappings: [
      { from: "heroHeading", to: "hero.heading" },
      { from: "heroDescription", to: "hero.description" },
      { from: "heroImage", to: "hero.image" },
      { from: "ctaButtonText", to: "cta.buttonText" },
    ],
  };

  for (const doc of documents) {
    const legacyFields = [
      { key: "heroHeading", value: doc.heroHeading },
      { key: "heroDescription", value: doc.heroDescription },
      { key: "heroImage", value: doc.heroImage },
      { key: "ctaButtonText", value: doc.ctaButtonText },
    ].filter((field) => isPopulated(field.value));

    if (legacyFields.length === 0) {
      report.skippedDocuments.push({
        _id: doc._id,
        title: doc.title || "Untitled",
        reason: "No legacy fields found",
      });
      continue;
    }

    const patch = client.patch(doc._id);
    const setIfMissingFields = {};
    const unsetFields = [];

    if (isPopulated(doc.heroHeading) && !doc.hero?.heading) {
      setIfMissingFields["hero.heading"] = doc.heroHeading;
    }

    if (isPopulated(doc.heroDescription) && !doc.hero?.description) {
      setIfMissingFields["hero.description"] = doc.heroDescription;
    }

    if (isPopulated(doc.heroImage) && !doc.hero?.image) {
      setIfMissingFields["hero.image"] = doc.heroImage;
    }

    if (isPopulated(doc.ctaButtonText) && !doc.cta?.buttonText) {
      setIfMissingFields["cta.buttonText"] = doc.ctaButtonText;
    }

    for (const field of legacyFields) {
      unsetFields.push(field.key);
    }

    if (Object.keys(setIfMissingFields).length > 0) {
      patch.setIfMissing(setIfMissingFields);
    }

    patch.unset(unsetFields);
    await patch.commit();

    report.migratedDocuments.push({
      _id: doc._id,
      title: doc.title || "Untitled",
      movedFields: legacyFields.map((field) => field.key),
      appliedMappings: Object.keys(setIfMissingFields),
    });
  }

  const reportPath = path.join(projectRoot, "landing-page-migration-report.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(`Migration complete. Report written to ${reportPath}`);
  console.log(JSON.stringify({
    totalDocuments: report.totalDocuments,
    migratedDocuments: report.migratedDocuments.length,
    skippedDocuments: report.skippedDocuments.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
