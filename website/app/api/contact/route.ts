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
    await db.insert('contacts', data);

    // Trigger Notification
    await emailService.sendContactNotification(data);
    
    // Acknowledge Lead
    await emailService.sendLeadAcknowledgement(data.email, data.name);

    return successResponse({ received: true }, { message: 'Inquiry submitted successfully.' });
  } catch (error) {
    return errorResponse(error);
  }
}
