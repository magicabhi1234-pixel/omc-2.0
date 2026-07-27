import { POST as submitLead } from "../leads/route";

// Kept for backward compatibility with any existing integrations. New form
// submissions use /api/leads, which owns the complete lead workflow.
export async function POST(request: Request) {
  return submitLead(request);
}
