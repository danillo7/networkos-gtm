/**
 * API Route: Score Opportunity
 * POST /api/ai/score
 */

import { NextRequest, NextResponse } from 'next/server';
import { scoreOpportunity, quickScore } from '../../../../../api/ai/score-opportunity';
import type { Company, Contact, ScoringSignal } from '../../../../../api/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, contacts, signals, voiceAIOpportunities, quick = false } = body;

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company data is required' },
        { status: 400 }
      );
    }

    if (quick) {
      const score = await quickScore(company as Partial<Company>);
      return NextResponse.json({ success: true, data: { score } });
    }

    const result = await scoreOpportunity({
      company: company as Company,
      contacts: contacts as Contact[] | undefined,
      researchSignals: signals as ScoringSignal[] | undefined,
      voiceAIOpportunities,
    });

    return NextResponse.json({
      success: true,
      data: {
        score: result.score,
        breakdown: result.breakdown,
        recommendations: result.recommendations,
        nextBestActions: result.nextBestActions,
      },
      meta: {
        tokensUsed: result.tokensUsed,
      },
    });
  } catch (error) {
    console.error('Score API error:', error);
    return NextResponse.json(
      { success: false, error: 'Scoring failed' },
      { status: 500 }
    );
  }
}
