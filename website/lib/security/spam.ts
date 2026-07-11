/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { ValidationError } from '@/lib/utils/errors';
import { logger } from '@/lib/utils/logger';

export class SpamProtection {
  
  /**
   * Validates the invisible honeypot field.
   * If filled, it's a bot.
   */
  checkHoneypot(honeypotValue?: string) {
    if (honeypotValue && honeypotValue.length > 0) {
      logger.warn('Spam Protection: Honeypot triggered');
      throw new ValidationError('Suspicious activity detected.');
    }
  }

  /**
   * Simulates Cloudflare Turnstile verification
   */
  async verifyTurnstile(token: string): Promise<boolean> {
    if (!token) throw new ValidationError('Turnstile token missing');
    
    // In production, verify against Cloudflare's endpoint
    // const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { ... })
    return true; 
  }

  /**
   * Checks against known disposable email providers
   */
  isDisposableEmail(email: string): boolean {
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain || '');
  }

  /**
   * Sanitizes generic injection attempts
   */
  sanitizeInput(text: string): string {
    return text.replace(/[<>]/g, ''); // Basic stripping for architecture example
  }
}

export const spamProtection = new SpamProtection();
