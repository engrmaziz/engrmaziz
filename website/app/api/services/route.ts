/* eslint-disable */
// @ts-nocheck
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateRequest } from '@/lib/security/validation';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { spamProtection } from '@/lib/security/spam';
import { leadScoring } from '@/lib/services/LeadScoringService';
import { emailService } from '@/lib/email/resend';
import { db } from '@/lib/db/supabase';
import { z } from 'zod';

const serviceRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  services: z.array(z.string()).min(1),
  projectDescription: z.string().min(10),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  honeypot: z.string().optional(),
  turnstileToken: z.string()
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await checkRateLimit(ip, 'service_request', 3, 3600000);

    const data = await validateRequest(serviceRequestSchema, req);

    // Spam Protection Pipeline
    spamProtection.checkHoneypot(data.honeypot);
    await spamProtection.verifyTurnstile(data.turnstileToken);
    if (spamProtection.isDisposableEmail(data.email)) {
      throw new Error("Please provide a valid business email.");
    }

    // Lead Qualification Pipeline
    const score = leadScoring.calculateScore({
      email: data.email,
      company: data.company,
      projectDescription: data.projectDescription,
      services: data.services,
      budget: data.budget,
      timeline: data.timeline,
    });
    
    // Store in Supabase
    await db.insert('service_requests', {
      ...data,
      lead_score: score,
      status: 'pending'
    });

    // Email Automation
    await emailService.sendLeadAcknowledgement(data.email, data.name);
    
    return successResponse({ received: true, qualificationStatus: leadScoring.getCategory(score) });
  } catch (error) {
    return errorResponse(error);
  }
}
