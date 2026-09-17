import { llmsTxtResponse } from "@/lib/llms-txt";

/** Alias of /llms.txt for crawlers that request the singular filename. */
export function GET() {
  return llmsTxtResponse();
}
