import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { sanityWebhook } from "@/lib/sanity/webhook";
import { AppError } from "@/lib/utils/errors";
import { isPlaceholderSecret, timingSafeEqualString } from "@/lib/security/crypto";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET || "";
    const signature = req.headers.get("sanity-webhook-signature") || "";
    if (isPlaceholderSecret(secret) || !timingSafeEqualString(signature, secret)) {
      return errorResponse(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    }

    const payload = await req.json();
    if (payload._type === "post" && payload.publishedAt) {
      await sanityWebhook.processPublish(payload);
    }

    return successResponse({ received: true });
  } catch (error) {
    return errorResponse(error);
  }
}
