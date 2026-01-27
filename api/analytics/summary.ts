/**
 * NetworkOS - Analytics Summary API
 * Aggregates metrics and generates insights
 */

import { supabaseAdmin, getAnalyticsCounts, getRecentActivity } from '../lib/supabase';
import type {
  AnalyticsSummary,
  DashboardMetrics,
  UrgentAction,
  Activity,
  GeneratedPitch,
  Opportunity,
  Company,
} from '../lib/types';

// Analytics configuration
const ANALYTICS_CONFIG = {
  urgentActionThresholds: {
    followUpDays: 3, // Days before follow-up becomes urgent
    highScoreThreshold: 75, // AI score threshold for urgent lead
    meetingSoonDays: 2, // Days before meeting is considered "soon"
  },
  periods: {
    day: 1,
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
  },
};

/**
 * Get dashboard metrics for the main view
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Get counts
  const counts = await getAnalyticsCounts();

  // Get additional metrics
  const [
    activeSequences,
    pipelineValue,
    averageScore,
    enrichmentRate,
    engagementRate,
    weeklyGrowth,
    urgentActions,
    recentActivity,
  ] = await Promise.all([
    getActiveSequencesCount(),
    getPipelineValue(),
    getAverageAIScore(),
    getEnrichmentSuccessRate(),
    getPitchEngagementRate(),
    getWeekOverWeekGrowth(),
    getUrgentActions(),
    getRecentActivityFormatted(),
  ]);

  return {
    totalCompanies: counts.companies,
    totalContacts: counts.contacts,
    activeSequences,
    pipelineValue,
    averageAIScore: averageScore,
    enrichmentSuccessRate: enrichmentRate,
    pitchEngagementRate: engagementRate,
    weekOverWeekGrowth: weeklyGrowth,
    recentActivity,
    urgentActions,
  };
}

/**
 * Get analytics summary for a specific period
 */
export async function getAnalyticsSummary(
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
): Promise<AnalyticsSummary> {
  const days = ANALYTICS_CONFIG.periods[period];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    companiesResearched,
    contactsFound,
    pitchesGenerated,
    emailMetrics,
    meetings,
    opportunities,
    topPitches,
    topOpportunities,
  ] = await Promise.all([
    getCompaniesResearchedCount(startDate),
    getContactsFoundCount(startDate),
    getPitchesGeneratedCount(startDate),
    getEmailMetrics(startDate),
    getMeetingsCount(startDate),
    getOpportunitiesData(startDate),
    getTopPerformingPitches(startDate),
    getTopOpportunities(),
  ]);

  return {
    period,
    startDate,
    endDate: new Date(),
    metrics: {
      companiesResearched,
      contactsFound,
      pitchesGenerated,
      emailsSent: emailMetrics.sent,
      openRate: emailMetrics.openRate,
      replyRate: emailMetrics.replyRate,
      meetingsBooked: meetings,
      opportunities: opportunities.count,
      pipelineValue: opportunities.value,
      conversionRate: opportunities.conversionRate,
    },
    topPerformingPitches: topPitches,
    topOpportunities,
    aiInsights: generateAIInsights({
      companiesResearched,
      contactsFound,
      pitchesGenerated,
      emailMetrics,
      meetings,
      opportunities,
    }),
  };
}

// Helper functions for metrics

async function getActiveSequencesCount(): Promise<number> {
  const { count } = await supabaseAdmin
    .from('outreach_sequences')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  return count || 0;
}

async function getPipelineValue(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('opportunities')
    .select('value')
    .not('stage', 'in', '("Won","Lost")');

  return data?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0;
}

async function getAverageAIScore(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('companies')
    .select('ai_score')
    .not('ai_score', 'is', null);

  if (!data || data.length === 0) return 0;

  const scores = data
    .map((c) => {
      try {
        const score = typeof c.ai_score === 'string' ? JSON.parse(c.ai_score) : c.ai_score;
        return score?.overall || 0;
      } catch {
        return 0;
      }
    })
    .filter((s) => s > 0);

  return scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
}

async function getEnrichmentSuccessRate(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('enrichment_logs')
    .select('status')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (!data || data.length === 0) return 0;

  const successful = data.filter((l) => l.status === 'success').length;
  return successful / data.length;
}

async function getPitchEngagementRate(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('pitches')
    .select('feedback')
    .not('feedback', 'is', null);

  if (!data || data.length === 0) return 0;

  const engaged = data.filter((p) => {
    try {
      const feedback = typeof p.feedback === 'string' ? JSON.parse(p.feedback) : p.feedback;
      return feedback?.opened || feedback?.replied;
    } catch {
      return false;
    }
  }).length;

  return engaged / data.length;
}

async function getWeekOverWeekGrowth(): Promise<{
  companies: number;
  contacts: number;
  opportunities: number;
}> {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [thisWeek, lastWeek] = await Promise.all([
    Promise.all([
      supabaseAdmin.from('companies').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
      supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
      supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    ]),
    Promise.all([
      supabaseAdmin.from('companies').select('id', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', oneWeekAgo),
      supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', oneWeekAgo),
      supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', oneWeekAgo),
    ]),
  ]);

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    companies: calculateGrowth(thisWeek[0].count || 0, lastWeek[0].count || 0),
    contacts: calculateGrowth(thisWeek[1].count || 0, lastWeek[1].count || 0),
    opportunities: calculateGrowth(thisWeek[2].count || 0, lastWeek[2].count || 0),
  };
}

async function getUrgentActions(): Promise<UrgentAction[]> {
  const actions: UrgentAction[] = [];
  const now = new Date();

  // High score leads not yet contacted
  const { data: highScoreLeads } = await supabaseAdmin
    .from('companies')
    .select('id, name, ai_score')
    .not('ai_score', 'is', null)
    .limit(10);

  for (const lead of highScoreLeads || []) {
    try {
      const score = typeof lead.ai_score === 'string' ? JSON.parse(lead.ai_score) : lead.ai_score;
      if (score?.overall >= ANALYTICS_CONFIG.urgentActionThresholds.highScoreThreshold) {
        // Check if there's an opportunity for this company
        const { count } = await supabaseAdmin
          .from('opportunities')
          .select('id', { count: 'exact', head: true })
          .eq('company_id', lead.id);

        if (count === 0) {
          actions.push({
            type: 'high_score_lead',
            entityType: 'company',
            entityId: lead.id,
            message: `High-scoring lead: ${lead.name} (Score: ${score.overall})`,
            priority: 'high',
          });
        }
      }
    } catch {
      // Skip invalid score
    }
  }

  // Follow-ups due
  const { data: sequences } = await supabaseAdmin
    .from('outreach_sequences')
    .select('id, name, steps, company_id')
    .eq('status', 'active');

  for (const seq of sequences || []) {
    try {
      const steps = typeof seq.steps === 'string' ? JSON.parse(seq.steps) : seq.steps;
      const pendingStep = steps.find((s: { status: string; scheduledAt: string }) =>
        s.status === 'scheduled' && new Date(s.scheduledAt) <= now
      );

      if (pendingStep) {
        actions.push({
          type: 'follow_up_due',
          entityType: 'opportunity',
          entityId: seq.id,
          message: `Follow-up due for sequence: ${seq.name}`,
          priority: 'medium',
          dueAt: new Date(pendingStep.scheduledAt),
        });
      }
    } catch {
      // Skip invalid sequence
    }
  }

  // Sort by priority and return top 10
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return actions
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 10);
}

async function getRecentActivityFormatted(): Promise<Activity[]> {
  const recentActivity = await getRecentActivity(10);

  return (recentActivity as Record<string, unknown>[]).map((item) => ({
    id: item.entity_id as string,
    type: mapActivityType(item.activity_type as string),
    description: item.description as string,
    contactId: item.entity_type === 'contact' ? (item.entity_id as string) : undefined,
    timestamp: new Date(item.created_at as string),
  }));
}

function mapActivityType(type: string): Activity['type'] {
  const typeMap: Record<string, Activity['type']> = {
    company_created: 'Note Added',
    contact_created: 'Note Added',
    pitch_generated: 'Note Added',
    opportunity_created: 'Stage Changed',
    email_sent: 'Email Sent',
    email_received: 'Email Received',
  };
  return typeMap[type] || 'Note Added';
}

async function getCompaniesResearchedCount(since: Date): Promise<number> {
  const { count } = await supabaseAdmin
    .from('companies')
    .select('id', { count: 'exact', head: true })
    .gte('last_enriched', since.toISOString());

  return count || 0;
}

async function getContactsFoundCount(since: Date): Promise<number> {
  const { count } = await supabaseAdmin
    .from('contacts')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since.toISOString());

  return count || 0;
}

async function getPitchesGeneratedCount(since: Date): Promise<number> {
  const { count } = await supabaseAdmin
    .from('pitches')
    .select('id', { count: 'exact', head: true })
    .gte('generated_at', since.toISOString());

  return count || 0;
}

async function getEmailMetrics(since: Date): Promise<{
  sent: number;
  openRate: number;
  replyRate: number;
}> {
  const { data } = await supabaseAdmin
    .from('pitches')
    .select('feedback')
    .eq('type', 'email')
    .gte('generated_at', since.toISOString());

  if (!data || data.length === 0) {
    return { sent: 0, openRate: 0, replyRate: 0 };
  }

  let sent = 0;
  let opened = 0;
  let replied = 0;

  for (const pitch of data) {
    try {
      const feedback = typeof pitch.feedback === 'string' ? JSON.parse(pitch.feedback) : pitch.feedback;
      if (feedback?.sent) {
        sent++;
        if (feedback.opened) opened++;
        if (feedback.replied) replied++;
      }
    } catch {
      // Skip invalid feedback
    }
  }

  return {
    sent,
    openRate: sent > 0 ? opened / sent : 0,
    replyRate: sent > 0 ? replied / sent : 0,
  };
}

async function getMeetingsCount(since: Date): Promise<number> {
  const { count } = await supabaseAdmin
    .from('opportunities')
    .select('id', { count: 'exact', head: true })
    .in('stage', ['Meeting Scheduled', 'Demo Done'])
    .gte('updated_at', since.toISOString());

  return count || 0;
}

async function getOpportunitiesData(since: Date): Promise<{
  count: number;
  value: number;
  conversionRate: number;
}> {
  const { data } = await supabaseAdmin
    .from('opportunities')
    .select('stage, value')
    .gte('created_at', since.toISOString());

  if (!data || data.length === 0) {
    return { count: 0, value: 0, conversionRate: 0 };
  }

  const won = data.filter((o) => o.stage === 'Won').length;
  const closed = data.filter((o) => ['Won', 'Lost'].includes(o.stage)).length;
  const value = data
    .filter((o) => o.stage !== 'Lost')
    .reduce((sum, o) => sum + (o.value || 0), 0);

  return {
    count: data.length,
    value,
    conversionRate: closed > 0 ? won / closed : 0,
  };
}

async function getTopPerformingPitches(since: Date): Promise<GeneratedPitch[]> {
  const { data } = await supabaseAdmin
    .from('pitches')
    .select('*')
    .gte('generated_at', since.toISOString())
    .not('feedback', 'is', null)
    .limit(5);

  // Sort by engagement (would need proper scoring in production)
  return (data || []) as unknown as GeneratedPitch[];
}

async function getTopOpportunities(): Promise<Opportunity[]> {
  const { data } = await supabaseAdmin
    .from('opportunities')
    .select('*')
    .not('stage', 'in', '("Won","Lost")')
    .order('value', { ascending: false })
    .limit(5);

  return (data || []) as unknown as Opportunity[];
}

function generateAIInsights(data: {
  companiesResearched: number;
  contactsFound: number;
  pitchesGenerated: number;
  emailMetrics: { sent: number; openRate: number; replyRate: number };
  meetings: number;
  opportunities: { count: number; value: number; conversionRate: number };
}): string[] {
  const insights: string[] = [];

  // Research efficiency
  if (data.companiesResearched > 0) {
    const contactsPerCompany = data.contactsFound / data.companiesResearched;
    if (contactsPerCompany >= 3) {
      insights.push(`Strong contact discovery: ${contactsPerCompany.toFixed(1)} contacts per company researched`);
    } else {
      insights.push('Consider deeper contact research - aim for 3+ contacts per company');
    }
  }

  // Email performance
  if (data.emailMetrics.sent > 10) {
    if (data.emailMetrics.openRate >= 0.4) {
      insights.push(`Excellent email open rate: ${(data.emailMetrics.openRate * 100).toFixed(0)}%`);
    } else if (data.emailMetrics.openRate < 0.2) {
      insights.push('Email open rates are low - try different subject lines');
    }

    if (data.emailMetrics.replyRate >= 0.1) {
      insights.push(`Great reply rate: ${(data.emailMetrics.replyRate * 100).toFixed(0)}%`);
    }
  }

  // Pipeline health
  if (data.opportunities.count > 0) {
    if (data.opportunities.conversionRate >= 0.3) {
      insights.push(`Strong conversion rate: ${(data.opportunities.conversionRate * 100).toFixed(0)}%`);
    }
  }

  // Meeting rate
  if (data.emailMetrics.sent > 0 && data.meetings > 0) {
    const meetingRate = data.meetings / data.emailMetrics.sent;
    if (meetingRate >= 0.05) {
      insights.push(`Good email-to-meeting conversion: ${(meetingRate * 100).toFixed(1)}%`);
    }
  }

  if (insights.length === 0) {
    insights.push('Keep building your pipeline - more data will unlock insights');
  }

  return insights;
}

/**
 * Export analytics to CSV format
 */
export async function exportAnalyticsCSV(
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
): Promise<string> {
  const summary = await getAnalyticsSummary(period);

  const rows = [
    ['Metric', 'Value'],
    ['Period', period],
    ['Start Date', summary.startDate.toISOString()],
    ['End Date', summary.endDate.toISOString()],
    ['Companies Researched', summary.metrics.companiesResearched.toString()],
    ['Contacts Found', summary.metrics.contactsFound.toString()],
    ['Pitches Generated', summary.metrics.pitchesGenerated.toString()],
    ['Emails Sent', summary.metrics.emailsSent.toString()],
    ['Open Rate', (summary.metrics.openRate * 100).toFixed(1) + '%'],
    ['Reply Rate', (summary.metrics.replyRate * 100).toFixed(1) + '%'],
    ['Meetings Booked', summary.metrics.meetingsBooked.toString()],
    ['Opportunities', summary.metrics.opportunities.toString()],
    ['Pipeline Value', '$' + summary.metrics.pipelineValue.toLocaleString()],
    ['Conversion Rate', (summary.metrics.conversionRate * 100).toFixed(1) + '%'],
  ];

  return rows.map((row) => row.join(',')).join('\n');
}

export default {
  getDashboardMetrics,
  getAnalyticsSummary,
  exportAnalyticsCSV,
};
