/**
 * NetworkOS - AI Research Agent
 * Performs deep company research using Claude and multiple data sources
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  Company,
  Product,
  FundingInfo,
  Location,
  EnrichmentSource,
  ScoringSignal,
} from '../lib/types';

const anthropic = new Anthropic();

// Research agent system prompt
const RESEARCH_AGENT_PROMPT = `You are an expert B2B research analyst specializing in technology companies and their potential for AI voice solutions. Your role is to:

1. Analyze companies comprehensively
2. Identify their products and services
3. Understand their technology stack
4. Find voice AI opportunities
5. Discover relevant signals (hiring, funding, product launches)

You have access to tools to search the web and gather information. Use them strategically to build a complete picture of the company.

When analyzing a company, focus on:
- Core business model and revenue streams
- Target customers and market positioning
- Technology infrastructure and stack
- Current use of AI/voice technology
- Pain points that voice AI could solve
- Growth signals and timing indicators

Be thorough but efficient. Prioritize actionable intelligence over exhaustive data collection.`;

// Types for research results
export interface ResearchResult {
  success: boolean;
  company: Partial<Company>;
  signals: ScoringSignal[];
  voiceAIOpportunities: VoiceAIOpportunity[];
  competitorInsights: CompetitorInsight[];
  sources: EnrichmentSource[];
  reasoning: string;
  tokensUsed: number;
  duration: number;
}

export interface VoiceAIOpportunity {
  area: string;
  description: string;
  potentialImpact: 'High' | 'Medium' | 'Low';
  elevenlabsProducts: string[];
  implementationComplexity: 'High' | 'Medium' | 'Low';
}

export interface CompetitorInsight {
  competitor: string;
  relationship: 'Direct' | 'Indirect' | 'Adjacent';
  voiceAIUsage?: string;
  opportunity: string;
}

// Tool definitions for the research agent
const RESEARCH_TOOLS: Anthropic.Tool[] = [
  {
    name: 'web_search',
    description: 'Search the web for information about a company, technology, or topic. Use this to find recent news, product information, and company details.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
        focus: {
          type: 'string',
          enum: ['company_info', 'products', 'news', 'technology', 'hiring', 'funding'],
          description: 'The focus area for the search',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'analyze_website',
    description: 'Analyze a company website to extract information about products, services, and technology.',
    input_schema: {
      type: 'object' as const,
      properties: {
        url: {
          type: 'string',
          description: 'The website URL to analyze',
        },
        extract: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific information to extract (e.g., products, pricing, tech_stack)',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'search_linkedin',
    description: 'Search LinkedIn for company information, employees, and job postings.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_name: {
          type: 'string',
          description: 'The company name to search for',
        },
        search_type: {
          type: 'string',
          enum: ['company_profile', 'employees', 'job_postings'],
          description: 'Type of LinkedIn search',
        },
      },
      required: ['company_name', 'search_type'],
    },
  },
  {
    name: 'search_crunchbase',
    description: 'Search Crunchbase for funding information, investors, and company details.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_name: {
          type: 'string',
          description: 'The company name to search for',
        },
      },
      required: ['company_name'],
    },
  },
  {
    name: 'finalize_research',
    description: 'Complete the research and provide final analysis.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_data: {
          type: 'object',
          description: 'Compiled company information',
        },
        voice_ai_opportunities: {
          type: 'array',
          description: 'Identified voice AI opportunities',
        },
        signals: {
          type: 'array',
          description: 'Timing and intent signals discovered',
        },
        reasoning: {
          type: 'string',
          description: 'Analysis reasoning and recommendations',
        },
      },
      required: ['company_data', 'voice_ai_opportunities', 'signals', 'reasoning'],
    },
  },
];

// Simulated tool execution (replace with actual API calls)
async function executeResearchTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  // In production, these would call actual APIs
  switch (toolName) {
    case 'web_search':
      return simulateWebSearch(toolInput.query as string, toolInput.focus as string);
    case 'analyze_website':
      return simulateWebsiteAnalysis(toolInput.url as string);
    case 'search_linkedin':
      return simulateLinkedInSearch(toolInput.company_name as string, toolInput.search_type as string);
    case 'search_crunchbase':
      return simulateCrunchbaseSearch(toolInput.company_name as string);
    case 'finalize_research':
      return JSON.stringify(toolInput);
    default:
      return JSON.stringify({ error: 'Unknown tool' });
  }
}

// Simulated API responses (replace with real implementations)
function simulateWebSearch(query: string, focus?: string): string {
  return JSON.stringify({
    results: [
      {
        title: `Information about ${query}`,
        snippet: `Relevant information found for: ${query}. Focus: ${focus || 'general'}`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
      },
    ],
    note: 'Replace with actual Perplexity API call',
  });
}

function simulateWebsiteAnalysis(url: string): string {
  return JSON.stringify({
    url,
    analysis: {
      products: ['Product information would be extracted here'],
      tech_stack: ['Technologies would be identified here'],
      voice_opportunities: ['Voice AI use cases would be identified'],
    },
    note: 'Replace with actual web scraping/analysis',
  });
}

function simulateLinkedInSearch(companyName: string, searchType: string): string {
  return JSON.stringify({
    company: companyName,
    search_type: searchType,
    results: {
      employee_count: 'Would show actual count',
      recent_hires: ['Would list recent hires'],
      job_postings: ['Would list relevant postings'],
    },
    note: 'Replace with actual LinkedIn API call',
  });
}

function simulateCrunchbaseSearch(companyName: string): string {
  return JSON.stringify({
    company: companyName,
    funding: {
      total_raised: 'Would show actual funding',
      last_round: 'Would show last round details',
      investors: ['Would list investors'],
    },
    note: 'Replace with actual Crunchbase API call',
  });
}

/**
 * Main research function - performs deep company analysis
 */
export async function researchCompany(
  domain: string,
  companyName?: string,
  options?: {
    depth?: 'basic' | 'standard' | 'deep';
    focusAreas?: string[];
    maxIterations?: number;
  }
): Promise<ResearchResult> {
  const startTime = Date.now();
  const { depth = 'standard', maxIterations = 10 } = options || {};

  let totalTokens = 0;
  const sources: EnrichmentSource[] = [];

  // Build the initial research prompt
  const researchPrompt = `Research the company with domain: ${domain}${companyName ? ` (${companyName})` : ''}.

Research depth: ${depth}
${options?.focusAreas ? `Focus areas: ${options.focusAreas.join(', ')}` : ''}

Your goal is to gather comprehensive intelligence about this company, specifically:

1. **Company Overview**: Size, industry, founding year, headquarters, description
2. **Products & Services**: What they sell, their main offerings, pricing model
3. **Technology**: Tech stack, infrastructure, current AI usage
4. **Voice AI Opportunities**: Where ElevenLabs products could add value:
   - Text-to-Speech for content creation
   - Voice cloning for brand consistency
   - Conversational AI for customer service
   - AI Dubbing for localization
   - Sound effects for media production
5. **Timing Signals**: Recent funding, hiring trends, product launches, expansions
6. **Competitive Landscape**: Who they compete with, market position

Use the available tools to gather this information. When you have enough data, use the finalize_research tool to complete your analysis.`;

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: researchPrompt },
  ];

  let finalResult: ResearchResult | null = null;
  let iteration = 0;

  // Agentic loop
  while (iteration < maxIterations && !finalResult) {
    iteration++;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: RESEARCH_AGENT_PROMPT,
      tools: RESEARCH_TOOLS,
      messages,
    });

    totalTokens += response.usage.input_tokens + response.usage.output_tokens;

    // Process response
    const toolUses: Anthropic.ToolUseBlock[] = [];
    let textContent = '';

    for (const block of response.content) {
      if (block.type === 'tool_use') {
        toolUses.push(block);
      } else if (block.type === 'text') {
        textContent += block.text;
      }
    }

    // If no tool uses and stop reason is end_turn, we're done
    if (toolUses.length === 0 && response.stop_reason === 'end_turn') {
      break;
    }

    // Execute tools and collect results
    if (toolUses.length > 0) {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUses) {
        // Check if this is the finalize tool
        if (toolUse.name === 'finalize_research') {
          const input = toolUse.input as Record<string, unknown>;
          finalResult = parseResearchOutput(input, sources, totalTokens, Date.now() - startTime);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: 'Research finalized successfully.',
          });
        } else {
          // Execute the tool
          const result = await executeResearchTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );

          // Track source
          sources.push({
            provider: 'AI Research',
            dataPoints: [toolUse.name],
            enrichedAt: new Date(),
            confidence: 0.8,
          });

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          });
        }
      }

      // Add assistant message and tool results
      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });
    }
  }

  // If we didn't get a finalized result, create one from available data
  if (!finalResult) {
    finalResult = {
      success: false,
      company: { domain, name: companyName },
      signals: [],
      voiceAIOpportunities: [],
      competitorInsights: [],
      sources,
      reasoning: 'Research incomplete - max iterations reached',
      tokensUsed: totalTokens,
      duration: Date.now() - startTime,
    };
  }

  return finalResult;
}

/**
 * Parse the finalized research output into structured data
 */
function parseResearchOutput(
  input: Record<string, unknown>,
  sources: EnrichmentSource[],
  tokensUsed: number,
  duration: number
): ResearchResult {
  const companyData = input.company_data as Record<string, unknown> || {};
  const voiceOpportunities = (input.voice_ai_opportunities as unknown[]) || [];
  const signals = (input.signals as unknown[]) || [];
  const reasoning = (input.reasoning as string) || '';

  // Parse company data
  const company: Partial<Company> = {
    name: companyData.name as string,
    domain: companyData.domain as string,
    description: companyData.description as string,
    industry: companyData.industry as string,
    subIndustry: companyData.sub_industry as string,
    size: companyData.size as Company['size'],
    employeeCount: companyData.employee_count as number,
    revenue: companyData.revenue as string,
    techStack: (companyData.tech_stack as string[]) || [],
    foundedYear: companyData.founded_year as number,
    linkedinUrl: companyData.linkedin_url as string,
    twitterHandle: companyData.twitter_handle as string,
  };

  // Parse funding if present
  if (companyData.funding) {
    company.funding = companyData.funding as FundingInfo;
  }

  // Parse headquarters if present
  if (companyData.headquarters) {
    company.headquarters = companyData.headquarters as Location;
  }

  // Parse products if present
  if (companyData.products) {
    company.products = (companyData.products as unknown[]).map((p: unknown) => {
      const prod = p as Record<string, unknown>;
      return {
        name: prod.name as string,
        description: prod.description as string,
        category: prod.category as string,
        url: prod.url as string,
      } as Product;
    });
  }

  // Parse voice AI opportunities
  const parsedOpportunities: VoiceAIOpportunity[] = voiceOpportunities.map((opp: unknown) => {
    const o = opp as Record<string, unknown>;
    return {
      area: o.area as string,
      description: o.description as string,
      potentialImpact: (o.potential_impact || o.potentialImpact || 'Medium') as VoiceAIOpportunity['potentialImpact'],
      elevenlabsProducts: (o.elevenlabs_products || o.elevenlabsProducts || []) as string[],
      implementationComplexity: (o.implementation_complexity || o.implementationComplexity || 'Medium') as VoiceAIOpportunity['implementationComplexity'],
    };
  });

  // Parse signals
  const parsedSignals: ScoringSignal[] = signals.map((sig: unknown) => {
    const s = sig as Record<string, unknown>;
    return {
      type: s.type as ScoringSignal['type'],
      strength: (s.strength || 'Moderate') as ScoringSignal['strength'],
      description: s.description as string,
      source: (s.source || 'AI Research') as string,
      timestamp: s.timestamp ? new Date(s.timestamp as string) : undefined,
    };
  });

  return {
    success: true,
    company,
    signals: parsedSignals,
    voiceAIOpportunities: parsedOpportunities,
    competitorInsights: [], // Can be extended
    sources,
    reasoning,
    tokensUsed,
    duration,
  };
}

/**
 * Quick research - faster but less comprehensive
 */
export async function quickResearch(domain: string): Promise<Partial<Company>> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Provide a brief analysis of the company at domain: ${domain}

Return a JSON object with:
- name: company name
- industry: primary industry
- size: employee size range (1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10000+)
- description: one sentence description
- products: array of main products/services (name and description)
- tech_stack: likely technologies used
- voice_ai_potential: brief note on voice AI opportunities

Respond only with valid JSON.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const data = JSON.parse(text);
    return {
      domain,
      name: data.name,
      industry: data.industry,
      size: data.size,
      description: data.description,
      products: data.products,
      techStack: data.tech_stack,
    };
  } catch {
    return { domain };
  }
}

export default {
  researchCompany,
  quickResearch,
};
