/**
 * NetworkOS - AI Scoring Agent
 * Multi-factor AI scoring for opportunity qualification
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  Company,
  Contact,
  AIScore,
  ScoringSignal,
} from '../lib/types';

const anthropic = new Anthropic();

// Scoring weights for different factors
const SCORING_WEIGHTS = {
  companyFit: 0.25,
  voiceAIOpportunity: 0.30,
  timingSignals: 0.20,
  competitiveLandscape: 0.10,
  budgetIndicators: 0.15,
};

// ElevenLabs ideal customer profile
const IDEAL_CUSTOMER_PROFILE = {
  industries: [
    { name: 'Media & Entertainment', weight: 1.0 },
    { name: 'Gaming', weight: 1.0 },
    { name: 'E-Learning', weight: 0.95 },
    { name: 'Publishing', weight: 0.9 },
    { name: 'Customer Service', weight: 0.85 },
    { name: 'Healthcare', weight: 0.8 },
    { name: 'Finance', weight: 0.75 },
    { name: 'Technology', weight: 0.7 },
    { name: 'Retail', weight: 0.65 },
  ],
  sizes: [
    { range: '51-200', weight: 1.0 },
    { range: '201-500', weight: 1.0 },
    { range: '501-1000', weight: 0.95 },
    { range: '1001-5000', weight: 0.9 },
    { range: '11-50', weight: 0.8 },
    { range: '5001-10000', weight: 0.75 },
    { range: '10000+', weight: 0.7 },
    { range: '1-10', weight: 0.5 },
  ],
  techIndicators: [
    'aws', 'gcp', 'azure', 'kubernetes', 'docker',
    'react', 'node', 'python', 'api', 'microservices',
  ],
  voiceIndicators: [
    'audio', 'voice', 'speech', 'podcast', 'video',
    'content', 'media', 'streaming', 'broadcasting',
  ],
};

// Types for scoring
export interface ScoringInput {
  company: Company;
  contacts?: Contact[];
  researchSignals?: ScoringSignal[];
  voiceAIOpportunities?: Array<{
    area: string;
    potentialImpact: string;
    elevenlabsProducts: string[];
  }>;
}

export interface ScoringResult {
  score: AIScore;
  breakdown: ScoreBreakdown;
  recommendations: string[];
  nextBestActions: string[];
  tokensUsed: number;
}

export interface ScoreBreakdown {
  companyFit: {
    score: number;
    factors: Array<{ factor: string; impact: number; reason: string }>;
  };
  voiceAIOpportunity: {
    score: number;
    factors: Array<{ factor: string; impact: number; reason: string }>;
  };
  timingSignals: {
    score: number;
    factors: Array<{ factor: string; impact: number; reason: string }>;
  };
  competitiveLandscape: {
    score: number;
    factors: Array<{ factor: string; impact: number; reason: string }>;
  };
  budgetIndicators: {
    score: number;
    factors: Array<{ factor: string; impact: number; reason: string }>;
  };
}

/**
 * Main scoring function - comprehensive opportunity scoring
 */
export async function scoreOpportunity(input: ScoringInput): Promise<ScoringResult> {
  const { company, contacts, researchSignals, voiceAIOpportunities } = input;

  // Calculate rule-based scores first
  const companyFitScore = calculateCompanyFitScore(company);
  const voiceOpportunityScore = calculateVoiceOpportunityScore(company, voiceAIOpportunities);
  const timingScore = calculateTimingScore(researchSignals || []);
  const budgetScore = calculateBudgetScore(company);

  // Use AI to analyze competitive landscape and refine scores
  const aiAnalysis = await analyzeWithAI(input, {
    companyFitScore,
    voiceOpportunityScore,
    timingScore,
    budgetScore,
  });

  // Build the final score
  const breakdown: ScoreBreakdown = {
    companyFit: companyFitScore,
    voiceAIOpportunity: voiceOpportunityScore,
    timingSignals: timingScore,
    competitiveLandscape: aiAnalysis.competitiveLandscape,
    budgetIndicators: budgetScore,
  };

  // Calculate weighted overall score
  const overallScore = Math.round(
    breakdown.companyFit.score * SCORING_WEIGHTS.companyFit +
    breakdown.voiceAIOpportunity.score * SCORING_WEIGHTS.voiceAIOpportunity +
    breakdown.timingSignals.score * SCORING_WEIGHTS.timingSignals +
    breakdown.competitiveLandscape.score * SCORING_WEIGHTS.competitiveLandscape +
    breakdown.budgetIndicators.score * SCORING_WEIGHTS.budgetIndicators
  );

  // Calculate confidence based on data completeness
  const confidence = calculateConfidence(company, contacts, researchSignals);

  const score: AIScore = {
    overall: overallScore,
    companyFit: breakdown.companyFit.score,
    voiceAIOpportunity: breakdown.voiceAIOpportunity.score,
    timingSignals: breakdown.timingSignals.score,
    competitiveLandscape: breakdown.competitiveLandscape.score,
    budgetIndicators: breakdown.budgetIndicators.score,
    confidence,
    reasoning: aiAnalysis.reasoning,
    signals: researchSignals || [],
    calculatedAt: new Date(),
    modelUsed: 'claude-sonnet-4-20250514',
  };

  return {
    score,
    breakdown,
    recommendations: aiAnalysis.recommendations,
    nextBestActions: aiAnalysis.nextBestActions,
    tokensUsed: aiAnalysis.tokensUsed,
  };
}

/**
 * Calculate company fit score based on ICP
 */
function calculateCompanyFitScore(company: Company): ScoreBreakdown['companyFit'] {
  const factors: Array<{ factor: string; impact: number; reason: string }> = [];
  let totalScore = 50; // Base score

  // Industry match
  const industryMatch = IDEAL_CUSTOMER_PROFILE.industries.find(
    (i) => company.industry?.toLowerCase().includes(i.name.toLowerCase())
  );
  if (industryMatch) {
    const impact = Math.round(25 * industryMatch.weight);
    totalScore += impact;
    factors.push({
      factor: 'Industry Match',
      impact,
      reason: `${company.industry} is a target industry (weight: ${industryMatch.weight})`,
    });
  } else {
    factors.push({
      factor: 'Industry Match',
      impact: 0,
      reason: `${company.industry} is not a primary target industry`,
    });
  }

  // Company size
  const sizeMatch = IDEAL_CUSTOMER_PROFILE.sizes.find((s) => s.range === company.size);
  if (sizeMatch) {
    const impact = Math.round(15 * sizeMatch.weight);
    totalScore += impact;
    factors.push({
      factor: 'Company Size',
      impact,
      reason: `${company.size} employees is ideal (weight: ${sizeMatch.weight})`,
    });
  }

  // Tech stack indicators
  const techMatches = (company.techStack || []).filter((tech) =>
    IDEAL_CUSTOMER_PROFILE.techIndicators.some((indicator) =>
      tech.toLowerCase().includes(indicator)
    )
  );
  if (techMatches.length > 0) {
    const impact = Math.min(10, techMatches.length * 2);
    totalScore += impact;
    factors.push({
      factor: 'Tech Stack',
      impact,
      reason: `Modern tech stack detected: ${techMatches.slice(0, 3).join(', ')}`,
    });
  }

  // Funding stage
  if (company.funding?.stage) {
    const goodStages = ['Series A', 'Series B', 'Series C'];
    if (goodStages.includes(company.funding.stage)) {
      factors.push({
        factor: 'Funding Stage',
        impact: 10,
        reason: `${company.funding.stage} companies have budget for new solutions`,
      });
      totalScore += 10;
    }
  }

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    factors,
  };
}

/**
 * Calculate voice AI opportunity score
 */
function calculateVoiceOpportunityScore(
  company: Company,
  opportunities?: Array<{ area: string; potentialImpact: string; elevenlabsProducts: string[] }>
): ScoreBreakdown['voiceAIOpportunity'] {
  const factors: Array<{ factor: string; impact: number; reason: string }> = [];
  let totalScore = 30; // Base score

  // Check for voice-related indicators in products
  const voiceRelatedProducts = (company.products || []).filter((product) => {
    const text = `${product.name} ${product.description}`.toLowerCase();
    return IDEAL_CUSTOMER_PROFILE.voiceIndicators.some((indicator) =>
      text.includes(indicator)
    );
  });

  if (voiceRelatedProducts.length > 0) {
    const impact = Math.min(30, voiceRelatedProducts.length * 10);
    totalScore += impact;
    factors.push({
      factor: 'Voice-Related Products',
      impact,
      reason: `${voiceRelatedProducts.length} products with voice/audio potential`,
    });
  }

  // Check identified opportunities
  if (opportunities && opportunities.length > 0) {
    const highImpact = opportunities.filter((o) => o.potentialImpact === 'High').length;
    const mediumImpact = opportunities.filter((o) => o.potentialImpact === 'Medium').length;

    const opportunityImpact = highImpact * 15 + mediumImpact * 8;
    totalScore += Math.min(40, opportunityImpact);

    factors.push({
      factor: 'Identified Opportunities',
      impact: Math.min(40, opportunityImpact),
      reason: `${highImpact} high-impact and ${mediumImpact} medium-impact opportunities`,
    });

    // Multiple ElevenLabs products applicable
    const productsApplicable = new Set(opportunities.flatMap((o) => o.elevenlabsProducts));
    if (productsApplicable.size > 1) {
      factors.push({
        factor: 'Multi-Product Potential',
        impact: productsApplicable.size * 5,
        reason: `${productsApplicable.size} ElevenLabs products applicable`,
      });
      totalScore += productsApplicable.size * 5;
    }
  }

  // Industry voice potential
  const highVoiceIndustries = ['Media & Entertainment', 'Gaming', 'E-Learning', 'Publishing'];
  if (highVoiceIndustries.some((ind) => company.industry?.includes(ind))) {
    factors.push({
      factor: 'Industry Voice Potential',
      impact: 15,
      reason: `${company.industry} has natural voice AI applications`,
    });
    totalScore += 15;
  }

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    factors,
  };
}

/**
 * Calculate timing score based on signals
 */
function calculateTimingScore(signals: ScoringSignal[]): ScoreBreakdown['timingSignals'] {
  const factors: Array<{ factor: string; impact: number; reason: string }> = [];
  let totalScore = 40; // Base score (neutral timing)

  // Process each signal
  for (const signal of signals) {
    const strengthMultiplier = signal.strength === 'Strong' ? 1.0 :
      signal.strength === 'Moderate' ? 0.6 : 0.3;

    let baseImpact = 0;

    switch (signal.type) {
      case 'Funding':
        baseImpact = 20;
        break;
      case 'Hiring':
        baseImpact = 15;
        break;
      case 'Product Launch':
        baseImpact = 15;
        break;
      case 'Tech Stack Change':
        baseImpact = 12;
        break;
      case 'Expansion':
        baseImpact = 10;
        break;
      case 'Leadership Change':
        baseImpact = 8;
        break;
      case 'Pain Point Indicator':
        baseImpact = 18;
        break;
      default:
        baseImpact = 5;
    }

    const impact = Math.round(baseImpact * strengthMultiplier);
    totalScore += impact;

    factors.push({
      factor: signal.type,
      impact,
      reason: signal.description,
    });
  }

  // Cap the score
  return {
    score: Math.min(100, Math.max(0, totalScore)),
    factors,
  };
}

/**
 * Calculate budget indicators score
 */
function calculateBudgetScore(company: Company): ScoreBreakdown['budgetIndicators'] {
  const factors: Array<{ factor: string; impact: number; reason: string }> = [];
  let totalScore = 50; // Base score

  // Funding indicates budget
  if (company.funding?.totalRaised) {
    const raised = company.funding.totalRaised.toLowerCase();
    if (raised.includes('m') || raised.includes('billion')) {
      factors.push({
        factor: 'Funding Level',
        impact: 20,
        reason: `Raised ${company.funding.totalRaised} - strong budget indicators`,
      });
      totalScore += 20;
    }
  }

  // Recent funding round
  if (company.funding?.lastRoundDate) {
    const monthsAgo = (Date.now() - new Date(company.funding.lastRoundDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo < 12) {
      factors.push({
        factor: 'Recent Funding',
        impact: 15,
        reason: 'Funded within last 12 months - likely has budget to spend',
      });
      totalScore += 15;
    }
  }

  // Company size implies budget
  const largeSizes = ['501-1000', '1001-5000', '5001-10000', '10000+'];
  if (largeSizes.includes(company.size)) {
    factors.push({
      factor: 'Company Size Budget',
      impact: 15,
      reason: `${company.size} employees typically have departmental budgets`,
    });
    totalScore += 15;
  }

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    factors,
  };
}

/**
 * Calculate confidence score based on data completeness
 */
function calculateConfidence(
  company: Company,
  contacts?: Contact[],
  signals?: ScoringSignal[]
): number {
  let dataPoints = 0;
  let maxDataPoints = 15;

  // Company data completeness
  if (company.name) dataPoints++;
  if (company.domain) dataPoints++;
  if (company.industry) dataPoints++;
  if (company.size) dataPoints++;
  if (company.description) dataPoints++;
  if (company.techStack && company.techStack.length > 0) dataPoints++;
  if (company.products && company.products.length > 0) dataPoints++;
  if (company.funding) dataPoints++;
  if (company.employeeCount) dataPoints++;
  if (company.linkedinUrl) dataPoints++;

  // Contact data
  if (contacts && contacts.length > 0) dataPoints += 2;
  if (contacts && contacts.some((c) => c.decisionMaker)) dataPoints++;

  // Signals
  if (signals && signals.length > 0) dataPoints += 2;

  return Math.round((dataPoints / maxDataPoints) * 100);
}

/**
 * Use AI to analyze competitive landscape and provide recommendations
 */
async function analyzeWithAI(
  input: ScoringInput,
  preliminaryScores: {
    companyFitScore: ScoreBreakdown['companyFit'];
    voiceOpportunityScore: ScoreBreakdown['voiceAIOpportunity'];
    timingScore: ScoreBreakdown['timingSignals'];
    budgetScore: ScoreBreakdown['budgetIndicators'];
  }
): Promise<{
  competitiveLandscape: ScoreBreakdown['competitiveLandscape'];
  reasoning: string;
  recommendations: string[];
  nextBestActions: string[];
  tokensUsed: number;
}> {
  const { company, voiceAIOpportunities } = input;

  const prompt = `Analyze this company for ElevenLabs voice AI solutions and provide:

Company: ${company.name} (${company.domain})
Industry: ${company.industry}
Size: ${company.size} employees
Description: ${company.description || 'N/A'}
Products: ${company.products?.map((p) => p.name).join(', ') || 'N/A'}
Tech Stack: ${company.techStack?.join(', ') || 'N/A'}

Voice AI Opportunities Identified:
${voiceAIOpportunities?.map((o) => `- ${o.area}: ${o.potentialImpact} impact`).join('\n') || 'None identified yet'}

Preliminary Scores:
- Company Fit: ${preliminaryScores.companyFitScore.score}/100
- Voice AI Opportunity: ${preliminaryScores.voiceOpportunityScore.score}/100
- Timing Signals: ${preliminaryScores.timingScore.score}/100
- Budget Indicators: ${preliminaryScores.budgetScore.score}/100

Provide a JSON response with:
1. competitiveLandscape: { score: number (0-100), factors: [{ factor: string, impact: number, reason: string }] }
2. reasoning: A 2-3 sentence overall assessment
3. recommendations: Array of 3 strategic recommendations
4. nextBestActions: Array of 3 immediate next steps

Consider:
- Who are their likely competitors in voice AI space?
- Are they using any voice AI solutions currently?
- What's their competitive advantage that voice AI could enhance?

Respond only with valid JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const analysis = JSON.parse(text);
    return {
      competitiveLandscape: analysis.competitiveLandscape || { score: 50, factors: [] },
      reasoning: analysis.reasoning || 'Analysis complete.',
      recommendations: analysis.recommendations || [],
      nextBestActions: analysis.nextBestActions || [],
      tokensUsed,
    };
  } catch {
    return {
      competitiveLandscape: { score: 50, factors: [] },
      reasoning: 'Unable to complete AI analysis.',
      recommendations: ['Gather more company information', 'Research competitors', 'Identify decision makers'],
      nextBestActions: ['Enrich company data', 'Find contacts', 'Generate initial pitch'],
      tokensUsed,
    };
  }
}

/**
 * Quick score - faster but less detailed
 */
export async function quickScore(company: Partial<Company>): Promise<number> {
  let score = 50;

  // Industry bonus
  const goodIndustries = ['Media', 'Gaming', 'E-Learning', 'Entertainment', 'Publishing'];
  if (goodIndustries.some((ind) => company.industry?.includes(ind))) {
    score += 15;
  }

  // Size bonus
  const goodSizes = ['51-200', '201-500', '501-1000', '1001-5000'];
  if (goodSizes.includes(company.size || '')) {
    score += 10;
  }

  // Tech stack bonus
  if (company.techStack && company.techStack.length > 3) {
    score += 10;
  }

  // Products with voice potential
  if (company.products) {
    const voiceProducts = company.products.filter((p) =>
      /audio|voice|video|content|media|stream/i.test(`${p.name} ${p.description}`)
    );
    score += Math.min(15, voiceProducts.length * 5);
  }

  return Math.min(100, Math.max(0, score));
}

export default {
  scoreOpportunity,
  quickScore,
  SCORING_WEIGHTS,
  IDEAL_CUSTOMER_PROFILE,
};
