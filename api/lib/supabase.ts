/**
 * NetworkOS - Supabase Client Configuration
 * Provides typed database access and helper functions
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Company,
  Contact,
  GeneratedPitch,
  OutreachSequence,
  Opportunity,
  EnrichmentLog,
  DatabaseCompany,
  DatabaseContact,
  DatabasePitch,
  Paginated,
} from './types';

// Environment validation - graceful handling for demo mode
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Flag to check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create clients only if configured
let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  supabaseAdminClient = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabaseClient;
}

// Public client (for client-side usage with RLS)
export const supabase = supabaseClient;

// Service client (for server-side usage, bypasses RLS)
export const supabaseAdmin = supabaseAdminClient || supabaseClient;

// ============================================================================
// TYPE CONVERTERS
// ============================================================================

export function dbToCompany(db: DatabaseCompany): Company {
  return {
    id: db.id,
    name: db.name,
    domain: db.domain,
    description: db.description || undefined,
    industry: db.industry,
    subIndustry: db.sub_industry || undefined,
    size: db.size,
    employeeCount: db.employee_count || undefined,
    revenue: db.revenue || undefined,
    funding: db.funding ? JSON.parse(db.funding) : undefined,
    techStack: db.tech_stack || [],
    products: db.products ? JSON.parse(db.products) : [],
    headquarters: db.headquarters ? JSON.parse(db.headquarters) : undefined,
    foundedYear: db.founded_year || undefined,
    linkedinUrl: db.linkedin_url || undefined,
    twitterHandle: db.twitter_handle || undefined,
    aiScore: db.ai_score ? JSON.parse(db.ai_score) : undefined,
    enrichmentSources: db.enrichment_sources ? JSON.parse(db.enrichment_sources) : [],
    lastEnriched: db.last_enriched ? new Date(db.last_enriched) : undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

export function companyToDb(company: Partial<Company>): Partial<DatabaseCompany> {
  const result: Record<string, unknown> = {};

  if (company.id !== undefined) result.id = company.id;
  if (company.name !== undefined) result.name = company.name;
  if (company.domain !== undefined) result.domain = company.domain;
  if (company.description !== undefined) result.description = company.description;
  if (company.industry !== undefined) result.industry = company.industry;
  if (company.subIndustry !== undefined) result.sub_industry = company.subIndustry;
  if (company.size !== undefined) result.size = company.size;
  if (company.employeeCount !== undefined) result.employee_count = company.employeeCount;
  if (company.revenue !== undefined) result.revenue = company.revenue;
  if (company.funding !== undefined) result.funding = JSON.stringify(company.funding);
  if (company.techStack !== undefined) result.tech_stack = company.techStack;
  if (company.products !== undefined) result.products = JSON.stringify(company.products);
  if (company.headquarters !== undefined) result.headquarters = JSON.stringify(company.headquarters);
  if (company.foundedYear !== undefined) result.founded_year = company.foundedYear;
  if (company.linkedinUrl !== undefined) result.linkedin_url = company.linkedinUrl;
  if (company.twitterHandle !== undefined) result.twitter_handle = company.twitterHandle;
  if (company.aiScore !== undefined) result.ai_score = JSON.stringify(company.aiScore);
  if (company.enrichmentSources !== undefined) result.enrichment_sources = JSON.stringify(company.enrichmentSources);
  if (company.lastEnriched !== undefined) result.last_enriched = company.lastEnriched.toISOString();

  return result as Partial<DatabaseCompany>;
}

export function dbToContact(db: DatabaseContact): Contact {
  return {
    id: db.id,
    companyId: db.company_id,
    firstName: db.first_name,
    lastName: db.last_name,
    fullName: db.full_name,
    email: db.email || undefined,
    emailVerified: db.email_verified || undefined,
    emailVerificationDate: db.email_verification_date ? new Date(db.email_verification_date) : undefined,
    phone: db.phone || undefined,
    linkedinUrl: db.linkedin_url || undefined,
    title: db.title,
    department: db.department || undefined,
    seniority: db.seniority,
    authorityScore: db.authority_score,
    decisionMaker: db.decision_maker,
    influencer: db.influencer,
    persona: db.persona ? JSON.parse(db.persona) : undefined,
    enrichmentSources: db.enrichment_sources ? JSON.parse(db.enrichment_sources) : [],
    lastEnriched: db.last_enriched ? new Date(db.last_enriched) : undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

export function contactToDb(contact: Partial<Contact>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (contact.id !== undefined) result.id = contact.id;
  if (contact.companyId !== undefined) result.company_id = contact.companyId;
  if (contact.firstName !== undefined) result.first_name = contact.firstName;
  if (contact.lastName !== undefined) result.last_name = contact.lastName;
  if (contact.fullName !== undefined) result.full_name = contact.fullName;
  if (contact.email !== undefined) result.email = contact.email;
  if (contact.emailVerified !== undefined) result.email_verified = contact.emailVerified;
  if (contact.emailVerificationDate !== undefined) result.email_verification_date = contact.emailVerificationDate?.toISOString();
  if (contact.phone !== undefined) result.phone = contact.phone;
  if (contact.linkedinUrl !== undefined) result.linkedin_url = contact.linkedinUrl;
  if (contact.title !== undefined) result.title = contact.title;
  if (contact.department !== undefined) result.department = contact.department;
  if (contact.seniority !== undefined) result.seniority = contact.seniority;
  if (contact.authorityScore !== undefined) result.authority_score = contact.authorityScore;
  if (contact.decisionMaker !== undefined) result.decision_maker = contact.decisionMaker;
  if (contact.influencer !== undefined) result.influencer = contact.influencer;
  if (contact.persona !== undefined) result.persona = JSON.stringify(contact.persona);
  if (contact.enrichmentSources !== undefined) result.enrichment_sources = JSON.stringify(contact.enrichmentSources);
  if (contact.lastEnriched !== undefined) result.last_enriched = contact.lastEnriched?.toISOString();

  return result;
}

// ============================================================================
// COMPANY OPERATIONS
// ============================================================================

export async function getCompany(id: string): Promise<Company | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return dbToCompany(data as unknown as DatabaseCompany);
}

export async function getCompanyByDomain(domain: string): Promise<Company | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('domain', domain)
    .single();

  if (error || !data) return null;
  return dbToCompany(data as unknown as DatabaseCompany);
}

export async function createCompany(company: Partial<Company>): Promise<Company> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const dbData = companyToDb(company);
  const { data, error } = await supabaseAdmin
    .from('companies')
    .insert(dbData)
    .select()
    .single();

  if (error) throw new Error(`Failed to create company: ${error.message}`);
  return dbToCompany(data as unknown as DatabaseCompany);
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const dbData = companyToDb(updates);
  const { data, error } = await supabaseAdmin
    .from('companies')
    .update({ ...dbData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update company: ${error.message}`);
  return dbToCompany(data as unknown as DatabaseCompany);
}

export async function listCompanies(options: {
  page?: number;
  limit?: number;
  industry?: string;
  minScore?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}): Promise<Paginated<Company>> {
  const { page = 1, limit = 20, industry, minScore, orderBy = 'created_at', orderDir = 'desc' } = options;
  const offset = (page - 1) * limit;

  if (!supabaseAdmin) {
    return { items: [], page, limit, total: 0, hasMore: false };
  }

  let query = supabaseAdmin.from('companies').select('*', { count: 'exact' });

  if (industry) query = query.eq('industry', industry);
  if (minScore) query = query.gte('ai_score->overall', minScore);

  const { data, error, count } = await query
    .order(orderBy, { ascending: orderDir === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`Failed to list companies: ${error.message}`);

  return {
    items: (data || []).map((d) => dbToCompany(d as unknown as DatabaseCompany)),
    page,
    limit,
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
}

// ============================================================================
// CONTACT OPERATIONS
// ============================================================================

export async function getContact(id: string): Promise<Contact | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return dbToContact(data as unknown as DatabaseContact);
}

export async function getContactsByCompany(companyId: string): Promise<Contact[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .select('*')
    .eq('company_id', companyId)
    .order('authority_score', { ascending: false });

  if (error) throw new Error(`Failed to get contacts: ${error.message}`);
  return (data || []).map((d) => dbToContact(d as unknown as DatabaseContact));
}

export async function createContact(contact: Partial<Contact>): Promise<Contact> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const dbData = contactToDb(contact);
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .insert(dbData)
    .select()
    .single();

  if (error) throw new Error(`Failed to create contact: ${error.message}`);
  return dbToContact(data as unknown as DatabaseContact);
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const dbData = contactToDb(updates);
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .update({ ...dbData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update contact: ${error.message}`);
  return dbToContact(data as unknown as DatabaseContact);
}

export async function findContactByEmail(email: string): Promise<Contact | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) return null;
  return dbToContact(data as unknown as DatabaseContact);
}

// ============================================================================
// PITCH OPERATIONS
// ============================================================================

export async function createPitch(pitch: Partial<GeneratedPitch>): Promise<GeneratedPitch> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const dbData = {
    company_id: pitch.companyId,
    contact_id: pitch.contactId || null,
    type: pitch.type,
    subject: pitch.subject || null,
    body: pitch.body,
    hooks: JSON.stringify(pitch.hooks || []),
    personalization: JSON.stringify(pitch.personalization || []),
    elevenlabs_products: JSON.stringify(pitch.elevenlabsProducts || []),
    use_cases: JSON.stringify(pitch.useCases || []),
    tone: pitch.tone,
    length: pitch.length,
    variant: pitch.variant || null,
    ai_model: pitch.aiModel,
    prompt_version: pitch.promptVersion,
    generated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('pitches')
    .insert(dbData)
    .select()
    .single();

  if (error) throw new Error(`Failed to create pitch: ${error.message}`);
  return data as unknown as GeneratedPitch;
}

export async function getPitchesByCompany(companyId: string): Promise<GeneratedPitch[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from('pitches')
    .select('*')
    .eq('company_id', companyId)
    .order('generated_at', { ascending: false });

  if (error) throw new Error(`Failed to get pitches: ${error.message}`);
  return data || [];
}

// ============================================================================
// ENRICHMENT LOG OPERATIONS
// ============================================================================

export async function logEnrichment(log: Omit<EnrichmentLog, 'id' | 'createdAt'>): Promise<EnrichmentLog> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin
    .from('enrichment_logs')
    .insert({
      entity_type: log.entityType,
      entity_id: log.entityId,
      provider: log.provider,
      status: log.status,
      data_points_found: log.dataPointsFound,
      cost: log.cost || null,
      duration: log.duration,
      error: log.error || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to log enrichment: ${error.message}`);
  return data as unknown as EnrichmentLog;
}

// ============================================================================
// OPPORTUNITY OPERATIONS
// ============================================================================

export async function createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin
    .from('opportunities')
    .insert({
      company_id: opportunity.companyId,
      primary_contact_id: opportunity.primaryContactId || null,
      stage: opportunity.stage || 'New Lead',
      value: opportunity.value || null,
      currency: opportunity.currency || 'USD',
      probability: opportunity.probability || null,
      expected_close_date: opportunity.expectedCloseDate?.toISOString() || null,
      sequence_id: opportunity.sequenceId || null,
      notes: JSON.stringify(opportunity.notes || []),
      activities: JSON.stringify(opportunity.activities || []),
      ai_recommendations: opportunity.aiRecommendations || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create opportunity: ${error.message}`);
  return data as unknown as Opportunity;
}

export async function updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const dbData: Record<string, unknown> = {};

  if (updates.stage !== undefined) dbData.stage = updates.stage;
  if (updates.value !== undefined) dbData.value = updates.value;
  if (updates.probability !== undefined) dbData.probability = updates.probability;
  if (updates.expectedCloseDate !== undefined) dbData.expected_close_date = updates.expectedCloseDate?.toISOString();
  if (updates.notes !== undefined) dbData.notes = JSON.stringify(updates.notes);
  if (updates.activities !== undefined) dbData.activities = JSON.stringify(updates.activities);
  if (updates.aiRecommendations !== undefined) dbData.ai_recommendations = updates.aiRecommendations;

  dbData.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('opportunities')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update opportunity: ${error.message}`);
  return data as unknown as Opportunity;
}

export async function listOpportunities(options: {
  stage?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<Opportunity>> {
  const { stage, page = 1, limit = 50 } = options;
  const offset = (page - 1) * limit;

  if (!supabaseAdmin) {
    return { items: [], page, limit, total: 0, hasMore: false };
  }

  let query = supabaseAdmin.from('opportunities').select('*', { count: 'exact' });
  if (stage) query = query.eq('stage', stage);

  const { data, error, count } = await query
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`Failed to list opportunities: ${error.message}`);

  return {
    items: data || [],
    page,
    limit,
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
}

// ============================================================================
// OUTREACH SEQUENCE OPERATIONS
// ============================================================================

export async function createSequence(sequence: Partial<OutreachSequence>): Promise<OutreachSequence> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin
    .from('outreach_sequences')
    .insert({
      name: sequence.name,
      company_id: sequence.companyId,
      contact_ids: sequence.contactIds || [],
      status: sequence.status || 'draft',
      steps: JSON.stringify(sequence.steps || []),
      start_date: sequence.startDate?.toISOString() || null,
      metrics: JSON.stringify(sequence.metrics || {}),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create sequence: ${error.message}`);
  return data as unknown as OutreachSequence;
}

export async function updateSequenceStatus(
  id: string,
  status: OutreachSequence['status']
): Promise<OutreachSequence> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin
    .from('outreach_sequences')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update sequence: ${error.message}`);
  return data as unknown as OutreachSequence;
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

export async function getAnalyticsCounts(): Promise<{
  companies: number;
  contacts: number;
  pitches: number;
  opportunities: number;
}> {
  // Return mock data if Supabase is not configured
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return {
      companies: 127,
      contacts: 342,
      pitches: 89,
      opportunities: 45,
    };
  }

  const [companies, contacts, pitches, opportunities] = await Promise.all([
    supabaseAdmin.from('companies').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('pitches').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }),
  ]);

  return {
    companies: companies.count || 0,
    contacts: contacts.count || 0,
    pitches: pitches.count || 0,
    opportunities: opportunities.count || 0,
  };
}

export async function getRecentActivity(limit: number = 20): Promise<unknown[]> {
  // Return mock data if Supabase is not configured
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return [
      { entity_id: '1', activity_type: 'company_created', description: 'Added TechCorp to research pipeline', entity_type: 'company', created_at: new Date().toISOString() },
      { entity_id: '2', activity_type: 'pitch_generated', description: 'Generated pitch for DataFlow', entity_type: 'pitch', created_at: new Date(Date.now() - 3600000).toISOString() },
      { entity_id: '3', activity_type: 'email_sent', description: 'Outreach email sent to AIStart', entity_type: 'contact', created_at: new Date(Date.now() - 7200000).toISOString() },
    ].slice(0, limit);
  }

  const { data, error } = await supabaseAdmin
    .from('activity_feed')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}
