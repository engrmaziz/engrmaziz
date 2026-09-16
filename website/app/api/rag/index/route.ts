import { NextResponse } from "next/server";
import { ragIndexer } from "@/lib/rag/indexer";
import { telemetryLogger } from "@/lib/telemetry";
import { authorizationService, PERMISSIONS } from "@/lib/security";
import { AuthenticationError, AuthorizationError, ForbiddenError } from "@/lib/security/errors";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { RateLimitError } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = authorizationService.authenticateRequest(req);
    authorizationService.authorize(user, [PERMISSIONS.KNOWLEDGE_WRITE]);
    await checkRateLimit(getClientIp(req), "rag-index", 2, 3600000);

    telemetryLogger.log("RAG", "Authenticated ingestion crawl request.");
    const result = await ragIndexer.indexAll();

    return NextResponse.json({
      message: "Ingestion pipeline execution complete.",
      ...result,
    });
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof AuthorizationError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
    console.error("[RAG Index API] Ingestion failed:", error);
    return NextResponse.json({ error: "Ingestion failed." }, { status: 500 });
  }
}
