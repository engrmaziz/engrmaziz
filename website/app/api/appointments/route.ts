/* eslint-disable */
// @ts-nocheck
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateRequest } from '@/lib/security/validation';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { calendarService } from '@/lib/services/CalendarService';
import { db } from '@/lib/db/supabase';
import { z } from 'zod';

const appointmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  purpose: z.string().min(5),
  preferredDate: z.string(),
  preferredTime: z.string(),
  timezone: z.string(),
  platform: z.enum(['Google Meet', 'Zoom', 'Microsoft Teams', 'Phone']),
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await checkRateLimit(ip, 'appointment', 3, 86400000); // 3 per day

    const data = await validateRequest(appointmentSchema, req);

    // 1. Check Availability via Google Calendar API
    const isAvailable = await calendarService.checkAvailability(data.preferredDate, data.preferredTime, data.timezone);
    
    if (!isAvailable) {
      const alternatives = await calendarService.suggestAlternativeSlots(data.preferredDate, data.timezone);
      return successResponse({ available: false, alternatives });
    }

    // 2. Create Tentative Database Record
    const appointment = await db.insert('appointments', {
      visitor_details: { name: data.name, email: data.email },
      meeting_purpose: data.purpose,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      timezone: data.timezone,
      calendar_status: 'pending',
    });

    // In a real flow, you might auto-confirm and create the GCal event instantly, 
    // or wait for admin approval via the Dashboard.
    
    return successResponse({ available: true, status: 'pending_approval' });
  } catch (error) {
    return errorResponse(error);
  }
}
