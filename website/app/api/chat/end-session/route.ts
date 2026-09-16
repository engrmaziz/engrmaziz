/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fallbackSummary(name: string, email: string, turns: Array<{ role: string; content: string }>, durationMin: number) {
  const questions = turns.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean);
  const answers = turns.filter((m) => m.role === "assistant").length;
  if (!questions.length) {
    return `${name} opened RAGX but did not ask a question. Follow up at ${email} if this was a drop-off.`;
  }
  return [
    `Visitor ${name} (${email}) completed a ${durationMin || 1}-minute RAGX session.`,
    `They asked ${questions.length} question(s). RAGX replied ${answers} time(s).`,
    "",
    "Questions asked:",
    ...questions.slice(0, 12).map((q, i) => `${i + 1}. ${q}`),
    "",
    "Recommended follow-up: reply from io@maziz.me with a concrete next step (hire page or a 20-minute discovery call).",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, visitorInfo, channel } = body;
    let messages: Array<{ role: string; content: string; timestamp?: string }> = Array.isArray(body.messages) ? body.messages : [];

    if (!conversationId || !visitorInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { name, email, sessionId } = visitorInfo;

    if (messages.filter((m) => m.role === "user").length === 0) {
      try {
        const { ragMemory } = await import("@/lib/rag/memory");
        const stored = await ragMemory.loadRecentMessages(conversationId, 40);
        if (Array.isArray(stored) && stored.length) {
          messages = stored.map((m: any) => ({
            role: m.role,
            content: m.content,
            timestamp: m.created_at || m.timestamp,
          }));
        }
      } catch (err: any) {
        console.error("[end-session] Memory fallback failed:", err?.message);
      }
    }

    const startedAt = messages[0]?.timestamp || new Date().toISOString();
    const endedAt = new Date().toISOString();
    const startMs = new Date(startedAt).getTime();
    const endMs = new Date(endedAt).getTime();
    const durationMin = Number.isFinite(startMs) ? Math.max(0, Math.round((endMs - startMs) / 60000)) : 0;

    const turns = messages.filter((m) => m.role === "user" || m.role === "assistant");
    const conversationText = turns
      .map((m) => `${m.role === "user" ? name : "RAGX"}: ${String(m.content || "").trim()}`)
      .filter((line) => line.replace(/^[^:]+:\s*/, "").length > 0)
      .join("\n\n");

    let summary = fallbackSummary(name, email, turns, durationMin);
    try {
      if (conversationText.length > 20) {
        const { providerFactory } = await import("@/lib/providers");
        const aiClient = providerFactory.getChatProvider();
        const summaryRes = await aiClient.generate({
          messages: [
            {
              role: "system",
              content: "You summarize RAGX portfolio conversations for Musharraf Aziz. Be concise and factual. Never invent questions that are not in the transcript.",
            },
            {
              role: "user",
              content: `Summarize this ${channel === "voice" ? "voice" : "chat"} session for CRM follow-up.
Include: visitor overview, questions asked, services discussed, intent, and recommended follow-up.

Visitor: ${name} (${email})
Duration: ${durationMin} minutes
Transcript:
${conversationText.slice(0, 9000)}`,
            },
          ],
          maxTokens: 420,
          timeoutMs: 8000,
        });
        if (summaryRes?.content && summaryRes.content.trim().length > 40) {
          summary = summaryRes.content.trim();
        }
      }
    } catch (err: any) {
      console.error("[end-session] Summary generation failed:", err?.message);
    }

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase
        .from("conversations")
        .update({ status: "ended", ended_at: endedAt, summary, visitor_name: name, visitor_email: email })
        .eq("id", conversationId);
    } catch (err: any) {
      console.error("[end-session] Supabase update failed:", err?.message);
    }

    let emailSent = false;
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const transcriptHtml = escapeHtml(conversationText || "No transcript was captured.");
      const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
        <h2 style="color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:12px;">New RAGX ${channel === "voice" ? "Voice" : "Chat"} Session — ${escapeHtml(name)}</h2>
        <h3 style="color:#475569;">Visitor Information</h3>
        <table style="width:100%">
          <tr><td style="color:#64748b;width:140px;padding:6px 0">Name</td><td style="font-weight:600">${escapeHtml(name)}</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Email</td><td>${escapeHtml(email)}</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Channel</td><td>${channel === "voice" ? "Voice" : "Text"}</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Session ID</td><td style="font-family:monospace;font-size:12px">${escapeHtml(sessionId || conversationId)}</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Started</td><td>${escapeHtml(new Date(startedAt).toLocaleString())}</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Ended</td><td>${escapeHtml(new Date(endedAt).toLocaleString())}</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Duration</td><td>${durationMin} minute(s)</td></tr>
          <tr><td style="color:#64748b;padding:6px 0">Turns</td><td>${turns.filter((m) => m.role === "user").length} visitor / ${turns.filter((m) => m.role === "assistant").length} RAGX</td></tr>
        </table>
        <h3 style="color:#475569;margin-top:24px">Conversation Summary</h3>
        <div style="background:#f8fafc;border-left:4px solid #00D4FF;padding:16px;border-radius:4px;white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(summary)}</div>
        <h3 style="color:#475569;margin-top:24px">Full transcript</h3>
        <div style="background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;white-space:pre-wrap;font-size:13px;line-height:1.55;font-family:ui-monospace,Consolas,monospace">${transcriptHtml}</div>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
        <p style="color:#94a3b8;font-size:12px">Generated by RAGX — Musharraf Aziz AI Knowledge System</p>
      </div>`;
      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "ragx@maziz.me",
        to: [process.env.ADMIN_EMAIL || "io@maziz.me"],
        subject: `New RAGX ${channel === "voice" ? "Voice" : "Chat"} Session — ${name}`,
        html,
      });
      if (!emailError) emailSent = true;
      else console.error("[end-session] Email error:", emailError);
    } catch (err: any) {
      console.error("[end-session] Email failed:", err?.message);
    }

    return NextResponse.json({
      success: true,
      summary,
      endedAt,
      emailSent,
    });
  } catch (error: any) {
    console.error("[end-session] Unhandled error:", error?.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
