import { NextResponse } from "next/server";
import { ragDatabase } from "@/lib/rag/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ragDatabase.getDatabaseStatus();
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "degraded" }, { status: 503 });
  }
}
