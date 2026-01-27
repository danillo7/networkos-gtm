/**
 * NetworkOS - AI Contact Finder Agent
 * Discovers high-authority decision makers using multiple data sources
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  Contact,
  ContactPersona,
  EnrichmentSource,
  Department,
  Seniority,
} from '../lib/types';

const anthropic = new Anthropic();

// Contact finder configuration
const CONTACT_FINDER_CONFIG = {
  targetTitles: {
    highPriority: [
      'CEO', 'CTO', 'CIO', 'COO', 'CMO', 'CPO',
      'VP Engineering', 'VP Product', 'VP Marketing', 'VP Technology',
      'Head of Engineering', 'Head of Product', 'Head of AI',
      'Director of Engineering', 'Director of Product',
    ],
    mediumPriority: [
      'Engineering Manager', 'Product Manager', 'Technical Lead',
      'Senior Engineer', 'Principal Engineer', 'Staff Engineer',
      'Solutions Architect', 'Technical Director',
    ],
    lowPriority: [
      'Software Engineer', 'Developer', 'Data Scientist',
      'UX Designer', 'Content Creator',
    ],
  },
  departments: {
    primary: ['Engineering', 'Product', 'Technology', 'AI/ML'],
    secondary: ['Marketing', 'Content', 'Customer Experience'],
  },
};

// Types for contact finding
export interface ContactFinderInput {
  companyId: string;
  companyName: string;
  domain: string;
  industry?: string;
  targetRoles?: string[];
  maxContacts?: number;
}

export interface ContactFinderResult {
  success: boolean;
  contacts: DiscoveredContact[];
  sources: EnrichmentSource[];
  totalFound: number;
  tokensUsed: number;
  duration: number;
}

export interface DiscoveredContact {
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  emailConfidence?: number;
  phone?: string;
  linkedinUrl?: string;
  title: string;
  department?: Department;
  seniority: Seniority;
  authorityScore: number;
  decisionMaker: boolean;
  influencer: boolean;
  persona?: ContactPersona;
  source: string;
}

// Email pattern generation
const EMAIL_PATTERNS = [
  (first: string, last: string, domain: string) => `${first}.${last}@${domain}`,
  (first: string, last: string, domain: string) => `${first[0]}${last}@${domain}`,
  (first: string, last: string, domain: string) => `${first}${last[0]}@${domain}`,
  (first: string, last: string, domain: string) => `${first}@${domain}`,
  (first: string, last: string, domain: string) => `${first}_${last}@${domain}`,
  (first: string, last: string, domain: string) => `${first}${last}@${domain}`,
];

/**
 * Main contact finder function
 */
export async function findContacts(input: ContactFinderInput): Promise<ContactFinderResult> {
  const startTime = Date.now();
  const {
    companyId,
    companyName,
    domain,
    industry,
    targetRoles = CONTACT_FINDER_CONFIG.targetTitles.highPriority,
    maxContacts = 10,
  } = input;

  const contacts: DiscoveredContact[] = [];
  const sources: EnrichmentSource[] = [];
  let totalTokens = 0;

  // Try multiple sources in parallel
  const [hunterResults, apolloResults, aiGeneratedContacts] = await Promise.all([
    searchHunterIO(domain, targetRoles).catch(() => ({ contacts: [], source: null })),
    searchApollo(companyName, domain, targetRoles).catch(() => ({ contacts: [], source: null })),
    generateContactsWithAI(companyName, domain, industry, targetRoles),
  ]);

  // Add Hunter results
  if (hunterResults.contacts.length > 0) {
    contacts.push(...hunterResults.contacts);
    if (hunterResults.source) sources.push(hunterResults.source);
  }

  // Add Apollo results
  if (apolloResults.contacts.length > 0) {
    contacts.push(...apolloResults.contacts);
    if (apolloResults.source) sources.push(apolloResults.source);
  }

  // Add AI-generated contacts (with lower confidence)
  if (aiGeneratedContacts.contacts.length > 0) {
    contacts.push(...aiGeneratedContacts.contacts);
    sources.push(aiGeneratedContacts.source);
    totalTokens += aiGeneratedContacts.tokensUsed;
  }

  // Deduplicate contacts
  const uniqueContacts = deduplicateContacts(contacts);

  // Score and rank contacts
  const scoredContacts = scoreContacts(uniqueContacts);

  // Take top contacts up to limit
  const topContacts = scoredContacts.slice(0, maxContacts);

  // Generate personas for top contacts
  const contactsWithPersonas = await addPersonas(topContacts, industry);
  totalTokens += contactsWithPersonas.tokensUsed;

  return {
    success: true,
    contacts: contactsWithPersonas.contacts,
    sources,
    totalFound: uniqueContacts.length,
    tokensUsed: totalTokens,
    duration: Date.now() - startTime,
  };
}

/**
 * Search Hunter.io for contacts
 */
async function searchHunterIO(
  domain: string,
  targetRoles: string[]
): Promise<{ contacts: DiscoveredContact[]; source: EnrichmentSource | null }> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    return { contacts: [], source: null };
  }

  try {
    // Domain search endpoint
    const response = await fetch(
      `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apiKey}&limit=20`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`Hunter API error: ${response.status}`);
    }

    const data = await response.json();
    const emails = data.data?.emails || [];

    const contacts: DiscoveredContact[] = emails
      .filter((email: Record<string, unknown>) => {
        const title = (email.position as string) || '';
        return targetRoles.some((role) =>
          title.toLowerCase().includes(role.toLowerCase())
        );
      })
      .map((email: Record<string, unknown>) => ({
        firstName: email.first_name as string,
        lastName: email.last_name as string,
        fullName: `${email.first_name} ${email.last_name}`,
        email: email.value as string,
        emailConfidence: email.confidence as number,
        linkedinUrl: email.linkedin as string | undefined,
        title: email.position as string,
        department: inferDepartment(email.position as string),
        seniority: inferSeniority(email.position as string),
        authorityScore: 0, // Will be calculated later
        decisionMaker: isDecisionMaker(email.position as string),
        influencer: isInfluencer(email.position as string),
        source: 'Hunter.io',
      }));

    return {
      contacts,
      source: {
        provider: 'Hunter.io',
        dataPoints: contacts.map((c) => c.email || c.fullName),
        enrichedAt: new Date(),
        confidence: 0.85,
      },
    };
  } catch (error) {
    console.error('Hunter.io search failed:', error);
    return { contacts: [], source: null };
  }
}

/**
 * Search Apollo.io for contacts
 */
async function searchApollo(
  companyName: string,
  domain: string,
  targetRoles: string[]
): Promise<{ contacts: DiscoveredContact[]; source: EnrichmentSource | null }> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return { contacts: [], source: null };
  }

  try {
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        q_organization_domains: domain,
        page: 1,
        per_page: 20,
        person_titles: targetRoles,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apollo API error: ${response.status}`);
    }

    const data = await response.json();
    const people = data.people || [];

    const contacts: DiscoveredContact[] = people.map((person: Record<string, unknown>) => ({
      firstName: person.first_name as string,
      lastName: person.last_name as string,
      fullName: person.name as string,
      email: person.email as string | undefined,
      emailConfidence: person.email ? 90 : 0,
      phone: person.phone_number as string | undefined,
      linkedinUrl: person.linkedin_url as string | undefined,
      title: person.title as string,
      department: inferDepartment(person.title as string),
      seniority: inferSeniority(person.title as string),
      authorityScore: 0,
      decisionMaker: isDecisionMaker(person.title as string),
      influencer: isInfluencer(person.title as string),
      source: 'Apollo.io',
    }));

    return {
      contacts,
      source: {
        provider: 'Apollo.io',
        dataPoints: contacts.map((c) => c.fullName),
        enrichedAt: new Date(),
        confidence: 0.9,
      },
    };
  } catch (error) {
    console.error('Apollo.io search failed:', error);
    return { contacts: [], source: null };
  }
}

/**
 * Generate potential contacts using AI when APIs fail
 */
async function generateContactsWithAI(
  companyName: string,
  domain: string,
  industry?: string,
  targetRoles: string[] = []
): Promise<{
  contacts: DiscoveredContact[];
  source: EnrichmentSource;
  tokensUsed: number;
}> {
  const prompt = `For the company ${companyName} (${domain}) in ${industry || 'technology'} industry, suggest likely decision makers for voice AI solutions.

Target roles: ${targetRoles.slice(0, 5).join(', ')}

Generate a JSON array of 5 likely contacts with:
- firstName, lastName, fullName
- title: realistic job title
- department: one of Engineering, Product, Marketing, Sales, Customer Success, Operations, Finance, HR, Legal, Executive, IT, Other
- seniority: one of C-Level, VP, Director, Manager, Senior, Mid-Level
- linkedinUrl: null (we'll find real URLs later)
- decisionMaker: boolean
- influencer: boolean

Base your suggestions on:
1. Typical org structures for ${industry || 'tech'} companies
2. Who would champion voice AI solutions
3. Common titles at companies of similar size

Return only valid JSON array.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const suggestions = JSON.parse(text);
    const contacts: DiscoveredContact[] = suggestions.map((s: Record<string, unknown>) => ({
      ...s,
      email: generateProbableEmail(s.firstName as string, s.lastName as string, domain),
      emailConfidence: 30, // Low confidence for AI-generated
      authorityScore: 0,
      source: 'AI Research',
    }));

    return {
      contacts,
      source: {
        provider: 'AI Research',
        dataPoints: contacts.map((c) => c.fullName),
        enrichedAt: new Date(),
        confidence: 0.5,
      },
      tokensUsed,
    };
  } catch {
    return {
      contacts: [],
      source: {
        provider: 'AI Research',
        dataPoints: [],
        enrichedAt: new Date(),
        confidence: 0,
      },
      tokensUsed,
    };
  }
}

/**
 * Generate probable email address
 */
function generateProbableEmail(firstName: string, lastName: string, domain: string): string {
  const first = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const last = lastName.toLowerCase().replace(/[^a-z]/g, '');
  // Most common pattern
  return `${first}.${last}@${domain}`;
}

/**
 * Infer department from job title
 */
function inferDepartment(title: string): Department {
  const t = title.toLowerCase();

  if (/engineer|developer|architect|devops|sre|platform/i.test(t)) return 'Engineering';
  if (/product|pm\b/i.test(t)) return 'Product';
  if (/marketing|growth|brand|content/i.test(t)) return 'Marketing';
  if (/sales|account|business dev/i.test(t)) return 'Sales';
  if (/customer|success|support/i.test(t)) return 'Customer Success';
  if (/operations|ops\b/i.test(t)) return 'Operations';
  if (/finance|cfo|accounting/i.test(t)) return 'Finance';
  if (/hr|people|talent|recruiting/i.test(t)) return 'HR';
  if (/legal|counsel|compliance/i.test(t)) return 'Legal';
  if (/ceo|coo|founder|president/i.test(t)) return 'Executive';
  if (/it\b|infrastructure|security/i.test(t)) return 'IT';

  return 'Other';
}

/**
 * Infer seniority from job title
 */
function inferSeniority(title: string): Seniority {
  const t = title.toLowerCase();

  if (/^c[eotiof]{2,3}$|chief|founder|co-founder|president/i.test(t)) return 'C-Level';
  if (/^vp|vice president|evp|svp/i.test(t)) return 'VP';
  if (/director|head of/i.test(t)) return 'Director';
  if (/manager|lead|team lead/i.test(t)) return 'Manager';
  if (/senior|sr\.|principal|staff/i.test(t)) return 'Senior';
  if (/junior|jr\.|entry|associate/i.test(t)) return 'Junior';
  if (/intern/i.test(t)) return 'Intern';

  return 'Mid-Level';
}

/**
 * Check if title indicates decision maker
 */
function isDecisionMaker(title: string): boolean {
  const t = title.toLowerCase();
  return /ceo|cto|cio|coo|cpo|cmo|vp|vice president|director|head of|founder/i.test(t);
}

/**
 * Check if title indicates influencer
 */
function isInfluencer(title: string): boolean {
  const t = title.toLowerCase();
  return /manager|lead|principal|staff|architect|senior/i.test(t);
}

/**
 * Deduplicate contacts by email or name
 */
function deduplicateContacts(contacts: DiscoveredContact[]): DiscoveredContact[] {
  const seen = new Set<string>();
  const unique: DiscoveredContact[] = [];

  for (const contact of contacts) {
    const key = contact.email?.toLowerCase() || contact.fullName.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(contact);
    }
  }

  return unique;
}

/**
 * Score and rank contacts
 */
function scoreContacts(contacts: DiscoveredContact[]): DiscoveredContact[] {
  return contacts
    .map((contact) => {
      let score = 50;

      // Seniority scoring
      const seniorityScores: Record<Seniority, number> = {
        'C-Level': 40,
        'VP': 35,
        'Director': 30,
        'Manager': 20,
        'Senior': 15,
        'Mid-Level': 10,
        'Junior': 5,
        'Intern': 0,
      };
      score += seniorityScores[contact.seniority] || 0;

      // Decision maker bonus
      if (contact.decisionMaker) score += 15;

      // Email confidence bonus
      if (contact.emailConfidence && contact.emailConfidence > 80) score += 10;

      // LinkedIn presence bonus
      if (contact.linkedinUrl) score += 5;

      // Department relevance
      if (['Engineering', 'Product', 'Executive'].includes(contact.department || '')) {
        score += 10;
      }

      return {
        ...contact,
        authorityScore: Math.min(100, Math.max(0, score)),
      };
    })
    .sort((a, b) => b.authorityScore - a.authorityScore);
}

/**
 * Add AI-generated personas to contacts
 */
async function addPersonas(
  contacts: DiscoveredContact[],
  industry?: string
): Promise<{ contacts: DiscoveredContact[]; tokensUsed: number }> {
  if (contacts.length === 0) {
    return { contacts, tokensUsed: 0 };
  }

  const prompt = `For each contact, generate a brief persona for selling voice AI solutions:

Contacts:
${contacts.map((c, i) => `${i + 1}. ${c.fullName} - ${c.title}`).join('\n')}

Industry: ${industry || 'Technology'}

Return a JSON array with objects containing:
- index: number (0-based)
- persona: {
    type: one of "Technical Decision Maker", "Business Decision Maker", "End User Champion", "Budget Holder", "Influencer", "Gatekeeper"
    painPoints: array of 2-3 likely pain points
    motivations: array of 2-3 key motivations
    communicationStyle: one of "Direct & Concise", "Data-Driven", "Relationship-Focused", "Visionary", "Detail-Oriented"
    bestApproach: one sentence on how to approach them
  }

Return only valid JSON array.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const personas = JSON.parse(text);
    const updatedContacts = contacts.map((contact, index) => {
      const personaData = personas.find((p: { index: number }) => p.index === index);
      return {
        ...contact,
        persona: personaData?.persona as ContactPersona | undefined,
      };
    });

    return { contacts: updatedContacts, tokensUsed };
  } catch {
    return { contacts, tokensUsed };
  }
}

/**
 * Verify email address using Hunter.io
 */
export async function verifyEmail(email: string): Promise<{
  valid: boolean;
  confidence: number;
  source: string;
}> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    return { valid: false, confidence: 0, source: 'unavailable' };
  }

  try {
    const response = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.data;

    return {
      valid: result.result === 'deliverable',
      confidence: result.score || 0,
      source: 'Hunter.io',
    };
  } catch {
    return { valid: false, confidence: 0, source: 'error' };
  }
}

/**
 * Find email for a specific person
 */
export async function findEmail(
  firstName: string,
  lastName: string,
  domain: string
): Promise<{
  email: string | null;
  confidence: number;
  source: string;
}> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    // Generate probable email
    return {
      email: generateProbableEmail(firstName, lastName, domain),
      confidence: 30,
      source: 'generated',
    };
  }

  try {
    const response = await fetch(
      `https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${firstName}&last_name=${lastName}&api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Email finder failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.data;

    return {
      email: result.email,
      confidence: result.score || 0,
      source: 'Hunter.io',
    };
  } catch {
    return {
      email: generateProbableEmail(firstName, lastName, domain),
      confidence: 30,
      source: 'generated',
    };
  }
}

export default {
  findContacts,
  verifyEmail,
  findEmail,
  CONTACT_FINDER_CONFIG,
};
