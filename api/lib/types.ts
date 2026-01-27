/**
 * NetworkOS AI-First GTM Platform - Type Definitions
 * Comprehensive TypeScript types for the entire system
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Company {
  id: string;
  name: string;
  domain: string;
  description?: string;
  industry: string;
  subIndustry?: string;
  size: CompanySize;
  employeeCount?: number;
  revenue?: string;
  funding?: FundingInfo;
  techStack: string[];
  products: Product[];
  headquarters?: Location;
  foundedYear?: number;
  linkedinUrl?: string;
  twitterHandle?: string;
  aiScore?: AIScore;
  enrichmentSources: EnrichmentSource[];
  lastEnriched?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5001-10000'
  | '10000+';

export interface FundingInfo {
  totalRaised?: string;
  lastRound?: string;
  lastRoundDate?: Date;
  investors?: string[];
  stage?: FundingStage;
}

export type FundingStage =
  | 'Pre-Seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C'
  | 'Series D+'
  | 'IPO'
  | 'Acquired'
  | 'Bootstrapped';

export interface Location {
  city?: string;
  state?: string;
  country: string;
  timezone?: string;
}

export interface Product {
  name: string;
  description: string;
  category?: string;
  url?: string;
  voiceAIPotential?: VoiceAIPotential;
}

export interface VoiceAIPotential {
  score: number; // 0-100
  useCases: string[];
  reasoning: string;
}

// ============================================================================
// CONTACTS
// ============================================================================

export interface Contact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  emailVerified?: boolean;
  emailVerificationDate?: Date;
  phone?: string;
  linkedinUrl?: string;
  title: string;
  department?: Department;
  seniority: Seniority;
  authorityScore: number; // 0-100
  decisionMaker: boolean;
  influencer: boolean;
  persona?: ContactPersona;
  enrichmentSources: EnrichmentSource[];
  lastEnriched?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Department =
  | 'Engineering'
  | 'Product'
  | 'Marketing'
  | 'Sales'
  | 'Customer Success'
  | 'Operations'
  | 'Finance'
  | 'HR'
  | 'Legal'
  | 'Executive'
  | 'IT'
  | 'Other';

export type Seniority =
  | 'C-Level'
  | 'VP'
  | 'Director'
  | 'Manager'
  | 'Senior'
  | 'Mid-Level'
  | 'Junior'
  | 'Intern';

export interface ContactPersona {
  type: PersonaType;
  painPoints: string[];
  motivations: string[];
  communicationStyle: CommunicationStyle;
  bestApproach: string;
}

export type PersonaType =
  | 'Technical Decision Maker'
  | 'Business Decision Maker'
  | 'End User Champion'
  | 'Budget Holder'
  | 'Influencer'
  | 'Gatekeeper';

export type CommunicationStyle =
  | 'Direct & Concise'
  | 'Data-Driven'
  | 'Relationship-Focused'
  | 'Visionary'
  | 'Detail-Oriented';

// ============================================================================
// AI SCORING
// ============================================================================

export interface AIScore {
  overall: number; // 0-100
  companyFit: number; // 0-100
  voiceAIOpportunity: number; // 0-100
  timingSignals: number; // 0-100
  competitiveLandscape: number; // 0-100
  budgetIndicators: number; // 0-100
  confidence: number; // 0-100
  reasoning: string;
  signals: ScoringSignal[];
  calculatedAt: Date;
  modelUsed: string;
}

export interface ScoringSignal {
  type: SignalType;
  strength: 'Strong' | 'Moderate' | 'Weak';
  description: string;
  source: string;
  timestamp?: Date;
}

export type SignalType =
  | 'Hiring'
  | 'Funding'
  | 'Tech Stack Change'
  | 'Leadership Change'
  | 'Product Launch'
  | 'Expansion'
  | 'Partnership'
  | 'Pain Point Indicator'
  | 'Competitor Usage'
  | 'Industry Trend';

// ============================================================================
// ENRICHMENT
// ============================================================================

export interface EnrichmentSource {
  provider: EnrichmentProvider;
  dataPoints: string[];
  enrichedAt: Date;
  confidence: number;
  rawData?: Record<string, unknown>;
}

export type EnrichmentProvider =
  | 'Hunter.io'
  | 'Apollo.io'
  | 'Clearbit'
  | 'People Data Labs'
  | 'Perplexity'
  | 'LinkedIn'
  | 'Crunchbase'
  | 'Manual'
  | 'AI Research';

export interface EnrichmentLog {
  id: string;
  entityType: 'company' | 'contact';
  entityId: string;
  provider: EnrichmentProvider;
  status: 'success' | 'partial' | 'failed';
  dataPointsFound: number;
  cost?: number;
  duration: number; // milliseconds
  error?: string;
  createdAt: Date;
}

export interface EnrichmentRequest {
  companyId?: string;
  contactId?: string;
  domain?: string;
  email?: string;
  providers?: EnrichmentProvider[];
  depth: EnrichmentDepth;
  priority: 'low' | 'normal' | 'high';
}

export type EnrichmentDepth = 'quick' | 'basic' | 'standard' | 'deep';

export interface EnrichmentResult {
  success: boolean;
  company?: Partial<Company>;
  contacts?: Partial<Contact>[];
  sources: EnrichmentSource[];
  totalCost: number;
  totalDuration: number;
  errors?: string[];
}

// ============================================================================
// PITCHES
// ============================================================================

export interface GeneratedPitch {
  id: string;
  companyId: string;
  contactId?: string;
  type: PitchType;
  subject?: string;
  body: string;
  hooks: string[];
  personalization: PersonalizationElement[];
  elevenlabsProducts: ElevenLabsProduct[];
  useCases: UseCase[];
  tone: PitchTone;
  length: 'short' | 'medium' | 'long';
  variant?: string; // A/B testing identifier
  generatedAt: Date;
  aiModel: string;
  promptVersion: string;
  feedback?: PitchFeedback;
}

export type PitchType = 'email' | 'linkedin' | 'call_script' | 'video_script' | 'proposal';

export type PitchTone =
  | 'Professional'
  | 'Friendly'
  | 'Technical'
  | 'Executive'
  | 'Casual'
  | 'Urgent';

export interface PersonalizationElement {
  type: 'company_specific' | 'role_specific' | 'industry_specific' | 'timing_based' | 'pain_point';
  content: string;
  source: string;
}

export interface ElevenLabsProduct {
  name: string;
  relevance: number; // 0-100
  useCases: string[];
  valueProposition: string;
}

export interface UseCase {
  title: string;
  description: string;
  benefits: string[];
  roi?: string;
}

export interface PitchFeedback {
  rating?: number; // 1-5
  sent?: boolean;
  opened?: boolean;
  replied?: boolean;
  converted?: boolean;
  notes?: string;
  updatedAt: Date;
}

export interface PitchTemplate {
  id: string;
  name: string;
  type: PitchType;
  vertical?: string;
  useCase?: string;
  template: string;
  variables: string[];
  performance?: TemplatePerformance;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplatePerformance {
  timesUsed: number;
  openRate?: number;
  replyRate?: number;
  conversionRate?: number;
}

// ============================================================================
// OUTREACH & PIPELINE
// ============================================================================

export interface OutreachSequence {
  id: string;
  name: string;
  companyId: string;
  contactIds: string[];
  status: SequenceStatus;
  steps: OutreachStep[];
  startDate?: Date;
  endDate?: Date;
  metrics?: SequenceMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export type SequenceStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface OutreachStep {
  id: string;
  order: number;
  type: OutreachStepType;
  pitchId?: string;
  scheduledAt?: Date;
  executedAt?: Date;
  status: StepStatus;
  result?: StepResult;
  waitDays: number; // Days to wait before this step
}

export type OutreachStepType =
  | 'email'
  | 'linkedin_connect'
  | 'linkedin_message'
  | 'call'
  | 'follow_up'
  | 'manual_task';

export type StepStatus = 'pending' | 'scheduled' | 'executed' | 'skipped' | 'failed';

export interface StepResult {
  delivered?: boolean;
  opened?: boolean;
  clicked?: boolean;
  replied?: boolean;
  bounced?: boolean;
  unsubscribed?: boolean;
  error?: string;
}

export interface SequenceMetrics {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  meetings: number;
  conversions: number;
}

export interface Opportunity {
  id: string;
  companyId: string;
  primaryContactId?: string;
  stage: OpportunityStage;
  value?: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: Date;
  sequenceId?: string;
  notes: OpportunityNote[];
  activities: Activity[];
  aiRecommendations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type OpportunityStage =
  | 'New Lead'
  | 'Researching'
  | 'Outreach Started'
  | 'Engaged'
  | 'Meeting Scheduled'
  | 'Demo Done'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost'
  | 'On Hold';

export interface OpportunityNote {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  outcome?: string;
  contactId?: string;
  timestamp: Date;
}

export type ActivityType =
  | 'Email Sent'
  | 'Email Received'
  | 'Call Made'
  | 'Call Received'
  | 'Meeting'
  | 'LinkedIn'
  | 'Note Added'
  | 'Stage Changed'
  | 'Task Completed';

// ============================================================================
// AI AGENTS
// ============================================================================

export interface AgentConfig {
  name: AgentType;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools?: AgentTool[];
}

export type AgentType =
  | 'ResearchAgent'
  | 'ScoringAgent'
  | 'PitchGenerator'
  | 'ContactFinder'
  | 'OutreachPlanner'
  | 'MasterOrchestrator';

export interface AgentTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface AgentExecution {
  id: string;
  agentType: AgentType;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'running' | 'completed' | 'failed';
  steps: AgentStep[];
  totalTokens: number;
  cost: number;
  duration: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface AgentStep {
  order: number;
  action: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  reasoning?: string;
  timestamp: Date;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface AnalyticsSummary {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    companiesResearched: number;
    contactsFound: number;
    pitchesGenerated: number;
    emailsSent: number;
    openRate: number;
    replyRate: number;
    meetingsBooked: number;
    opportunities: number;
    pipelineValue: number;
    conversionRate: number;
  };
  topPerformingPitches: GeneratedPitch[];
  topOpportunities: Opportunity[];
  aiInsights: string[];
}

export interface DashboardMetrics {
  totalCompanies: number;
  totalContacts: number;
  activeSequences: number;
  pipelineValue: number;
  averageAIScore: number;
  enrichmentSuccessRate: number;
  pitchEngagementRate: number;
  weekOverWeekGrowth: {
    companies: number;
    contacts: number;
    opportunities: number;
  };
  recentActivity: Activity[];
  urgentActions: UrgentAction[];
}

export interface UrgentAction {
  type: 'follow_up_due' | 'high_score_lead' | 'reply_received' | 'meeting_soon';
  entityType: 'company' | 'contact' | 'opportunity';
  entityId: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  dueAt?: Date;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// ELEVENLABS SPECIFIC
// ============================================================================

export interface ElevenLabsProductCatalog {
  products: ElevenLabsProductInfo[];
  lastUpdated: Date;
}

export interface ElevenLabsProductInfo {
  id: string;
  name: string;
  description: string;
  category: 'Text to Speech' | 'Voice Cloning' | 'Audio AI' | 'Conversational AI' | 'Dubbing';
  features: string[];
  useCases: string[];
  targetAudience: string[];
  pricingModel: string;
  competitiveAdvantage: string[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface SystemConfig {
  enrichment: {
    defaultProviders: EnrichmentProvider[];
    maxCostPerEnrichment: number;
    cacheExpirationDays: number;
    rateLimits: Record<EnrichmentProvider, number>;
  };
  ai: {
    defaultModel: string;
    maxTokensPerRequest: number;
    costBudgetDaily: number;
  };
  outreach: {
    defaultWaitDays: number;
    maxStepsPerSequence: number;
    workingHours: { start: number; end: number };
    timezone: string;
  };
}

// ============================================================================
// DATABASE SCHEMA HELPERS
// ============================================================================

export interface DatabaseCompany {
  id: string;
  name: string;
  domain: string;
  description: string | null;
  industry: string;
  sub_industry: string | null;
  size: CompanySize;
  employee_count: number | null;
  revenue: string | null;
  funding: string | null; // JSON
  tech_stack: string[];
  products: string | null; // JSON
  headquarters: string | null; // JSON
  founded_year: number | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  ai_score: string | null; // JSON
  enrichment_sources: string | null; // JSON
  last_enriched: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseContact {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  email_verified: boolean | null;
  email_verification_date: string | null;
  phone: string | null;
  linkedin_url: string | null;
  title: string;
  department: Department | null;
  seniority: Seniority;
  authority_score: number;
  decision_maker: boolean;
  influencer: boolean;
  enrichment_sources: string | null; // JSON
  persona: string | null; // JSON
  last_enriched: string | null;
  created_at: string;
  updated_at: string;
}

export type DatabasePitch = Omit<GeneratedPitch, 'personalization' | 'elevenlabsProducts' | 'useCases' | 'feedback' | 'hooks'> & {
  company_id: string;
  contact_id: string | null;
  hooks: string | null; // JSON
  personalization: string | null; // JSON
  elevenlabs_products: string | null; // JSON
  use_cases: string | null; // JSON
  generated_at: string;
  ai_model: string;
  prompt_version: string;
  feedback: string | null; // JSON
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
