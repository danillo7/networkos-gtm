/**
 * NetworkOS - AI Pitch Generator
 * Creates personalized, high-converting pitches using Claude
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  Company,
  Contact,
  GeneratedPitch,
  PitchType,
  PitchTone,
  PersonalizationElement,
  ElevenLabsProduct,
  UseCase,
} from '../lib/types';

const anthropic = new Anthropic();

// ElevenLabs product catalog for pitch matching
const ELEVENLABS_PRODUCTS: ElevenLabsProduct[] = [
  {
    name: 'Text to Speech API',
    relevance: 0,
    useCases: [
      'Audiobook production',
      'Video voiceovers',
      'Podcast creation',
      'E-learning content',
      'IVR systems',
      'Accessibility solutions',
    ],
    valueProposition: 'Industry-leading AI voice synthesis with natural, expressive speech in 29+ languages',
  },
  {
    name: 'Voice Cloning',
    relevance: 0,
    useCases: [
      'Personal voice preservation',
      'Brand voice creation',
      'Character voices for games',
      'Dubbing workflows',
      'Personalized content',
    ],
    valueProposition: 'Create custom AI voices that sound exactly like the original with instant or professional cloning',
  },
  {
    name: 'Conversational AI',
    relevance: 0,
    useCases: [
      'AI assistants',
      'Customer service bots',
      'Interactive NPCs',
      'Voice interfaces',
      'Tutoring systems',
      'Phone agents',
    ],
    valueProposition: 'Real-time voice AI with ultra-low latency (<500ms) for natural, interactive conversations',
  },
  {
    name: 'AI Dubbing',
    relevance: 0,
    useCases: [
      'Movie/TV localization',
      'Corporate video translation',
      'YouTube content localization',
      'E-learning localization',
      'Marketing video adaptation',
    ],
    valueProposition: 'Automatic video dubbing that preserves original voice characteristics across 29 languages',
  },
  {
    name: 'Sound Effects Generation',
    relevance: 0,
    useCases: [
      'Game audio',
      'Film production',
      'Podcast enhancement',
      'Video content',
      'Ad production',
    ],
    valueProposition: 'AI-generated sound effects from text descriptions - realistic, customizable, royalty-free',
  },
];

// Pitch templates by type
const PITCH_TEMPLATES = {
  email: {
    structures: {
      problemAgitate: `Subject: {hook}

Hi {firstName},

{opening_personalization}

{problem_statement}

{agitate_problem}

{solution_intro}

{value_proposition}

{call_to_action}

Best,
{senderName}`,

      socialProof: `Subject: {hook}

Hi {firstName},

{opening_personalization}

{social_proof_statement}

{relevance_to_them}

{value_proposition}

{call_to_action}

Best,
{senderName}`,

      directValue: `Subject: {hook}

Hi {firstName},

{opening_personalization}

{direct_value_statement}

{specific_use_case}

{call_to_action}

Best,
{senderName}`,
    },
  },
  linkedin: {
    structures: {
      connection: `Hi {firstName},

{brief_personalization}

{value_hook}

{soft_cta}`,

      message: `Hi {firstName},

{personalized_opening}

{value_proposition}

{specific_benefit}

{question_cta}`,
    },
  },
  call_script: {
    structure: `OPENING:
"Hi {firstName}, this is {senderName} from ElevenLabs. {opening_hook}"

PERMISSION:
"Do you have 2 minutes? I promise I'll be brief."

VALUE STATEMENT:
"{value_proposition}"

RELEVANCE:
"{specific_relevance}"

QUALIFYING QUESTIONS:
{qualifying_questions}

NEXT STEPS:
"{close_cta}"

OBJECTION HANDLING:
{objection_responses}`,
  },
};

// Types for pitch generation
export interface PitchGeneratorInput {
  company: Company;
  contact?: Contact;
  type: PitchType;
  tone?: PitchTone;
  length?: 'short' | 'medium' | 'long';
  focusProducts?: string[];
  customHooks?: string[];
  senderName?: string;
  senderTitle?: string;
}

export interface PitchGeneratorResult {
  pitch: GeneratedPitch;
  variants?: GeneratedPitch[];
  tokensUsed: number;
  duration: number;
}

/**
 * Main pitch generation function
 */
export async function generatePitch(input: PitchGeneratorInput): Promise<PitchGeneratorResult> {
  const startTime = Date.now();
  const {
    company,
    contact,
    type,
    tone = 'Professional',
    length = 'medium',
    focusProducts,
    customHooks,
    senderName = 'Your Name',
    senderTitle = 'Account Executive',
  } = input;

  // Match relevant ElevenLabs products
  const matchedProducts = matchProducts(company, focusProducts);

  // Generate use cases based on company
  const useCases = generateUseCases(company, matchedProducts);

  // Build personalization elements
  const personalization = buildPersonalization(company, contact);

  // Generate hooks
  const hooks = customHooks || await generateHooks(company, contact, matchedProducts);

  // Generate the main pitch using AI
  const aiPitch = await generatePitchWithAI({
    company,
    contact,
    type,
    tone,
    length,
    products: matchedProducts,
    useCases,
    personalization,
    hooks,
    senderName,
    senderTitle,
  });

  const pitch: GeneratedPitch = {
    id: crypto.randomUUID(),
    companyId: company.id,
    contactId: contact?.id,
    type,
    subject: aiPitch.subject,
    body: aiPitch.body,
    hooks,
    personalization,
    elevenlabsProducts: matchedProducts,
    useCases,
    tone,
    length,
    generatedAt: new Date(),
    aiModel: 'claude-sonnet-4-20250514',
    promptVersion: '1.0.0',
  };

  return {
    pitch,
    tokensUsed: aiPitch.tokensUsed,
    duration: Date.now() - startTime,
  };
}

/**
 * Match ElevenLabs products to company profile
 */
function matchProducts(company: Company, focusProducts?: string[]): ElevenLabsProduct[] {
  const products = ELEVENLABS_PRODUCTS.map((product) => {
    let relevance = 30; // Base relevance

    // Industry matching
    const industryRelevance: Record<string, string[]> = {
      'Text to Speech API': ['Publishing', 'E-Learning', 'Media', 'Healthcare', 'Accessibility'],
      'Voice Cloning': ['Media', 'Gaming', 'Entertainment', 'Marketing'],
      'Conversational AI': ['Customer Service', 'Technology', 'Finance', 'Healthcare', 'Retail'],
      'AI Dubbing': ['Media', 'Entertainment', 'E-Learning', 'Marketing'],
      'Sound Effects Generation': ['Gaming', 'Media', 'Entertainment', 'Advertising'],
    };

    const relevantIndustries = industryRelevance[product.name] || [];
    if (relevantIndustries.some((ind) => company.industry?.includes(ind))) {
      relevance += 30;
    }

    // Product/service matching
    const productKeywords: Record<string, string[]> = {
      'Text to Speech API': ['content', 'audio', 'book', 'learning', 'video', 'podcast', 'accessibility'],
      'Voice Cloning': ['brand', 'character', 'game', 'personalized', 'avatar'],
      'Conversational AI': ['chatbot', 'assistant', 'support', 'customer', 'agent', 'call center', 'ivr'],
      'AI Dubbing': ['video', 'international', 'global', 'localization', 'translation'],
      'Sound Effects Generation': ['game', 'audio', 'production', 'video', 'creative'],
    };

    const keywords = productKeywords[product.name] || [];
    const companyText = `${company.description} ${company.products?.map((p) => `${p.name} ${p.description}`).join(' ')}`.toLowerCase();

    const matchCount = keywords.filter((kw) => companyText.includes(kw)).length;
    relevance += matchCount * 10;

    // Focus products boost
    if (focusProducts?.includes(product.name)) {
      relevance += 20;
    }

    return { ...product, relevance: Math.min(100, relevance) };
  });

  // Return top 3 most relevant
  return products
    .filter((p) => p.relevance > 40)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
}

/**
 * Generate use cases for the company
 */
function generateUseCases(company: Company, products: ElevenLabsProduct[]): UseCase[] {
  const useCases: UseCase[] = [];

  for (const product of products) {
    // Find overlapping use cases with company products
    for (const companyProduct of company.products || []) {
      const productText = `${companyProduct.name} ${companyProduct.description}`.toLowerCase();

      for (const useCase of product.useCases) {
        if (productText.includes(useCase.toLowerCase().split(' ')[0])) {
          useCases.push({
            title: `${product.name} for ${companyProduct.name}`,
            description: `Enhance ${companyProduct.name} with ${product.name} to ${useCase.toLowerCase()}`,
            benefits: [
              'Reduce production time by 80%',
              'Scale content creation',
              'Maintain quality at scale',
            ],
            roi: 'Typical 10x ROI within first year',
          });
          break;
        }
      }
    }
  }

  // Add generic use cases if none found
  if (useCases.length === 0 && products.length > 0) {
    useCases.push({
      title: `${products[0].name} Integration`,
      description: `Leverage ${products[0].name} to enhance your ${company.industry} operations`,
      benefits: ['Automate voice content creation', 'Scale without quality loss', 'Reduce costs'],
      roi: 'Significant cost and time savings',
    });
  }

  return useCases.slice(0, 3);
}

/**
 * Build personalization elements
 */
function buildPersonalization(company: Company, contact?: Contact): PersonalizationElement[] {
  const elements: PersonalizationElement[] = [];

  // Company-specific personalization
  if (company.funding?.lastRound) {
    elements.push({
      type: 'timing_based',
      content: `Recent ${company.funding.lastRound} funding`,
      source: 'company_funding',
    });
  }

  if (company.products && company.products.length > 0) {
    elements.push({
      type: 'company_specific',
      content: `${company.products[0].name} - ${company.products[0].description}`,
      source: 'company_products',
    });
  }

  if (company.techStack && company.techStack.length > 0) {
    elements.push({
      type: 'company_specific',
      content: `Tech stack includes ${company.techStack.slice(0, 3).join(', ')}`,
      source: 'company_tech',
    });
  }

  // Contact-specific personalization
  if (contact) {
    elements.push({
      type: 'role_specific',
      content: `As ${contact.title}, you likely ${getRoleContext(contact.title)}`,
      source: 'contact_role',
    });

    if (contact.persona?.painPoints) {
      elements.push({
        type: 'pain_point',
        content: contact.persona.painPoints[0],
        source: 'contact_persona',
      });
    }
  }

  // Industry-specific
  elements.push({
    type: 'industry_specific',
    content: `${company.industry} companies are rapidly adopting voice AI`,
    source: 'industry_trend',
  });

  return elements;
}

/**
 * Get context based on role
 */
function getRoleContext(title: string): string {
  const t = title.toLowerCase();

  if (/cto|cio|vp.*engineering|head.*tech/i.test(t)) {
    return 'evaluate new technologies for scalability and integration';
  }
  if (/ceo|founder|president/i.test(t)) {
    return 'look for innovations that drive competitive advantage';
  }
  if (/product|cpo/i.test(t)) {
    return 'seek features that enhance user experience';
  }
  if (/marketing|cmo/i.test(t)) {
    return 'need scalable content solutions';
  }
  if (/customer|support/i.test(t)) {
    return 'want to improve response times and satisfaction';
  }

  return 'focus on solutions that drive results';
}

/**
 * Generate attention-grabbing hooks
 */
async function generateHooks(
  company: Company,
  contact: Contact | undefined,
  products: ElevenLabsProduct[]
): Promise<string[]> {
  const prompt = `Generate 3 compelling email subject line hooks for outreach to:

Company: ${company.name}
Industry: ${company.industry}
${contact ? `Contact: ${contact.fullName} (${contact.title})` : ''}
Products to pitch: ${products.map((p) => p.name).join(', ')}

The hooks should be:
1. Short (under 50 characters)
2. Personalized when possible
3. Create curiosity without being clickbait
4. Relevant to their business

Return a JSON array of 3 strings.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';

  try {
    return JSON.parse(text);
  } catch {
    return [
      `Voice AI for ${company.name}`,
      `Quick question about ${company.industry}`,
      'Scaling content creation?',
    ];
  }
}

/**
 * Generate pitch content using AI
 */
async function generatePitchWithAI(params: {
  company: Company;
  contact?: Contact;
  type: PitchType;
  tone: PitchTone;
  length: 'short' | 'medium' | 'long';
  products: ElevenLabsProduct[];
  useCases: UseCase[];
  personalization: PersonalizationElement[];
  hooks: string[];
  senderName: string;
  senderTitle: string;
}): Promise<{ subject?: string; body: string; tokensUsed: number }> {
  const {
    company,
    contact,
    type,
    tone,
    length,
    products,
    useCases,
    personalization,
    hooks,
    senderName,
  } = params;

  const lengthGuide = {
    short: '50-100 words',
    medium: '100-200 words',
    long: '200-350 words',
  };

  const toneGuide = {
    Professional: 'formal but approachable, using industry terminology appropriately',
    Friendly: 'warm and conversational, like reaching out to a peer',
    Technical: 'detailed and specific, assuming technical knowledge',
    Executive: 'concise and strategic, focusing on business outcomes',
    Casual: 'relaxed and personal, like messaging a friend',
    Urgent: 'time-sensitive language, emphasizing immediate opportunity',
  };

  const prompt = `Generate a ${type} pitch for ElevenLabs voice AI solutions.

TARGET:
- Company: ${company.name} (${company.domain})
- Industry: ${company.industry}
- Size: ${company.size} employees
- Description: ${company.description || 'N/A'}
${contact ? `- Contact: ${contact.fullName}, ${contact.title}` : '- Contact: Unknown decision maker'}
${contact?.persona ? `- Persona: ${contact.persona.type}, values ${contact.persona.communicationStyle}` : ''}

PRODUCTS TO PITCH:
${products.map((p) => `- ${p.name}: ${p.valueProposition}`).join('\n')}

USE CASES IDENTIFIED:
${useCases.map((u) => `- ${u.title}: ${u.description}`).join('\n')}

PERSONALIZATION ELEMENTS:
${personalization.map((p) => `- [${p.type}] ${p.content}`).join('\n')}

HOOKS TO CONSIDER:
${hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}

REQUIREMENTS:
- Type: ${type}
- Tone: ${toneGuide[tone]}
- Length: ${lengthGuide[length]}
- Sender: ${senderName}

${type === 'email' ? 'Include a compelling subject line.' : ''}
${type === 'linkedin' ? 'Keep it conversational and LinkedIn-appropriate.' : ''}
${type === 'call_script' ? 'Structure as a call script with clear sections.' : ''}

Focus on:
1. Opening with personalization
2. Clear value proposition
3. Specific relevance to their business
4. Soft, non-pushy call to action
5. Building curiosity for a conversation

Return JSON with:
${type === 'email' ? '- subject: string' : ''}
- body: string (the full ${type} content)`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const result = JSON.parse(text);
    return {
      subject: result.subject,
      body: result.body,
      tokensUsed,
    };
  } catch {
    // Extract content if JSON parsing fails
    return {
      subject: hooks[0],
      body: text,
      tokensUsed,
    };
  }
}

/**
 * Generate A/B variants of a pitch
 */
export async function generateVariants(
  basePitch: GeneratedPitch,
  company: Company,
  contact?: Contact,
  variantCount: number = 2
): Promise<{ variants: GeneratedPitch[]; tokensUsed: number }> {
  const prompt = `Create ${variantCount} alternative versions of this pitch:

Original:
Subject: ${basePitch.subject || 'N/A'}
Body: ${basePitch.body}

Target: ${company.name}, ${contact?.fullName || 'decision maker'}

Create variants that:
1. Test different hooks/angles
2. Vary the opening line
3. Adjust the call to action
4. Keep the core value proposition

Return JSON array with objects containing:
- subject (if email)
- body
- variant_name (e.g., "Direct Value", "Social Proof", "Problem-Agitate")`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const variantsData = JSON.parse(text);
    const variants: GeneratedPitch[] = variantsData.map((v: Record<string, unknown>, i: number) => ({
      ...basePitch,
      id: crypto.randomUUID(),
      subject: v.subject as string || basePitch.subject,
      body: v.body as string,
      variant: v.variant_name as string || `Variant ${i + 1}`,
      generatedAt: new Date(),
    }));

    return { variants, tokensUsed };
  } catch {
    return { variants: [], tokensUsed };
  }
}

/**
 * Improve an existing pitch with AI feedback
 */
export async function improvePitch(
  pitch: GeneratedPitch,
  feedback?: string
): Promise<{ improved: GeneratedPitch; suggestions: string[]; tokensUsed: number }> {
  const prompt = `Improve this sales pitch:

Current pitch:
${pitch.subject ? `Subject: ${pitch.subject}` : ''}
Body: ${pitch.body}

${feedback ? `User feedback: ${feedback}` : ''}

Provide:
1. An improved version of the pitch
2. 3 specific suggestions for what was changed and why

Return JSON:
{
  "subject": "improved subject (if applicable)",
  "body": "improved body",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const result = JSON.parse(text);
    return {
      improved: {
        ...pitch,
        id: crypto.randomUUID(),
        subject: result.subject || pitch.subject,
        body: result.body || pitch.body,
        generatedAt: new Date(),
      },
      suggestions: result.suggestions || [],
      tokensUsed,
    };
  } catch {
    return {
      improved: pitch,
      suggestions: ['Unable to parse improvement suggestions'],
      tokensUsed,
    };
  }
}

export default {
  generatePitch,
  generateVariants,
  improvePitch,
  ELEVENLABS_PRODUCTS,
};
