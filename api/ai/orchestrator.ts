/**
 * NetworkOS - Master AI Orchestrator
 * Coordinates all AI agents using Claude Opus 4.5 for complex GTM workflows
 */

import Anthropic from '@anthropic-ai/sdk';
import { researchCompany, type ResearchResult } from './research-company';
import { scoreOpportunity, type ScoringResult } from './score-opportunity';
import { findContacts, type ContactFinderResult } from './find-contacts';
import { generatePitch, type PitchGeneratorResult } from './generate-pitch';
import type {
  Company,
  Contact,
  AIScore,
  GeneratedPitch,
  AgentExecution,
  AgentStep,
  OpportunityStage,
} from '../lib/types';
import {
  createCompany,
  updateCompany,
  createContact,
  createPitch,
  createOpportunity,
  getCompanyByDomain,
} from '../lib/supabase';

const anthropic = new Anthropic();

// Orchestrator system prompt
const ORCHESTRATOR_PROMPT = `You are the Master AI Orchestrator for NetworkOS, an AI-First GTM platform. Your role is to:

1. Analyze incoming requests and determine the best sequence of agent actions
2. Coordinate between Research, Scoring, Contact Finder, and Pitch Generator agents
3. Make intelligent decisions about when to enrich data vs use existing data
4. Optimize for both speed and quality
5. Provide strategic recommendations

You have access to these agents:
- research_company: Deep company research and analysis
- score_opportunity: Multi-factor opportunity scoring
- find_contacts: Discover decision makers and influencers
- generate_pitch: Create personalized outreach content

Always think step-by-step:
1. What do we already know?
2. What do we need to find out?
3. Which agents should we use and in what order?
4. What's the expected outcome?

Be efficient - don't run unnecessary operations. Prioritize the user's goal.`;

// Types for orchestration
export interface OrchestrationRequest {
  type: OrchestrationType;
  input: OrchestrationInput;
  options?: OrchestrationOptions;
}

export type OrchestrationType =
  | 'full_qualification' // Research -> Score -> Find Contacts -> Generate Pitch
  | 'quick_assessment' // Quick research and scoring
  | 'find_champions' // Just find and analyze contacts
  | 'create_campaign' // Generate multi-touch campaign
  | 'enrich_and_score' // Enrich existing lead and score
  | 'custom'; // AI decides the workflow

export interface OrchestrationInput {
  domain?: string;
  companyName?: string;
  existingCompany?: Company;
  existingContacts?: Contact[];
  targetRoles?: string[];
  focusProducts?: string[];
  customInstructions?: string;
}

export interface OrchestrationOptions {
  maxBudget?: number; // Max cost in dollars
  maxDuration?: number; // Max time in seconds
  depth?: 'quick' | 'standard' | 'deep';
  saveResults?: boolean;
  generatePitches?: boolean;
  pitchTypes?: ('email' | 'linkedin' | 'call_script')[];
}

export interface OrchestrationResult {
  success: boolean;
  company?: Company;
  contacts?: Contact[];
  score?: AIScore;
  pitches?: GeneratedPitch[];
  recommendations: string[];
  nextSteps: string[];
  execution: AgentExecution;
  summary: string;
}

// Tool definitions for the orchestrator
const ORCHESTRATOR_TOOLS: Anthropic.Tool[] = [
  {
    name: 'research_company',
    description: 'Research a company to gather comprehensive intelligence about their business, products, technology, and voice AI opportunities.',
    input_schema: {
      type: 'object' as const,
      properties: {
        domain: { type: 'string', description: 'Company domain to research' },
        company_name: { type: 'string', description: 'Company name (optional)' },
        depth: { type: 'string', enum: ['basic', 'standard', 'deep'], description: 'Research depth' },
      },
      required: ['domain'],
    },
  },
  {
    name: 'score_opportunity',
    description: 'Score an opportunity based on company fit, voice AI potential, timing signals, and budget indicators.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_id: { type: 'string', description: 'Company ID to score' },
        include_contacts: { type: 'boolean', description: 'Include contact analysis in scoring' },
      },
      required: ['company_id'],
    },
  },
  {
    name: 'find_contacts',
    description: 'Find decision makers and influencers at a company using multiple data sources.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_id: { type: 'string', description: 'Company ID' },
        company_name: { type: 'string', description: 'Company name' },
        domain: { type: 'string', description: 'Company domain' },
        target_roles: { type: 'array', items: { type: 'string' }, description: 'Specific roles to find' },
        max_contacts: { type: 'number', description: 'Maximum contacts to find' },
      },
      required: ['company_id', 'domain'],
    },
  },
  {
    name: 'generate_pitch',
    description: 'Generate a personalized pitch for a specific company and contact.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_id: { type: 'string', description: 'Company ID' },
        contact_id: { type: 'string', description: 'Contact ID (optional)' },
        pitch_type: { type: 'string', enum: ['email', 'linkedin', 'call_script'], description: 'Type of pitch' },
        tone: { type: 'string', enum: ['Professional', 'Friendly', 'Technical', 'Executive'], description: 'Pitch tone' },
        focus_products: { type: 'array', items: { type: 'string' }, description: 'ElevenLabs products to focus on' },
      },
      required: ['company_id', 'pitch_type'],
    },
  },
  {
    name: 'save_to_pipeline',
    description: 'Save a qualified opportunity to the pipeline with the appropriate stage.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_id: { type: 'string', description: 'Company ID' },
        stage: {
          type: 'string',
          enum: ['New Lead', 'Researching', 'Outreach Started', 'Engaged'],
          description: 'Pipeline stage',
        },
        primary_contact_id: { type: 'string', description: 'Primary contact ID' },
        notes: { type: 'string', description: 'Notes about the opportunity' },
      },
      required: ['company_id', 'stage'],
    },
  },
  {
    name: 'complete_workflow',
    description: 'Signal that the workflow is complete and provide final summary.',
    input_schema: {
      type: 'object' as const,
      properties: {
        summary: { type: 'string', description: 'Summary of what was accomplished' },
        recommendations: { type: 'array', items: { type: 'string' }, description: 'Strategic recommendations' },
        next_steps: { type: 'array', items: { type: 'string' }, description: 'Suggested next steps' },
      },
      required: ['summary', 'recommendations', 'next_steps'],
    },
  },
];

// State management for orchestration
interface OrchestrationState {
  company?: Company;
  contacts: Contact[];
  score?: AIScore;
  pitches: GeneratedPitch[];
  researchResult?: ResearchResult;
  steps: AgentStep[];
  totalTokens: number;
  totalCost: number;
}

/**
 * Main orchestration function
 */
export async function orchestrate(request: OrchestrationRequest): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const { type, input, options = {} } = request;
  const {
    depth = 'standard',
    saveResults = true,
    generatePitches = true,
    pitchTypes = ['email'],
  } = options;

  // Initialize state
  const state: OrchestrationState = {
    company: input.existingCompany,
    contacts: input.existingContacts || [],
    pitches: [],
    steps: [],
    totalTokens: 0,
    totalCost: 0,
  };

  // Build the orchestration prompt
  const orchestrationPrompt = buildOrchestrationPrompt(type, input, options);

  // Messages for the conversation
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: orchestrationPrompt },
  ];

  let finalResult: OrchestrationResult | null = null;
  let iteration = 0;
  const maxIterations = 15;

  // Orchestration loop
  while (iteration < maxIterations && !finalResult) {
    iteration++;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-20250514', // Using Opus for orchestration
      max_tokens: 4096,
      system: ORCHESTRATOR_PROMPT,
      tools: ORCHESTRATOR_TOOLS,
      messages,
    });

    state.totalTokens += response.usage.input_tokens + response.usage.output_tokens;
    state.totalCost += calculateCost(response.usage.input_tokens, response.usage.output_tokens, 'opus');

    // Process response
    const toolUses: Anthropic.ToolUseBlock[] = [];

    for (const block of response.content) {
      if (block.type === 'tool_use') {
        toolUses.push(block);
      }
    }

    // If no tool uses, we might be done
    if (toolUses.length === 0 && response.stop_reason === 'end_turn') {
      break;
    }

    // Execute tools
    if (toolUses.length > 0) {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUses) {
        const toolInput = toolUse.input as Record<string, unknown>;

        // Track the step
        state.steps.push({
          order: state.steps.length + 1,
          action: toolUse.name,
          input: toolInput,
          timestamp: new Date(),
        });

        // Execute based on tool type
        let result: string;

        switch (toolUse.name) {
          case 'research_company':
            result = await executeResearch(toolInput, state, depth);
            break;

          case 'score_opportunity':
            result = await executeScoring(toolInput, state);
            break;

          case 'find_contacts':
            result = await executeFindContacts(toolInput, state);
            break;

          case 'generate_pitch':
            result = await executeGeneratePitch(toolInput, state, saveResults);
            break;

          case 'save_to_pipeline':
            result = await executeSaveToPipeline(toolInput, state, saveResults);
            break;

          case 'complete_workflow':
            finalResult = buildFinalResult(toolInput, state, startTime);
            result = 'Workflow completed successfully.';
            break;

          default:
            result = JSON.stringify({ error: 'Unknown tool' });
        }

        // Update step with output
        state.steps[state.steps.length - 1].output = { result };

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      // Add to conversation
      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });
    }
  }

  // Build final result if not completed
  if (!finalResult) {
    finalResult = {
      success: state.company !== undefined,
      company: state.company,
      contacts: state.contacts,
      score: state.score,
      pitches: state.pitches,
      recommendations: ['Complete the workflow manually'],
      nextSteps: ['Review gathered data'],
      execution: {
        id: crypto.randomUUID(),
        agentType: 'MasterOrchestrator',
        input: request as unknown as Record<string, unknown>,
        output: state as unknown as Record<string, unknown>,
        status: 'completed',
        steps: state.steps,
        totalTokens: state.totalTokens,
        cost: state.totalCost,
        duration: Date.now() - startTime,
        startedAt: new Date(startTime),
        completedAt: new Date(),
      },
      summary: `Orchestration completed with ${state.steps.length} steps.`,
    };
  }

  return finalResult as OrchestrationResult
}

/**
 * Build the orchestration prompt based on request type
 */
function buildOrchestrationPrompt(
  type: OrchestrationType,
  input: OrchestrationInput,
  options: OrchestrationOptions
): string {
  const baseContext = `
Domain: ${input.domain || 'Not provided'}
Company Name: ${input.companyName || 'Unknown'}
${input.existingCompany ? `Existing Company Data: ${JSON.stringify(input.existingCompany, null, 2)}` : 'No existing company data'}
${input.existingContacts?.length ? `Existing Contacts: ${input.existingContacts.length} contacts on file` : 'No existing contacts'}
${input.targetRoles?.length ? `Target Roles: ${input.targetRoles.join(', ')}` : ''}
${input.focusProducts?.length ? `Focus Products: ${input.focusProducts.join(', ')}` : ''}
${input.customInstructions ? `Custom Instructions: ${input.customInstructions}` : ''}

Options:
- Depth: ${options.depth || 'standard'}
- Save Results: ${options.saveResults !== false}
- Generate Pitches: ${options.generatePitches !== false}
`;

  switch (type) {
    case 'full_qualification':
      return `Execute a full lead qualification workflow:

${baseContext}

Steps to complete:
1. Research the company thoroughly
2. Score the opportunity
3. Find decision makers and champions
4. Generate personalized pitches
5. Save to pipeline if score is high enough (>60)

Use tools strategically. When done, use complete_workflow to summarize.`;

    case 'quick_assessment':
      return `Perform a quick assessment of this opportunity:

${baseContext}

Steps:
1. Quick research (basic depth)
2. Score the opportunity
3. Provide recommendations

Don't find contacts or generate pitches. Focus on speed.
Use complete_workflow when done.`;

    case 'find_champions':
      return `Find and analyze potential champions at this company:

${baseContext}

Steps:
1. Brief research to understand the company
2. Find contacts with focus on decision makers
3. Analyze who would champion voice AI solutions

Use complete_workflow with recommendations on who to contact first.`;

    case 'create_campaign':
      return `Create a multi-touch outreach campaign:

${baseContext}

Steps:
1. Research company if needed
2. Find key contacts
3. Generate multiple pitch types (email, linkedin, call script)
4. Provide campaign strategy

Use complete_workflow with the full campaign plan.`;

    case 'enrich_and_score':
      return `Enrich this existing lead and provide updated scoring:

${baseContext}

Steps:
1. Research to enrich existing data
2. Score with full analysis
3. Recommend if this should be prioritized

Use complete_workflow with enrichment summary.`;

    case 'custom':
    default:
      return `Analyze this request and determine the best approach:

${baseContext}

${input.customInstructions || 'Analyze the opportunity and take appropriate actions.'}

Use your judgment to decide which tools to use and in what order.
Use complete_workflow when you have enough information to provide valuable recommendations.`;
  }
}

/**
 * Execute research tool
 */
async function executeResearch(
  input: Record<string, unknown>,
  state: OrchestrationState,
  depth: string
): Promise<string> {
  const domain = input.domain as string;

  // Check if we already have this company
  const existing = await getCompanyByDomain(domain);
  if (existing && existing.lastEnriched) {
    const daysSinceEnriched = (Date.now() - existing.lastEnriched.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceEnriched < 30) {
      state.company = existing;
      return JSON.stringify({
        status: 'cached',
        message: 'Using cached company data (less than 30 days old)',
        company: existing,
      });
    }
  }

  // Perform research
  const result = await researchCompany(domain, input.company_name as string, {
    depth: (depth as 'basic' | 'standard' | 'deep') || 'standard',
  });

  state.researchResult = result;
  state.totalTokens += result.tokensUsed;

  // Create or update company
  if (result.success && result.company) {
    if (existing) {
      state.company = await updateCompany(existing.id, {
        ...result.company,
        lastEnriched: new Date(),
      });
    } else {
      state.company = await createCompany({
        ...result.company,
        domain,
        lastEnriched: new Date(),
      });
    }
  }

  return JSON.stringify({
    status: 'completed',
    company: state.company,
    signals: result.signals,
    voiceAIOpportunities: result.voiceAIOpportunities,
    tokensUsed: result.tokensUsed,
  });
}

/**
 * Execute scoring tool
 */
async function executeScoring(
  input: Record<string, unknown>,
  state: OrchestrationState
): Promise<string> {
  if (!state.company) {
    return JSON.stringify({ error: 'No company data available for scoring' });
  }

  const result: ScoringResult = await scoreOpportunity({
    company: state.company,
    contacts: state.contacts.length > 0 ? state.contacts : undefined,
    researchSignals: state.researchResult?.signals,
    voiceAIOpportunities: state.researchResult?.voiceAIOpportunities,
  });

  state.score = result.score;
  state.totalTokens += result.tokensUsed;

  // Update company with score
  if (state.company.id) {
    await updateCompany(state.company.id, { aiScore: result.score });
  }

  return JSON.stringify({
    status: 'completed',
    score: result.score,
    breakdown: result.breakdown,
    recommendations: result.recommendations,
    nextBestActions: result.nextBestActions,
  });
}

/**
 * Execute find contacts tool
 */
async function executeFindContacts(
  input: Record<string, unknown>,
  state: OrchestrationState
): Promise<string> {
  const result: ContactFinderResult = await findContacts({
    companyId: input.company_id as string,
    companyName: state.company?.name || (input.company_name as string) || '',
    domain: input.domain as string,
    industry: state.company?.industry,
    targetRoles: input.target_roles as string[],
    maxContacts: (input.max_contacts as number) || 10,
  });

  state.totalTokens += result.tokensUsed;

  // Save contacts to database
  for (const contact of result.contacts) {
    const savedContact = await createContact({
      companyId: state.company?.id || (input.company_id as string),
      firstName: contact.firstName,
      lastName: contact.lastName,
      fullName: contact.fullName,
      email: contact.email,
      emailVerified: contact.emailConfidence ? contact.emailConfidence > 80 : false,
      phone: contact.phone,
      linkedinUrl: contact.linkedinUrl,
      title: contact.title,
      department: contact.department,
      seniority: contact.seniority,
      authorityScore: contact.authorityScore,
      decisionMaker: contact.decisionMaker,
      influencer: contact.influencer,
      persona: contact.persona,
      enrichmentSources: result.sources,
      lastEnriched: new Date(),
    });
    state.contacts.push(savedContact);
  }

  return JSON.stringify({
    status: 'completed',
    contactsFound: result.contacts.length,
    contacts: state.contacts.map((c) => ({
      id: c.id,
      name: c.fullName,
      title: c.title,
      email: c.email,
      authorityScore: c.authorityScore,
      decisionMaker: c.decisionMaker,
    })),
  });
}

/**
 * Execute generate pitch tool
 */
async function executeGeneratePitch(
  input: Record<string, unknown>,
  state: OrchestrationState,
  saveResults: boolean
): Promise<string> {
  if (!state.company) {
    return JSON.stringify({ error: 'No company data available for pitch generation' });
  }

  // Find contact if specified
  const contact = input.contact_id
    ? state.contacts.find((c) => c.id === input.contact_id)
    : state.contacts[0]; // Use highest authority contact

  const result: PitchGeneratorResult = await generatePitch({
    company: state.company,
    contact,
    type: (input.pitch_type as 'email' | 'linkedin' | 'call_script') || 'email',
    tone: (input.tone as 'Professional' | 'Friendly' | 'Technical' | 'Executive') || 'Professional',
    focusProducts: input.focus_products as string[],
  });

  state.totalTokens += result.tokensUsed;

  // Save pitch
  if (saveResults) {
    await createPitch(result.pitch);
  }
  state.pitches.push(result.pitch);

  return JSON.stringify({
    status: 'completed',
    pitch: {
      id: result.pitch.id,
      type: result.pitch.type,
      subject: result.pitch.subject,
      bodyPreview: result.pitch.body.substring(0, 200) + '...',
      hooks: result.pitch.hooks,
      products: result.pitch.elevenlabsProducts.map((p) => p.name),
    },
  });
}

/**
 * Execute save to pipeline tool
 */
async function executeSaveToPipeline(
  input: Record<string, unknown>,
  state: OrchestrationState,
  saveResults: boolean
): Promise<string> {
  if (!saveResults) {
    return JSON.stringify({ status: 'skipped', message: 'Save disabled' });
  }

  const opportunity = await createOpportunity({
    companyId: input.company_id as string,
    primaryContactId: input.primary_contact_id as string,
    stage: input.stage as OpportunityStage,
    notes: [
      {
        id: crypto.randomUUID(),
        content: input.notes as string || 'Created by AI Orchestrator',
        author: 'AI Orchestrator',
        createdAt: new Date(),
      },
    ],
    aiRecommendations: state.researchResult?.voiceAIOpportunities?.map(
      (o) => `${o.area}: ${o.description}`
    ),
  });

  return JSON.stringify({
    status: 'completed',
    opportunityId: opportunity.id,
    stage: opportunity.stage,
  });
}

/**
 * Build the final orchestration result
 */
function buildFinalResult(
  input: Record<string, unknown>,
  state: OrchestrationState,
  startTime: number
): OrchestrationResult {
  return {
    success: true,
    company: state.company,
    contacts: state.contacts,
    score: state.score,
    pitches: state.pitches,
    recommendations: (input.recommendations as string[]) || [],
    nextSteps: (input.next_steps as string[]) || [],
    execution: {
      id: crypto.randomUUID(),
      agentType: 'MasterOrchestrator',
      input: {},
      output: {
        company: state.company?.id,
        contactCount: state.contacts.length,
        pitchCount: state.pitches.length,
        score: state.score?.overall,
      },
      status: 'completed',
      steps: state.steps,
      totalTokens: state.totalTokens,
      cost: state.totalCost,
      duration: Date.now() - startTime,
      startedAt: new Date(startTime),
      completedAt: new Date(),
    },
    summary: (input.summary as string) || 'Orchestration completed.',
  };
}

/**
 * Calculate API cost
 */
function calculateCost(inputTokens: number, outputTokens: number, model: 'opus' | 'sonnet'): number {
  const rates = {
    opus: { input: 0.015, output: 0.075 }, // per 1k tokens
    sonnet: { input: 0.003, output: 0.015 },
  };

  const rate = rates[model];
  return (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output;
}

/**
 * Quick orchestration - simplified wrapper for common use cases
 */
export async function quickQualify(domain: string): Promise<OrchestrationResult> {
  return orchestrate({
    type: 'quick_assessment',
    input: { domain },
    options: { depth: 'quick', saveResults: false, generatePitches: false },
  });
}

export async function fullQualify(
  domain: string,
  options?: Partial<OrchestrationOptions>
): Promise<OrchestrationResult> {
  return orchestrate({
    type: 'full_qualification',
    input: { domain },
    options: { depth: 'deep', saveResults: true, generatePitches: true, ...options },
  });
}

export default {
  orchestrate,
  quickQualify,
  fullQualify,
};
