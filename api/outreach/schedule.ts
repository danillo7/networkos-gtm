/**
 * NetworkOS - Outreach Scheduling API
 * Intelligent scheduling for multi-step outreach sequences
 */

import type {
  OutreachSequence,
  OutreachStep,
  OutreachStepType,
  StepStatus,
  SequenceMetrics,
  Contact,
  Company,
  GeneratedPitch,
} from '../lib/types';
import { createSequence, updateSequenceStatus } from '../lib/supabase';

// Scheduling configuration
const SCHEDULE_CONFIG = {
  // Default working hours (in target timezone)
  workingHours: {
    start: 9, // 9 AM
    end: 17, // 5 PM
  },
  // Best days for outreach (0 = Sunday, 6 = Saturday)
  bestDays: [1, 2, 3, 4], // Monday - Thursday
  // Optimal send times based on research
  optimalTimes: {
    email: [10, 14], // 10 AM, 2 PM
    linkedin: [8, 12, 17], // 8 AM, 12 PM, 5 PM
    call: [10, 15], // 10 AM, 3 PM
  },
  // Default wait periods between steps (in days)
  defaultWaits: {
    after_email: 3,
    after_linkedin: 2,
    after_call: 1,
    after_no_response: 5,
  },
  // Maximum attempts per channel
  maxAttempts: {
    email: 4,
    linkedin: 3,
    call: 2,
  },
};

// Types for scheduling
export interface ScheduleSequenceInput {
  company: Company;
  contacts: Contact[];
  pitches?: GeneratedPitch[];
  template?: SequenceTemplate;
  startDate?: Date;
  timezone?: string;
}

export interface SequenceTemplate {
  name: string;
  steps: TemplateStep[];
}

export interface TemplateStep {
  type: OutreachStepType;
  waitDays: number;
  requiresPitch?: boolean;
  fallbackAction?: OutreachStepType;
}

export interface ScheduleResult {
  sequence: OutreachSequence;
  scheduledSteps: ScheduledStep[];
  estimatedDuration: number; // in days
  recommendations: string[];
}

export interface ScheduledStep extends OutreachStep {
  targetContact?: Contact;
  pitch?: GeneratedPitch;
  suggestedTime: Date;
  alternativeTimes: Date[];
}

// Pre-built sequence templates
export const SEQUENCE_TEMPLATES: Record<string, SequenceTemplate> = {
  standard: {
    name: 'Standard Outreach',
    steps: [
      { type: 'email', waitDays: 0, requiresPitch: true },
      { type: 'linkedin_connect', waitDays: 1 },
      { type: 'follow_up', waitDays: 3, requiresPitch: true },
      { type: 'call', waitDays: 5 },
      { type: 'email', waitDays: 7, requiresPitch: true },
      { type: 'linkedin_message', waitDays: 10 },
    ],
  },
  aggressive: {
    name: 'Aggressive Outreach',
    steps: [
      { type: 'email', waitDays: 0, requiresPitch: true },
      { type: 'linkedin_connect', waitDays: 0 },
      { type: 'call', waitDays: 1 },
      { type: 'follow_up', waitDays: 2, requiresPitch: true },
      { type: 'call', waitDays: 3 },
      { type: 'email', waitDays: 4, requiresPitch: true },
      { type: 'linkedin_message', waitDays: 5 },
    ],
  },
  gentle: {
    name: 'Gentle Touch',
    steps: [
      { type: 'linkedin_connect', waitDays: 0 },
      { type: 'email', waitDays: 3, requiresPitch: true },
      { type: 'linkedin_message', waitDays: 7 },
      { type: 'follow_up', waitDays: 14, requiresPitch: true },
    ],
  },
  executive: {
    name: 'Executive Outreach',
    steps: [
      { type: 'linkedin_connect', waitDays: 0 },
      { type: 'email', waitDays: 2, requiresPitch: true },
      { type: 'call', waitDays: 5 },
      { type: 'email', waitDays: 10, requiresPitch: true },
    ],
  },
};

/**
 * Schedule a new outreach sequence
 */
export async function scheduleSequence(input: ScheduleSequenceInput): Promise<ScheduleResult> {
  const {
    company,
    contacts,
    pitches = [],
    template = SEQUENCE_TEMPLATES.standard,
    startDate = new Date(),
    timezone = 'America/New_York',
  } = input;

  // Sort contacts by authority score
  const sortedContacts = [...contacts].sort((a, b) => b.authorityScore - a.authorityScore);
  const primaryContact = sortedContacts[0];

  // Generate scheduled steps
  const scheduledSteps: ScheduledStep[] = [];
  let currentDate = new Date(startDate);
  let pitchIndex = 0;

  for (let i = 0; i < template.steps.length; i++) {
    const templateStep = template.steps[i];

    // Calculate scheduled date
    currentDate = addBusinessDays(currentDate, templateStep.waitDays);
    const suggestedTime = getOptimalTime(currentDate, templateStep.type, timezone);

    // Assign pitch if required
    let assignedPitch: GeneratedPitch | undefined;
    if (templateStep.requiresPitch && pitches.length > pitchIndex) {
      assignedPitch = pitches[pitchIndex];
      pitchIndex++;
    }

    // Select target contact based on step type
    const targetContact = selectContactForStep(templateStep.type, sortedContacts);

    scheduledSteps.push({
      id: `step_${i + 1}`,
      order: i + 1,
      type: templateStep.type,
      pitchId: assignedPitch?.id,
      scheduledAt: suggestedTime,
      status: 'pending' as StepStatus,
      waitDays: templateStep.waitDays,
      targetContact,
      pitch: assignedPitch,
      suggestedTime,
      alternativeTimes: getAlternativeTimes(suggestedTime, templateStep.type, timezone),
    });
  }

  // Calculate estimated duration
  const estimatedDuration = Math.ceil(
    (scheduledSteps[scheduledSteps.length - 1].suggestedTime.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Generate recommendations
  const recommendations = generateRecommendations(company, contacts, template);

  // Create the sequence in database
  const sequence = await createSequence({
    name: `${template.name} - ${company.name}`,
    companyId: company.id,
    contactIds: contacts.map((c) => c.id),
    status: 'scheduled',
    steps: scheduledSteps.map((s) => ({
      id: s.id,
      order: s.order,
      type: s.type,
      pitchId: s.pitchId,
      scheduledAt: s.scheduledAt,
      status: s.status,
      waitDays: s.waitDays,
    })),
    startDate,
  });

  return {
    sequence,
    scheduledSteps,
    estimatedDuration,
    recommendations,
  };
}

/**
 * Add business days to a date
 */
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }

  return result;
}

/**
 * Get optimal time for a step type
 */
function getOptimalTime(date: Date, stepType: OutreachStepType, timezone: string): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();

  // Skip weekends
  if (dayOfWeek === 0) result.setDate(result.getDate() + 1);
  if (dayOfWeek === 6) result.setDate(result.getDate() + 2);

  // Get optimal hour based on step type
  const typeKey = stepType.includes('email') || stepType === 'follow_up'
    ? 'email'
    : stepType.includes('linkedin')
      ? 'linkedin'
      : 'call';

  const optimalHours = SCHEDULE_CONFIG.optimalTimes[typeKey];
  const hour = optimalHours[0]; // Use first optimal time

  result.setHours(hour, 0, 0, 0);

  return result;
}

/**
 * Get alternative times for a step
 */
function getAlternativeTimes(suggestedTime: Date, stepType: OutreachStepType, timezone: string): Date[] {
  const alternatives: Date[] = [];

  const typeKey = stepType.includes('email') || stepType === 'follow_up'
    ? 'email'
    : stepType.includes('linkedin')
      ? 'linkedin'
      : 'call';

  const optimalHours = SCHEDULE_CONFIG.optimalTimes[typeKey];

  // Add same day alternatives
  for (const hour of optimalHours.slice(1)) {
    const alt = new Date(suggestedTime);
    alt.setHours(hour, 0, 0, 0);
    alternatives.push(alt);
  }

  // Add next day alternative
  const nextDay = new Date(suggestedTime);
  nextDay.setDate(nextDay.getDate() + 1);
  if (nextDay.getDay() !== 0 && nextDay.getDay() !== 6) {
    nextDay.setHours(optimalHours[0], 0, 0, 0);
    alternatives.push(nextDay);
  }

  return alternatives;
}

/**
 * Select the best contact for a step type
 */
function selectContactForStep(stepType: OutreachStepType, contacts: Contact[]): Contact | undefined {
  if (contacts.length === 0) return undefined;

  // For calls, prefer decision makers
  if (stepType === 'call') {
    const decisionMaker = contacts.find((c) => c.decisionMaker);
    return decisionMaker || contacts[0];
  }

  // For LinkedIn, prefer those with LinkedIn URLs
  if (stepType.includes('linkedin')) {
    const withLinkedIn = contacts.find((c) => c.linkedinUrl);
    return withLinkedIn || contacts[0];
  }

  // For email, prefer verified emails
  if (stepType === 'email' || stepType === 'follow_up') {
    const verified = contacts.find((c) => c.emailVerified);
    return verified || contacts.find((c) => c.email) || contacts[0];
  }

  return contacts[0];
}

/**
 * Generate recommendations for the sequence
 */
function generateRecommendations(
  company: Company,
  contacts: Contact[],
  template: SequenceTemplate
): string[] {
  const recommendations: string[] = [];

  // Check for decision makers
  const hasDecisionMaker = contacts.some((c) => c.decisionMaker);
  if (!hasDecisionMaker) {
    recommendations.push('Consider finding a decision maker before starting outreach');
  }

  // Check for verified emails
  const verifiedEmails = contacts.filter((c) => c.emailVerified).length;
  if (verifiedEmails < contacts.length / 2) {
    recommendations.push('Verify email addresses to improve deliverability');
  }

  // Check AI score
  if (company.aiScore && company.aiScore.overall < 50) {
    recommendations.push('Low AI score - consider researching more before outreach');
  }

  // Template-specific recommendations
  if (template.name === 'Aggressive Outreach' && company.aiScore && company.aiScore.overall < 70) {
    recommendations.push('Consider a gentler approach for medium-fit leads');
  }

  // LinkedIn recommendations
  const hasLinkedIn = contacts.some((c) => c.linkedinUrl);
  if (!hasLinkedIn && template.steps.some((s) => s.type.includes('linkedin'))) {
    recommendations.push('Find LinkedIn profiles for multi-channel outreach');
  }

  if (recommendations.length === 0) {
    recommendations.push('Sequence looks good - ready to start!');
  }

  return recommendations;
}

/**
 * Pause a running sequence
 */
export async function pauseSequence(sequenceId: string): Promise<OutreachSequence> {
  return updateSequenceStatus(sequenceId, 'paused');
}

/**
 * Resume a paused sequence
 */
export async function resumeSequence(sequenceId: string): Promise<OutreachSequence> {
  return updateSequenceStatus(sequenceId, 'active');
}

/**
 * Cancel a sequence
 */
export async function cancelSequence(sequenceId: string): Promise<OutreachSequence> {
  return updateSequenceStatus(sequenceId, 'cancelled');
}

/**
 * Update metrics for a sequence
 */
export function calculateSequenceMetrics(steps: OutreachStep[]): SequenceMetrics {
  const executedSteps = steps.filter((s) => s.status === 'executed');

  return {
    totalSent: executedSteps.length,
    delivered: executedSteps.filter((s) => s.result?.delivered).length,
    opened: executedSteps.filter((s) => s.result?.opened).length,
    clicked: executedSteps.filter((s) => s.result?.clicked).length,
    replied: executedSteps.filter((s) => s.result?.replied).length,
    meetings: 0, // Would need to track separately
    conversions: 0, // Would need to track separately
  };
}

/**
 * Get next scheduled step
 */
export function getNextStep(sequence: OutreachSequence): OutreachStep | null {
  const pendingSteps = sequence.steps.filter((s) => s.status === 'pending' || s.status === 'scheduled');
  return pendingSteps.sort((a, b) => a.order - b.order)[0] || null;
}

// SCHEDULE_CONFIG and SEQUENCE_TEMPLATES are already exported above

export default {
  scheduleSequence,
  pauseSequence,
  resumeSequence,
  cancelSequence,
  calculateSequenceMetrics,
  getNextStep,
};
