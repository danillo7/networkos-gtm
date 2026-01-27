/**
 * API Route: Analytics Summary
 * GET /api/analytics/summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics, getAnalyticsSummary, exportAnalyticsCSV } from '../../../../../api/analytics/summary';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') as 'day' | 'week' | 'month' | 'quarter' | 'year' | null;
    const format = searchParams.get('format');

    // Export CSV
    if (format === 'csv' && period) {
      const csv = await exportAnalyticsCSV(period);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${period}.csv"`,
        },
      });
    }

    // Get period summary
    if (period) {
      const summary = await getAnalyticsSummary(period);
      return NextResponse.json({
        success: true,
        data: summary,
      });
    }

    // Default: dashboard metrics
    const metrics = await getDashboardMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
