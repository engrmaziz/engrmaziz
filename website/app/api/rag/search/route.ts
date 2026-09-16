import { NextResponse } from "next/server";
import { z } from "zod";
import { ragRetriever } from "@/lib/rag/retriever";
import { authorizationService, PERMISSIONS } from "@/lib/security";
import { AuthenticationError, AuthorizationError, ForbiddenError } from "@/lib/security/errors";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { RateLimitError } from "@/lib/utils/errors";

const searchSchema = z.object({
  query: z.string().min(1).max(2000),
  limit: z.coerce.number().int().min(1).max(8).optional(),
  threshold: z.coerce.number().min(0).max(1).optional(),
});

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const user = authorizationService.authenticateRequest(req);
    authorizationService.authorize(user, [PERMISSIONS.KNOWLEDGE_READ]);
    await checkRateLimit(getClientIp(req), "rag-search", 20, 60000);

    const parsed = searchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const result = await ragRetriever.retrieve(
      parsed.data.query,
      parsed.data.limit ?? 5,
      parsed.data.threshold ?? 0.3,
      {}
    );

    return NextResponse.json({
      citations: result.citations,
      latencyMs: Date.now() - start,
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
    console.error("[RAG Search API] Error:", error);
    return NextResponse.json({ error: "Search failed.", latencyMs: Date.now() - start }, { status: 500 });
  }
}
