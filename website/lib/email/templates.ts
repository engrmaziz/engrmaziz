import { CONFIG } from "@/lib/config/constants";

export type ContactEmailData = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  projectType?: string;
  engagement?: string;
  timeline?: string;
  message: string;
  source?: string;
  channel?: string;
  conversation?: Array<{ role: string; content: string }>;
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  freelance: "Freelance / contract project",
  "full-time": "Full-time hiring",
  either: "Either — let's talk",
};

const PROJECT_LABELS: Record<string, string> = {
  ai: "AI / RAG Architecture",
  backend: "Backend Systems Scaling",
  fullstack: "Full-Stack Development",
  consulting: "Technical Consulting",
  other: "Other",
};

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelEngagement(value?: string) {
  if (!value) return "";
  return ENGAGEMENT_LABELS[value] || value;
}

function labelProject(value?: string) {
  if (!value) return "";
  return PROJECT_LABELS[value] || value;
}

export function formatMeetingTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })} (US Eastern)`;
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr><td style="color:#64748b;width:160px;padding:6px 0;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`;
}

function transcriptHtml(conversation?: Array<{ role: string; content: string }>, visitorName = "Visitor") {
  if (!conversation?.length) return "";
  const body = conversation
    .filter((turn) => turn.role === "user" || turn.role === "assistant")
    .map((turn) => `${turn.role === "user" ? visitorName : "RAGX"}: ${turn.content}`)
    .join("\n\n");
  if (!body.trim()) return "";
  return `<h3 style="color:#475569;margin-top:24px">Conversation</h3>
    <div style="background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;white-space:pre-wrap;font-size:13px;line-height:1.55;font-family:ui-monospace,Consolas,monospace">${escapeHtml(body)}</div>`;
}

export function contactNotificationHtml(data: ContactEmailData, score?: number, category?: string) {
  const title = data.projectType ? labelProject(data.projectType) : "General inquiry";
  const heading = score != null && category
    ? `New ${escapeHtml(category)} lead (${score}/100)`
    : `New inquiry: ${escapeHtml(title)}`;
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
    <h2 style="margin:0 0 16px">${heading}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Company", data.company)}
      ${row("Role", data.role)}
      ${row("Engagement", labelEngagement(data.engagement))}
      ${row("Project type", labelProject(data.projectType) || data.projectType)}
      ${row("Preferred meeting", formatMeetingTime(data.timeline))}
      ${row("Channel", data.channel)}
      ${row("Source", data.source)}
    </table>
    <h3 style="color:#475569;margin-top:24px">Message</h3>
    <div style="background:#f8fafc;border-left:4px solid #C9A227;padding:16px;border-radius:4px;white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(data.message || "")}</div>
    ${transcriptHtml(data.conversation, data.name)}
    <p style="color:#94a3b8;font-size:12px;margin-top:24px">Reply directly to this email to reach ${escapeHtml(data.name)}.</p>
  </div>`;
}

export function contactNotificationText(data: ContactEmailData, score?: number, category?: string) {
  const lines = [
    score != null && category ? `New ${category} lead (${score}/100)` : "New inquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : "",
    data.role ? `Role: ${data.role}` : "",
    data.engagement ? `Engagement: ${labelEngagement(data.engagement)}` : "",
    data.projectType ? `Project type: ${labelProject(data.projectType) || data.projectType}` : "",
    data.timeline ? `Preferred meeting: ${formatMeetingTime(data.timeline)}` : "",
    data.channel ? `Channel: ${data.channel}` : "",
    data.source ? `Source: ${data.source}` : "",
    "",
    "Message:",
    data.message || "",
  ].filter((line, i, arr) => line !== "" || arr[i - 1] !== "");

  if (data.conversation?.length) {
    lines.push("", "Conversation:");
    for (const turn of data.conversation) {
      if (turn.role !== "user" && turn.role !== "assistant") continue;
      lines.push("", `${turn.role === "user" ? data.name : "RAGX"}: ${turn.content}`);
    }
  }
  return lines.join("\n").trim();
}

export function visitorAcknowledgementHtml(name: string, data?: Pick<ContactEmailData, "engagement" | "projectType" | "timeline">) {
  const recap = [
    data?.engagement ? `Engagement: ${labelEngagement(data.engagement)}` : "",
    data?.projectType ? `Project type: ${labelProject(data.projectType) || data.projectType}` : "",
    data?.timeline ? `Preferred meeting: ${formatMeetingTime(data.timeline)}` : "",
  ].filter(Boolean);

  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
    <h2 style="color:#0B1220;margin:0 0 12px">Inquiry received</h2>
    <p>Hello ${escapeHtml(name)},</p>
    <p>This is an automated confirmation that your message reached Musharraf Aziz. He reviews inquiries personally and typically replies within 24 business hours.</p>
    ${recap.length ? `<p style="background:#f8fafc;padding:12px 16px;border-radius:8px;white-space:pre-wrap">${escapeHtml(recap.join("\n"))}</p>` : ""}
    <p>If you have architecture notes or requirements, reply to this email.</p>
    <p>Best regards,<br/><strong>Musharraf Aziz</strong><br/>Senior AI Engineer<br/>${escapeHtml(CONFIG.seo.title)}</p>
  </div>`;
}

export const emailTemplates = {
  adminNotification: (data: ContactEmailData, score: number, category: string) =>
    contactNotificationHtml(data, score, category),
  visitorAcknowledgement: (name: string) => visitorAcknowledgementHtml(name),
};
