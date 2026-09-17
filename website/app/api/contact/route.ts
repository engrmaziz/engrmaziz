import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { validateRequest } from "@/lib/security/validation";
import { contactSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { emailService } from "@/lib/email/resend";
import { db } from "@/lib/db/supabase";
import { leadScoring } from "@/lib/services/LeadScoringService";
import { contactNotificationText } from "@/lib/email/templates";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await checkRateLimit(ip, "contact", 5, 3600000);

    const data = await validateRequest(contactSchema, req);
    const emailPayload = {
      name: data.name,
      email: data.email,
      message: data.message,
      source: "/contact",
      ...(data.company ? { company: data.company } : {}),
      ...(data.role ? { role: data.role } : {}),
      ...(data.projectType ? { projectType: data.projectType } : {}),
      ...(data.engagement ? { engagement: data.engagement } : {}),
      ...(data.timeline ? { timeline: data.timeline } : {}),
    };
    const score = leadScoring.calculateScore({
      email: data.email,
      projectDescription: data.message,
      ...(data.company ? { company: data.company } : {}),
      ...(data.timeline ? { timeline: data.timeline } : {}),
    });
    const category = leadScoring.getCategory(score);
    const fullText = contactNotificationText(emailPayload, score, category);

    try {
      await db.insert("contacts", {
        name: data.name,
        email: data.email,
        company: data.company || null,
        subject: [data.engagement, data.projectType].filter(Boolean).join(" · ") || "Contact form",
        message: fullText,
        source_page: "/contact",
        notes: JSON.stringify({
          role: data.role || null,
          engagement: data.engagement || null,
          projectType: data.projectType || null,
          timeline: data.timeline || null,
          consent: data.consent,
          lead_score: score,
        }),
        lead_score: score,
      });
    } catch (dbError: unknown) {
      console.error("[Contact API] Full insert failed, retrying minimal row:", dbError);
      try {
        await db.insert("contacts", {
          name: data.name,
          email: data.email,
          company: data.company || null,
          message: fullText,
        });
      } catch (fallbackError: unknown) {
        console.error("[Contact API] Failed to save to database:", fallbackError);
      }
    }

    let notificationResult;
    try {
      notificationResult = await emailService.sendContactNotification(emailPayload, score, category);
    } catch (emailError: unknown) {
      console.error("[Contact API] Failed to send notification email:", emailError);
      return errorResponse(new Error("Failed to deliver message. Please try emailing io@maziz.me directly."));
    }

    try {
      await emailService.sendLeadAcknowledgement(data.email, data.name, {
        ...(data.engagement ? { engagement: data.engagement } : {}),
        ...(data.projectType ? { projectType: data.projectType } : {}),
        ...(data.timeline ? { timeline: data.timeline } : {}),
      });
    } catch (ackError: unknown) {
      console.error("[Contact API] Failed to send acknowledgment email:", ackError);
    }

    return successResponse(
      { received: true, id: notificationResult?.data?.id },
      { message: "Inquiry submitted successfully." }
    );
  } catch (error) {
    console.error("[Contact API] Unhandled exception:", error);
    return errorResponse(error);
  }
}
