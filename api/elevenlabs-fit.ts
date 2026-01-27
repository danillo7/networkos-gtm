/**
 * NetworkOS - ElevenLabs Product Fit Analysis
 * Cross-references company needs with ElevenLabs product catalog
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Company, Product, ElevenLabsProduct } from './lib/types';
import { analyzeProducts, type ProductAnalysisResult } from './product-analysis';

const anthropic = new Anthropic();

// Complete ElevenLabs product catalog
const ELEVENLABS_CATALOG: ElevenLabsProductInfo[] = [
  {
    id: 'tts-api',
    name: 'Text to Speech API',
    description: 'Industry-leading AI voice synthesis with natural, expressive speech output',
    category: 'Text to Speech',
    features: [
      '29+ languages and accents',
      'Voice customization and styles',
      'Emotional tone control (happy, sad, excited, etc.)',
      'Low latency streaming (as low as 200ms)',
      'SSML support for fine control',
      'High-quality audio (up to 44.1kHz)',
    ],
    useCases: [
      'Audiobook production',
      'Video voiceovers and narration',
      'Podcast creation',
      'E-learning content',
      'IVR systems',
      'Accessibility solutions',
      'News article narration',
      'Documentation audio',
    ],
    targetAudience: [
      'Content creators',
      'Publishers',
      'E-learning platforms',
      'Game developers',
      'Call centers',
      'Media companies',
    ],
    pricingModel: 'Usage-based (characters generated)',
    competitiveAdvantage: [
      'Most natural sounding AI voices in the market',
      'Fastest inference times',
      'Widest language support',
      'Best emotional expression',
    ],
    integrationComplexity: 'Low',
    timeToValue: 'Hours to days',
  },
  {
    id: 'voice-cloning',
    name: 'Voice Cloning',
    description: 'Create custom AI voices from audio samples with instant or professional cloning',
    category: 'Voice Cloning',
    features: [
      'Instant cloning (30 seconds of audio)',
      'Professional cloning (30 minutes, highest quality)',
      'Voice consistency across all content',
      'Multi-language support for cloned voices',
      'Emotion preservation',
      'Fine-tuning options',
    ],
    useCases: [
      'Personal voice preservation',
      'Brand voice creation',
      'Character voices for games',
      'Dubbing workflows',
      'Personalized marketing',
      'Celebrity/influencer voice scaling',
      'Podcast host cloning',
    ],
    targetAudience: [
      'Media companies',
      'Game studios',
      'Personal users',
      'Marketing agencies',
      'Brands',
      'Content creators',
    ],
    pricingModel: 'Subscription tiers with clone limits',
    competitiveAdvantage: [
      'Highest fidelity voice cloning',
      'Fastest turnaround time',
      'Best emotional range preservation',
      'Works with minimal training data',
    ],
    integrationComplexity: 'Low to Medium',
    timeToValue: 'Days',
  },
  {
    id: 'conversational-ai',
    name: 'Conversational AI',
    description: 'Real-time voice AI for interactive applications with ultra-low latency',
    category: 'Conversational AI',
    features: [
      'Ultra-low latency (<500ms end-to-end)',
      'Natural turn-taking detection',
      'Interrupt handling',
      'Context awareness',
      'Multi-speaker support',
      'Emotion detection and response',
      'Integration with LLMs',
    ],
    useCases: [
      'AI voice assistants',
      'Customer service bots',
      'Interactive NPCs in games',
      'Voice interfaces for apps',
      'Tutoring and coaching systems',
      'Phone agents and receptionists',
      'Healthcare companions',
    ],
    targetAudience: [
      'Tech companies',
      'Customer service departments',
      'Gaming companies',
      'EdTech platforms',
      'Healthcare providers',
      'Retail',
    ],
    pricingModel: 'Usage-based (minutes of conversation)',
    competitiveAdvantage: [
      'Lowest latency in the market',
      'Most natural conversation flow',
      'Best interrupt handling',
      'Seamless LLM integration',
    ],
    integrationComplexity: 'Medium to High',
    timeToValue: 'Weeks',
  },
  {
    id: 'ai-dubbing',
    name: 'AI Dubbing',
    description: 'Automatic video dubbing preserving original voice characteristics across languages',
    category: 'Dubbing',
    features: [
      '29 supported languages',
      'Voice preservation across languages',
      'Lip sync optimization',
      'Emotion and tone transfer',
      'Batch processing capability',
      'Speaker diarization',
      'Timing adjustment',
    ],
    useCases: [
      'Movie and TV localization',
      'Corporate video translation',
      'YouTube content localization',
      'E-learning course localization',
      'Marketing video adaptation',
      'Documentary dubbing',
      'Webinar translation',
    ],
    targetAudience: [
      'Studios and production companies',
      'Streaming platforms',
      'Corporate communications',
      'Content creators',
      'E-learning providers',
      'Marketing teams',
    ],
    pricingModel: 'Per-minute pricing',
    competitiveAdvantage: [
      'Best voice preservation',
      'Fastest turnaround time',
      'Most accurate lip sync',
      'Widest language support',
    ],
    integrationComplexity: 'Low',
    timeToValue: 'Hours',
  },
  {
    id: 'sound-effects',
    name: 'Sound Effects Generation',
    description: 'AI-generated sound effects from text descriptions',
    category: 'Audio AI',
    features: [
      'Text-to-SFX generation',
      'Customizable parameters',
      'High quality output',
      'Commercial license included',
      'Variation generation',
      'Duration control',
    ],
    useCases: [
      'Game audio production',
      'Film and video production',
      'Podcast enhancement',
      'Video content creation',
      'Ad production',
      'Music production',
    ],
    targetAudience: [
      'Game developers',
      'Video editors',
      'Podcasters',
      'Film makers',
      'Music producers',
      'Ad agencies',
    ],
    pricingModel: 'Usage-based',
    competitiveAdvantage: [
      'Most realistic AI-generated SFX',
      'Fastest generation time',
      'Widest variety of sounds',
      'Easy text-based control',
    ],
    integrationComplexity: 'Low',
    timeToValue: 'Hours',
  },
];

interface ElevenLabsProductInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  useCases: string[];
  targetAudience: string[];
  pricingModel: string;
  competitiveAdvantage: string[];
  integrationComplexity: 'Low' | 'Low to Medium' | 'Medium' | 'Medium to High' | 'High';
  timeToValue: string;
}

// Types for fit analysis
export interface FitAnalysisResult {
  overallFit: number; // 0-100
  productMatches: ProductMatch[];
  primaryRecommendation: ProductMatch;
  bundleOpportunity?: BundleOpportunity;
  valueProposition: string;
  objectionHandling: ObjectionResponse[];
  competitivePositioning: string;
  implementationRoadmap: ImplementationStep[];
  tokensUsed: number;
}

export interface ProductMatch {
  product: ElevenLabsProductInfo;
  fitScore: number; // 0-100
  relevantUseCases: string[];
  companySpecificBenefits: string[];
  estimatedROI: string;
  implementationNotes: string;
}

export interface BundleOpportunity {
  products: string[];
  description: string;
  combinedValue: string;
  discount?: string;
}

export interface ObjectionResponse {
  objection: string;
  response: string;
  proofPoints: string[];
}

export interface ImplementationStep {
  phase: number;
  name: string;
  description: string;
  products: string[];
  duration: string;
  milestones: string[];
}

/**
 * Analyze ElevenLabs product fit for a company
 */
export async function analyzeElevenLabsFit(company: Company): Promise<FitAnalysisResult> {
  // First, analyze the company's products
  const productAnalysis = await analyzeProducts(company);

  // Match ElevenLabs products
  const productMatches = matchProducts(company, productAnalysis);

  // Get AI-powered deep analysis
  const aiAnalysis = await deepFitAnalysis(company, productAnalysis, productMatches);

  // Calculate overall fit
  const overallFit = calculateOverallFit(productMatches, aiAnalysis);

  // Identify primary recommendation
  const primaryRecommendation = productMatches[0];

  // Check for bundle opportunities
  const bundleOpportunity = identifyBundleOpportunity(productMatches);

  // Generate implementation roadmap
  const implementationRoadmap = generateRoadmap(productMatches, company);

  return {
    overallFit,
    productMatches,
    primaryRecommendation,
    bundleOpportunity,
    valueProposition: aiAnalysis.valueProposition,
    objectionHandling: aiAnalysis.objectionHandling,
    competitivePositioning: aiAnalysis.competitivePositioning,
    implementationRoadmap,
    tokensUsed: productAnalysis.tokensUsed + aiAnalysis.tokensUsed,
  };
}

/**
 * Match ElevenLabs products to company profile
 */
function matchProducts(company: Company, analysis: ProductAnalysisResult): ProductMatch[] {
  const matches: ProductMatch[] = [];

  for (const product of ELEVENLABS_CATALOG) {
    let fitScore = 30; // Base score
    const relevantUseCases: string[] = [];
    const companySpecificBenefits: string[] = [];

    // Industry matching
    const industryRelevance: Record<string, number> = {
      'Media': 25,
      'Entertainment': 25,
      'Gaming': 25,
      'E-Learning': 20,
      'Education': 20,
      'Publishing': 20,
      'Customer Service': 15,
      'Technology': 10,
      'Healthcare': 15,
      'Finance': 10,
      'Retail': 10,
    };

    for (const [industry, bonus] of Object.entries(industryRelevance)) {
      if (company.industry?.toLowerCase().includes(industry.toLowerCase())) {
        fitScore += bonus;
        break;
      }
    }

    // Target audience matching
    const audienceMatch = product.targetAudience.some((audience) =>
      company.industry?.toLowerCase().includes(audience.toLowerCase()) ||
      company.description?.toLowerCase().includes(audience.toLowerCase())
    );
    if (audienceMatch) {
      fitScore += 15;
      companySpecificBenefits.push(`${product.name} is designed for ${company.industry} companies`);
    }

    // Use case matching with company products
    for (const companyProduct of company.products || []) {
      const productText = `${companyProduct.name} ${companyProduct.description}`.toLowerCase();

      for (const useCase of product.useCases) {
        const useCaseWords = useCase.toLowerCase().split(' ');
        if (useCaseWords.some((word) => word.length > 4 && productText.includes(word))) {
          relevantUseCases.push(useCase);
          fitScore += 5;
        }
      }
    }

    // Company size factor
    const sizeFactors: Record<string, number> = {
      '1-10': 0.8,
      '11-50': 0.9,
      '51-200': 1.0,
      '201-500': 1.0,
      '501-1000': 1.1,
      '1001-5000': 1.1,
      '5001-10000': 1.0,
      '10000+': 0.9,
    };
    fitScore *= sizeFactors[company.size] || 1.0;

    // Analyzed opportunities matching
    for (const opportunity of analysis.topOpportunities) {
      if (opportunity.elevenlabsProducts.includes(product.name)) {
        fitScore += 10;
        relevantUseCases.push(opportunity.description);
        companySpecificBenefits.push(`Addresses ${opportunity.area} opportunity`);
      }
    }

    // Cap the score
    fitScore = Math.min(100, Math.round(fitScore));

    // Generate benefits if none found
    if (companySpecificBenefits.length === 0) {
      companySpecificBenefits.push(`${product.features[0]} for ${company.name}`);
      companySpecificBenefits.push(product.competitiveAdvantage[0]);
    }

    matches.push({
      product,
      fitScore,
      relevantUseCases: [...new Set(relevantUseCases)].slice(0, 5),
      companySpecificBenefits: companySpecificBenefits.slice(0, 4),
      estimatedROI: estimateROI(product, company),
      implementationNotes: `${product.integrationComplexity} complexity. Time to value: ${product.timeToValue}.`,
    });
  }

  // Sort by fit score
  return matches.sort((a, b) => b.fitScore - a.fitScore);
}

/**
 * Estimate ROI for a product
 */
function estimateROI(product: ElevenLabsProductInfo, company: Company): string {
  const complexityFactor: Record<string, string> = {
    'Low': 'Quick wins possible within first month',
    'Low to Medium': 'ROI typically seen within 1-2 months',
    'Medium': 'ROI typically seen within 3 months',
    'Medium to High': 'Significant investment but 10x+ potential',
    'High': 'Strategic initiative with transformational potential',
  };

  const industryROI: Record<string, string> = {
    'Media': '10-20x cost savings on audio production',
    'Gaming': '5-10x faster character voice development',
    'E-Learning': '80% reduction in course production time',
    'Customer Service': '60% reduction in agent costs',
    'Publishing': '90% reduction in audiobook production costs',
  };

  for (const [industry, roi] of Object.entries(industryROI)) {
    if (company.industry?.includes(industry)) {
      return roi;
    }
  }

  return complexityFactor[product.integrationComplexity];
}

/**
 * Deep AI analysis for fit
 */
async function deepFitAnalysis(
  company: Company,
  productAnalysis: ProductAnalysisResult,
  matches: ProductMatch[]
): Promise<{
  valueProposition: string;
  objectionHandling: ObjectionResponse[];
  competitivePositioning: string;
  tokensUsed: number;
}> {
  const prompt = `Analyze ElevenLabs product fit for:

Company: ${company.name}
Industry: ${company.industry}
Size: ${company.size}
Description: ${company.description || 'N/A'}

Top matching products:
${matches.slice(0, 3).map((m) => `- ${m.product.name} (${m.fitScore}/100): ${m.relevantUseCases.slice(0, 2).join(', ')}`).join('\n')}

Voice AI opportunities identified:
${productAnalysis.topOpportunities.map((o) => `- ${o.area}: ${o.description}`).join('\n')}

Provide:
1. valueProposition: A compelling 2-3 sentence value proposition for this specific company
2. objectionHandling: 3 common objections with responses and proof points
3. competitivePositioning: How ElevenLabs compares to alternatives for their use case

Return as JSON.`;

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
      valueProposition: result.valueProposition || 'ElevenLabs provides industry-leading voice AI solutions.',
      objectionHandling: result.objectionHandling || [],
      competitivePositioning: result.competitivePositioning || 'ElevenLabs leads in voice quality and ease of use.',
      tokensUsed,
    };
  } catch {
    return {
      valueProposition: `ElevenLabs can help ${company.name} scale voice content production with the most natural-sounding AI voices in the market.`,
      objectionHandling: [
        {
          objection: 'AI voices sound robotic',
          response: 'ElevenLabs voices are rated most natural by users, often indistinguishable from human speech.',
          proofPoints: ['Blind tests show 95%+ human-like ratings', 'Used by major publishers and studios'],
        },
      ],
      competitivePositioning: 'ElevenLabs offers the highest quality voices with the fastest inference times.',
      tokensUsed,
    };
  }
}

/**
 * Calculate overall fit score
 */
function calculateOverallFit(matches: ProductMatch[], aiAnalysis: { valueProposition: string }): number {
  if (matches.length === 0) return 30;

  // Weight top matches more heavily
  const weightedScore =
    matches[0].fitScore * 0.5 +
    (matches[1]?.fitScore || 0) * 0.3 +
    (matches[2]?.fitScore || 0) * 0.2;

  return Math.round(weightedScore);
}

/**
 * Identify bundle opportunities
 */
function identifyBundleOpportunity(matches: ProductMatch[]): BundleOpportunity | undefined {
  const highFitProducts = matches.filter((m) => m.fitScore >= 60);

  if (highFitProducts.length >= 2) {
    // Common bundles
    const bundles = [
      {
        combo: ['Text to Speech API', 'Voice Cloning'],
        description: 'Content Creation Bundle',
        value: 'Create unique brand voices and scale content production',
      },
      {
        combo: ['Conversational AI', 'Text to Speech API'],
        description: 'Customer Experience Bundle',
        value: 'Full voice AI customer interaction solution',
      },
      {
        combo: ['AI Dubbing', 'Voice Cloning'],
        description: 'Global Localization Bundle',
        value: 'Maintain brand voice across all markets',
      },
    ];

    for (const bundle of bundles) {
      const hasAll = bundle.combo.every((product) =>
        highFitProducts.some((m) => m.product.name === product)
      );

      if (hasAll) {
        return {
          products: bundle.combo,
          description: bundle.description,
          combinedValue: bundle.value,
          discount: 'Bundle pricing available',
        };
      }
    }
  }

  return undefined;
}

/**
 * Generate implementation roadmap
 */
function generateRoadmap(matches: ProductMatch[], company: Company): ImplementationStep[] {
  const roadmap: ImplementationStep[] = [];
  const sortedMatches = matches.filter((m) => m.fitScore >= 50);

  if (sortedMatches.length === 0) {
    return [
      {
        phase: 1,
        name: 'Discovery',
        description: 'Explore voice AI opportunities with a pilot project',
        products: ['Text to Speech API'],
        duration: '2-4 weeks',
        milestones: ['API integration', 'First content generated', 'Quality validation'],
      },
    ];
  }

  // Phase 1: Quick Win
  const quickWin = sortedMatches.find((m) => m.product.integrationComplexity === 'Low');
  if (quickWin) {
    roadmap.push({
      phase: 1,
      name: 'Quick Win Implementation',
      description: `Start with ${quickWin.product.name} for immediate value`,
      products: [quickWin.product.name],
      duration: quickWin.product.timeToValue,
      milestones: [
        'API integration complete',
        'First use case live',
        'Team trained',
        'ROI measurement baseline',
      ],
    });
  }

  // Phase 2: Expansion
  const expansionProducts = sortedMatches
    .filter((m) => m.product.name !== quickWin?.product.name)
    .slice(0, 2);

  if (expansionProducts.length > 0) {
    roadmap.push({
      phase: 2,
      name: 'Capability Expansion',
      description: `Add ${expansionProducts.map((p) => p.product.name).join(' and ')}`,
      products: expansionProducts.map((p) => p.product.name),
      duration: '1-3 months',
      milestones: [
        'Additional integrations complete',
        'Cross-product workflows',
        'Scale testing',
      ],
    });
  }

  // Phase 3: Scale
  roadmap.push({
    phase: roadmap.length + 1,
    name: 'Scale & Optimize',
    description: 'Full production deployment and optimization',
    products: sortedMatches.slice(0, 3).map((m) => m.product.name),
    duration: 'Ongoing',
    milestones: [
      'Production deployment',
      'Performance optimization',
      'ROI validation',
      'Expansion planning',
    ],
  });

  return roadmap;
}

/**
 * Quick fit check
 */
export function quickFitScore(company: Company): number {
  const text = `${company.industry} ${company.description} ${company.products?.map((p) => p.name).join(' ')}`.toLowerCase();

  const highFitKeywords = ['media', 'content', 'audio', 'voice', 'video', 'game', 'publish', 'learn'];
  const mediumFitKeywords = ['customer', 'support', 'chat', 'global', 'international', 'marketing'];

  let score = 40;
  score += highFitKeywords.filter((kw) => text.includes(kw)).length * 8;
  score += mediumFitKeywords.filter((kw) => text.includes(kw)).length * 4;

  return Math.min(100, score);
}

export { ELEVENLABS_CATALOG };

export default {
  analyzeElevenLabsFit,
  quickFitScore,
  ELEVENLABS_CATALOG,
};
