/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { CONFIG } from '@/lib/config/constants';

export const emailTemplates = {
  adminNotification: (data: any, score: number, category: string) => `
    <h2>New Enterprise Lead: ${category} (${score}/100)</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
    <p><strong>Project Type:</strong> ${data.projectType || 'N/A'}</p>
    <hr />
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
    <hr />
    <small>Source: ${data.source_page || 'Direct'} | IP Logged</small>
  `,

  visitorAcknowledgement: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A18;">
      <h2 style="color: #C1652F;">Inquiry Received</h2>
      <p>Hello ${name},</p>
      <p>Thank you for reaching out regarding architectural consulting and engineering services.</p>
      <p>This is an automated confirmation that your request has been securely logged. I review all inquiries personally and typically respond within 24 business hours.</p>
      <p>If you have any supporting architecture diagrams or requirements documentation, feel free to reply directly to this thread.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>Musharraf Aziz</strong><br/>Senior Software Architect<br/>${CONFIG.seo.title}</p>
    </div>
  `
};
