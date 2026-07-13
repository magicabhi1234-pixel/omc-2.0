"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config"; // path adjust if needed

export default function StudioPage() {
  return <NextStudio config={config} />;
}