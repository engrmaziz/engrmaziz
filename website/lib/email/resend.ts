/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Resend } from 'resend';
import { envServer } from '@/lib/config/env.server';
import { CONFIG } from '@/lib/config/constants';
import { logger } from '@/lib/utils/logger';
import 'server-only';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envServer.RESEND_API_KEY);
  }

  async sendContactNotification(data: any) {
    logger.info('Sending contact notification email', { data });
    try {
      const payload = {
        from: envServer.RESEND_FROM_EMAIL || CONFIG.email.identity,
        to: (envServer.ADMIN_EMAIL || CONFIG.email.support).split(',').map((e: string) => e.trim()),
        reply_to: data.email,
        subject: `New Inquiry: ${data.projectType || 'General'}`,
        html: `<p>New contact from ${data.name} (${data.email})</p><p>${data.message}</p>`
      };
      
      console.log('[Resend Payload]:', JSON.stringify(payload, null, 2));

      const { data: result, error } = await this.resend.emails.send(payload);

      if (error) {
        logger.error('Failed to send contact notification', { error });
        throw error;
      }
      return { success: true, data: result };
    } catch (e) {
      logger.error('Exception in sendContactNotification', { error: e });
      throw e;
    }
  }

  async sendLeadAcknowledgement(toEmail: string, name: string) {
    logger.info('Sending acknowledgement email', { toEmail, name });
    try {
      const { data: result, error } = await this.resend.emails.send({
        from: envServer.RESEND_FROM_EMAIL || CONFIG.email.identity,
        to: [toEmail],
        subject: `Thanks for reaching out, ${name}`,
        html: `<p>Hi ${name},</p><p>I have received your inquiry and will review it shortly. I typically respond within 24-48 hours for new technical engagements.</p><br><p>Best,<br>Musharraf Aziz</p>`
      });

      if (error) {
        logger.error('Failed to send acknowledgement email', { error });
        throw error;
      }
      return { success: true, data: result };
    } catch (e) {
      logger.error('Exception in sendLeadAcknowledgement', { error: e });
      throw e;
    }
  }
}

export const emailService = new EmailService();
