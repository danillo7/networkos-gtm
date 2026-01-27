/**
 * API Route: Generate Pitch
 * POST /api/ai/pitch
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePitch, generateVariants, improvePitch } from '../../../../../api/ai/generate-pitch';
import type { Company, Contact, PitchType, PitchTone, GeneratedPitch } from '../../../../../api/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company,
      contact,
      type = 'email',
      tone = 'Professional',
      length = 'medium',
      focusProducts,
      customHooks,
      senderName,
      senderTitle,
    } = body;

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company data is required' },
        { status: 400 }
      );
    }

    const result = await generatePitch({
      company: company as Company,
      contact: contact as Contact | undefined,
      type: type as PitchType,
      tone: tone as PitchTone,
      length: length as 'short' | 'medium' | 'long',
      focusProducts,
      customHooks,
      senderName,
      senderTitle,
    });

    return NextResponse.json({
      success: true,
      data: {
        pitch: result.pitch,
        variants: result.variants,
      },
      meta: {
        tokensUsed: result.tokensUsed,
        duration: result.duration,
      },
    });
  } catch (error) {
    console.error('Pitch generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Pitch generation failed' },
      { status: 500 }
    );
  }
}

// Generate variants endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, pitch, company, contact, feedback, variantCount = 2 } = body;

    if (action === 'variants') {
      if (!pitch || !company) {
        return NextResponse.json(
          { success: false, error: 'Pitch and company required' },
          { status: 400 }
        );
      }

      const result = await generateVariants(
        pitch as GeneratedPitch,
        company as Company,
        contact as Contact | undefined,
        variantCount
      );

      return NextResponse.json({
        success: true,
        data: { variants: result.variants },
        meta: { tokensUsed: result.tokensUsed },
      });
    }

    if (action === 'improve') {
      if (!pitch) {
        return NextResponse.json(
          { success: false, error: 'Pitch required' },
          { status: 400 }
        );
      }

      const result = await improvePitch(pitch as GeneratedPitch, feedback);

      return NextResponse.json({
        success: true,
        data: {
          improved: result.improved,
          suggestions: result.suggestions,
        },
        meta: { tokensUsed: result.tokensUsed },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Pitch update error:', error);
    return NextResponse.json(
      { success: false, error: 'Pitch update failed' },
      { status: 500 }
    );
  }
}
