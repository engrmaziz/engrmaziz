/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export class LeadScoringService {
  /**
   * Calculates a lead score from 0-100 based on provided inputs
   */
  calculateScore(data: {
    email: string;
    company?: string;
    projectDescription?: string;
    services?: string[];
    hasAttachment?: boolean;
    budget?: string;
    timeline?: string;
  }): number {
    let score = 0;

    // 1. Business Email Verification (Base: 25 points)
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const domain = data.email.split('@')[1]?.toLowerCase();
    if (domain && !freeProviders.includes(domain)) {
      score += 25;
    } else {
      score += 5; // Minimal points for free emails
    }

    // 2. Company Name Provided (15 points)
    if (data.company && data.company.trim().length > 2) {
      score += 15;
    }

    // 3. Project Description Depth (Up to 20 points)
    if (data.projectDescription) {
      const length = data.projectDescription.trim().length;
      if (length > 200) score += 20;
      else if (length > 100) score += 15;
      else if (length > 50) score += 10;
      else score += 5;
    }

    // 4. Requested Services Complexity (Up to 15 points)
    if (data.services && data.services.length > 0) {
      const highValueServices = ['RAG Systems', 'AI/ML Engineering', 'Backend Engineering', 'Voice Agents'];
      const hasHighValue = data.services.some(s => highValueServices.includes(s));
      score += hasHighValue ? 15 : 10;
    }

    // 5. Budget Indication (10 points)
    if (data.budget && data.budget !== 'Under $5k' && data.budget !== '') {
      score += 10;
    }

    // 6. Attachment Inclusion (10 points)
    // Indicates serious requirements mapping
    if (data.hasAttachment) {
      score += 10;
    }

    // 7. Timeline Urgency (5 points)
    if (data.timeline && (data.timeline.includes('Immediate') || data.timeline.includes('1 Month'))) {
      score += 5;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  getCategory(score: number): 'Cold' | 'Warm' | 'Hot' | 'Qualified' | 'Enterprise' {
    if (score >= 90) return 'Enterprise';
    if (score >= 75) return 'Qualified';
    if (score >= 50) return 'Hot';
    if (score >= 30) return 'Warm';
    return 'Cold';
  }
}

export const leadScoring = new LeadScoringService();
