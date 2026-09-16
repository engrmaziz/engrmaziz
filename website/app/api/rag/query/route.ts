import { NextResponse } from "next/server";
import { z } from "zod";
import { ragOrchestrator } from "@/lib/rag/orchestrator";
import { validateStartup } from "@/lib/system/startup";
import { authorizationService, PERMISSIONS } from "@/lib/security";
import { AuthenticationError, AuthorizationError, ForbiddenError } from "@/lib/security/errors";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { RateLimitError } from "@/lib/utils/errors";

const querySchema = z.object({
  query: z.string().min(1).max(2000),
  sessionId: z.string().uuid().optional(),
  filters: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const user = authorizationService.authenticateRequest(req);
    authorizationService.authorize(user, [PERMISSIONS.KNOWLEDGE_READ]);
    await checkRateLimit(getClientIp(req), "rag-query", 20, 60000);

    validateStartup();
    const parsed = querySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const result = await ragOrchestrator.execute({
      query: parsed.data.query,
      sessionId: parsed.data.sessionId,
      filters: parsed.data.filters || {},
      internal: true,
    });

    return NextResponse.json({
      answer: result.answer,
      citations: result.citations,
      latencyMs: result.latencyMs,
      ttftMs: result.ttftMs,
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
    console.error("[RAG API Route] Error:", error);
    return NextResponse.json({ error: "Query failed." }, { status: 500 });
  }
}
