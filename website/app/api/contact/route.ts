import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateRequest } from '@/lib/security/validation';
import { contactSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { emailService } from '@/lib/email/resend';
import { db } from '@/lib/db/supabase';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await checkRateLimit(ip, 'contact', 5, 3600000); // 5 requests per hour

    const data = await validateRequest(contactSchema, req);

    // Save to Database
    try {
      await db.insert('contacts', data);
    } catch (dbError: any) {
      console.error('[Contact API] Failed to save to database:', dbError);
      // We continue even if DB fails, as email is the primary notification
    }

    // Trigger Notification
    let notificationResult;
    try {
      notificationResult = await emailService.sendContactNotification(data);
      console.log('[Contact API] Resend notification message ID:', notificationResult?.data?.id);
    } catch (emailError: any) {
      console.error('[Contact API] Failed to send notification email:', emailError);
      // If notification fails, we MUST fail the request so the frontend shows an error
      return errorResponse(new Error('Failed to deliver message. Please try emailing io@maziz.me directly.'));
    }
    
    // Acknowledge Lead
    try {
      await emailService.sendLeadAcknowledgement(data.email, data.name);
    } catch (ackError: any) {
      console.error('[Contact API] Failed to send acknowledgment email:', ackError);
      // We do not fail the request if just the auto-reply fails
    }

    return successResponse({ received: true, id: notificationResult?.data?.id }, { message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('[Contact API] Unhandled exception:', error);
    return errorResponse(error);
  }
}
