import { Resend } from "resend";
import { envServer } from "@/lib/config/env.server";
import { CONFIG } from "@/lib/config/constants";
import { logger } from "@/lib/utils/logger";
import {
  contactNotificationHtml,
  contactNotificationText,
  visitorAcknowledgementHtml,
  type ContactEmailData,
} from "@/lib/email/templates";
import "server-only";

function recipients() {
  return (envServer.ADMIN_EMAIL || CONFIG.email.support)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envServer.RESEND_API_KEY);
  }

  async sendContactNotification(data: ContactEmailData, score?: number, category?: string) {
    logger.info("Sending contact notification email", { email: data.email, projectType: data.projectType });
    try {
      const payload = {
        from: envServer.RESEND_FROM_EMAIL || CONFIG.email.identity,
        to: recipients(),
        replyTo: data.email,
        subject: `New Inquiry: ${data.projectType || data.channel || "General"} — ${data.name}`,
        html: contactNotificationHtml(data, score, category),
        text: contactNotificationText(data, score, category),
      };

      const { data: result, error } = await this.resend.emails.send(payload);

      if (error) {
        logger.error("Failed to send contact notification", { error });
        throw error;
      }
      return { success: true, data: result };
    } catch (e) {
      logger.error("Exception in sendContactNotification", { error: e });
      throw e;
    }
  }

  async sendLeadAcknowledgement(
    toEmail: string,
    name: string,
    recap?: Pick<ContactEmailData, "engagement" | "projectType" | "timeline">
  ) {
    logger.info("Sending acknowledgement email", { toEmail, name });
    try {
      const { data: result, error } = await this.resend.emails.send({
        from: envServer.RESEND_FROM_EMAIL || CONFIG.email.identity,
        to: [toEmail],
        subject: `Thanks for reaching out, ${name}`,
        html: visitorAcknowledgementHtml(name, recap),
        text: `Hi ${name},\n\nI have received your inquiry and will review it shortly. I typically respond within 24-48 hours.\n\nBest,\nMusharraf Aziz`,
      });

      if (error) {
        logger.error("Failed to send acknowledgement email", { error });
        throw error;
      }
      return { success: true, data: result };
    } catch (e) {
      logger.error("Exception in sendLeadAcknowledgement", { error: e });
      throw e;
    }
  }
}

export const emailService = new EmailService();
