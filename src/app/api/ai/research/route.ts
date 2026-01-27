/**
 * API Route: Research Company
 * POST /api/ai/research
 */

import { NextRequest, NextResponse } from 'next/server';
import { researchCompany, quickResearch } from '../../../../../api/ai/research-company';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, companyName, depth = 'standard', quick = false } = body;

    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Domain is required' },
        { status: 400 }
      );
    }

    if (quick) {
      const result = await quickResearch(domain);
      return NextResponse.json({ success: true, data: result });
    }

    const result = await researchCompany(domain, companyName, {
      depth: depth as 'basic' | 'standard' | 'deep',
    });

    return NextResponse.json({
      success: result.success,
      data: {
        company: result.company,
        signals: result.signals,
        voiceAIOpportunities: result.voiceAIOpportunities,
        competitorInsights: result.competitorInsights,
        sources: result.sources,
        reasoning: result.reasoning,
      },
      meta: {
        tokensUsed: result.tokensUsed,
        duration: result.duration,
      },
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { success: false, error: 'Research failed' },
      { status: 500 }
    );
  }
}
