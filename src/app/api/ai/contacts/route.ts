/**
 * API Route: Find Contacts
 * POST /api/ai/contacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { findContacts, verifyEmail, findEmail } from '../../../../../api/ai/find-contacts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      companyName,
      domain,
      industry,
      targetRoles,
      maxContacts = 10,
    } = body;

    if (!domain || !companyId) {
      return NextResponse.json(
        { success: false, error: 'Domain and companyId are required' },
        { status: 400 }
      );
    }

    const result = await findContacts({
      companyId,
      companyName: companyName || '',
      domain,
      industry,
      targetRoles,
      maxContacts,
    });

    return NextResponse.json({
      success: result.success,
      data: {
        contacts: result.contacts,
        totalFound: result.totalFound,
        sources: result.sources,
      },
      meta: {
        tokensUsed: result.tokensUsed,
        duration: result.duration,
      },
    });
  } catch (error) {
    console.error('Find Contacts API error:', error);
    return NextResponse.json(
      { success: false, error: 'Contact finding failed' },
      { status: 500 }
    );
  }
}

// Verify email endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, domain } = body;

    if (email) {
      const result = await verifyEmail(email);
      return NextResponse.json({ success: true, data: result });
    }

    if (firstName && lastName && domain) {
      const result = await findEmail(firstName, lastName, domain);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { success: false, error: 'Email or name+domain required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
