/**
 * API Route: AI Orchestrator
 * POST /api/ai/orchestrate
 */

import { NextRequest, NextResponse } from 'next/server';
import { orchestrate, quickQualify, fullQualify } from '../../../../../api/ai/orchestrator';
import type { OrchestrationType, OrchestrationInput, OrchestrationOptions } from '../../../../../api/ai/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type = 'quick_assessment',
      domain,
      companyName,
      existingCompany,
      existingContacts,
      targetRoles,
      focusProducts,
      customInstructions,
      options = {},
    } = body;

    // Quick endpoints for common operations
    if (type === 'quick' && domain) {
      const result = await quickQualify(domain);
      return NextResponse.json({
        success: result.success,
        data: {
          company: result.company,
          score: result.score,
          recommendations: result.recommendations,
          summary: result.summary,
        },
        meta: {
          steps: result.execution.steps.length,
          duration: result.execution.duration,
          cost: result.execution.cost,
        },
      });
    }

    if (type === 'full' && domain) {
      const result = await fullQualify(domain, options as Partial<OrchestrationOptions>);
      return NextResponse.json({
        success: result.success,
        data: {
          company: result.company,
          contacts: result.contacts,
          score: result.score,
          pitches: result.pitches,
          recommendations: result.recommendations,
          nextSteps: result.nextSteps,
          summary: result.summary,
        },
        meta: {
          steps: result.execution.steps.length,
          duration: result.execution.duration,
          cost: result.execution.cost,
          tokens: result.execution.totalTokens,
        },
      });
    }

    // Custom orchestration
    const input: OrchestrationInput = {
      domain,
      companyName,
      existingCompany,
      existingContacts,
      targetRoles,
      focusProducts,
      customInstructions,
    };

    const result = await orchestrate({
      type: type as OrchestrationType,
      input,
      options: options as OrchestrationOptions,
    });

    return NextResponse.json({
      success: result.success,
      data: {
        company: result.company,
        contacts: result.contacts,
        score: result.score,
        pitches: result.pitches,
        recommendations: result.recommendations,
        nextSteps: result.nextSteps,
        summary: result.summary,
      },
      meta: {
        executionId: result.execution.id,
        steps: result.execution.steps,
        duration: result.execution.duration,
        cost: result.execution.cost,
        tokens: result.execution.totalTokens,
      },
    });
  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json(
      { success: false, error: 'Orchestration failed' },
      { status: 500 }
    );
  }
}
