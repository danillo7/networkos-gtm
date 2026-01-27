/**
 * NetworkOS - Product/Service Analysis API
 * Analyzes company products and services for voice AI opportunities
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Company, Product, VoiceAIPotential } from './lib/types';

const anthropic = new Anthropic();

// Voice AI opportunity categories
const VOICE_AI_CATEGORIES = {
  contentCreation: {
    name: 'Content Creation',
    description: 'Audio content production at scale',
    indicators: ['content', 'media', 'publishing', 'blog', 'article', 'news'],
    products: ['Text to Speech API', 'Voice Cloning'],
    examples: ['Audiobooks', 'Podcast production', 'Video voiceovers', 'News narration'],
  },
  customerExperience: {
    name: 'Customer Experience',
    description: 'Voice-powered customer interactions',
    indicators: ['customer', 'support', 'service', 'chat', 'contact', 'help'],
    products: ['Conversational AI', 'Text to Speech API'],
    examples: ['Voice bots', 'IVR systems', 'Virtual assistants', 'Phone agents'],
  },
  localization: {
    name: 'Global Localization',
    description: 'Multi-language content adaptation',
    indicators: ['global', 'international', 'language', 'translate', 'localize'],
    products: ['AI Dubbing', 'Text to Speech API'],
    examples: ['Video dubbing', 'Course localization', 'Marketing adaptation'],
  },
  gaming: {
    name: 'Gaming & Entertainment',
    description: 'Interactive audio experiences',
    indicators: ['game', 'gaming', 'entertainment', 'interactive', 'npc', 'character'],
    products: ['Voice Cloning', 'Conversational AI', 'Sound Effects Generation'],
    examples: ['NPC dialogue', 'Dynamic narration', 'Character voices'],
  },
  accessibility: {
    name: 'Accessibility',
    description: 'Making content accessible to all',
    indicators: ['access', 'inclusive', 'disability', 'screen reader', 'assist'],
    products: ['Text to Speech API'],
    examples: ['Screen readers', 'Document narration', 'Navigation assistance'],
  },
  education: {
    name: 'Education & Training',
    description: 'Learning content delivery',
    indicators: ['learn', 'educat', 'train', 'course', 'tutor', 'teach'],
    products: ['Text to Speech API', 'Voice Cloning', 'Conversational AI'],
    examples: ['Course narration', 'Language learning', 'Interactive tutoring'],
  },
  marketing: {
    name: 'Marketing & Advertising',
    description: 'Brand voice and campaigns',
    indicators: ['market', 'brand', 'advertis', 'campaign', 'promo'],
    products: ['Voice Cloning', 'Text to Speech API', 'AI Dubbing'],
    examples: ['Brand voice', 'Ad production', 'Personalized messages'],
  },
  healthcare: {
    name: 'Healthcare',
    description: 'Medical and wellness applications',
    indicators: ['health', 'medical', 'patient', 'care', 'wellness', 'therapy'],
    products: ['Conversational AI', 'Text to Speech API'],
    examples: ['Patient communication', 'Health assistants', 'Appointment reminders'],
  },
};

// Types for analysis
export interface ProductAnalysisResult {
  products: AnalyzedProduct[];
  overallVoiceAIPotential: number;
  topOpportunities: VoiceAIOpportunity[];
  recommendations: string[];
  competitiveInsights: string[];
  tokensUsed: number;
}

export interface AnalyzedProduct {
  original: Product;
  voiceAIPotential: VoiceAIPotential;
  categories: string[];
  suggestedElevenLabsProducts: string[];
  implementationIdeas: string[];
}

export interface VoiceAIOpportunity {
  area: string;
  product: string;
  description: string;
  potentialImpact: 'High' | 'Medium' | 'Low';
  elevenlabsProducts: string[];
  implementationComplexity: 'High' | 'Medium' | 'Low';
  roi: string;
}

/**
 * Analyze company products for voice AI opportunities
 */
export async function analyzeProducts(company: Company): Promise<ProductAnalysisResult> {
  const products = company.products || [];

  if (products.length === 0) {
    // Try to infer products from company description
    const inferredProducts = await inferProducts(company);
    if (inferredProducts.length > 0) {
      products.push(...inferredProducts);
    }
  }

  // Analyze each product
  const analyzedProducts: AnalyzedProduct[] = [];
  let totalPotential = 0;

  for (const product of products) {
    const analyzed = analyzeProduct(product, company);
    analyzedProducts.push(analyzed);
    totalPotential += analyzed.voiceAIPotential.score;
  }

  // Get AI-powered deep analysis
  const aiAnalysis = await deepAnalyzeWithAI(company, analyzedProducts);

  // Calculate overall potential
  const overallPotential = products.length > 0
    ? Math.round(totalPotential / products.length)
    : aiAnalysis.inferredPotential;

  // Identify top opportunities
  const topOpportunities = identifyTopOpportunities(analyzedProducts, company, aiAnalysis);

  return {
    products: analyzedProducts,
    overallVoiceAIPotential: overallPotential,
    topOpportunities,
    recommendations: aiAnalysis.recommendations,
    competitiveInsights: aiAnalysis.competitiveInsights,
    tokensUsed: aiAnalysis.tokensUsed,
  };
}

/**
 * Analyze a single product
 */
function analyzeProduct(product: Product, company: Company): AnalyzedProduct {
  const text = `${product.name} ${product.description} ${company.industry}`.toLowerCase();

  // Find matching categories
  const matchedCategories: string[] = [];
  const suggestedProducts = new Set<string>();
  let potentialScore = 30; // Base score

  for (const [key, category] of Object.entries(VOICE_AI_CATEGORIES)) {
    const matches = category.indicators.filter((ind) => text.includes(ind));
    if (matches.length > 0) {
      matchedCategories.push(category.name);
      category.products.forEach((p) => suggestedProducts.add(p));
      potentialScore += matches.length * 10;
    }
  }

  // Industry-specific bonuses
  const highPotentialIndustries = ['Media', 'Gaming', 'E-Learning', 'Entertainment', 'Publishing'];
  if (highPotentialIndustries.some((ind) => company.industry?.includes(ind))) {
    potentialScore += 15;
  }

  // Cap the score
  potentialScore = Math.min(100, potentialScore);

  // Generate implementation ideas
  const implementationIdeas = generateImplementationIdeas(matchedCategories, product);

  return {
    original: product,
    voiceAIPotential: {
      score: potentialScore,
      useCases: matchedCategories.flatMap((cat) =>
        VOICE_AI_CATEGORIES[Object.keys(VOICE_AI_CATEGORIES).find(
          (k) => VOICE_AI_CATEGORIES[k as keyof typeof VOICE_AI_CATEGORIES].name === cat
        ) as keyof typeof VOICE_AI_CATEGORIES]?.examples || []
      ).slice(0, 3),
      reasoning: `Product "${product.name}" has ${matchedCategories.length} voice AI category matches: ${matchedCategories.join(', ') || 'general potential'}.`,
    },
    categories: matchedCategories,
    suggestedElevenLabsProducts: Array.from(suggestedProducts),
    implementationIdeas,
  };
}

/**
 * Generate implementation ideas for a product
 */
function generateImplementationIdeas(categories: string[], product: Product): string[] {
  const ideas: string[] = [];

  if (categories.includes('Content Creation')) {
    ideas.push(`Convert ${product.name} content to audio format automatically`);
    ideas.push('Create consistent brand voice across all audio content');
  }

  if (categories.includes('Customer Experience')) {
    ideas.push(`Add voice interface to ${product.name} for hands-free operation`);
    ideas.push('Implement AI voice agent for customer support');
  }

  if (categories.includes('Global Localization')) {
    ideas.push(`Dub ${product.name} content into multiple languages`);
    ideas.push('Preserve brand voice across localized versions');
  }

  if (categories.includes('Education & Training')) {
    ideas.push('Add audio narration to learning materials');
    ideas.push('Create interactive voice-based tutoring');
  }

  if (ideas.length === 0) {
    ideas.push('Add voice interface for enhanced accessibility');
    ideas.push('Create audio versions of key content');
  }

  return ideas.slice(0, 3);
}

/**
 * Infer products from company description
 */
async function inferProducts(company: Company): Promise<Product[]> {
  if (!company.description) return [];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Based on this company description, identify their likely products or services:

Company: ${company.name}
Industry: ${company.industry}
Description: ${company.description}

Return a JSON array of up to 3 products with:
- name: Product/service name
- description: Brief description
- category: Product category

Return only valid JSON array.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

/**
 * Deep AI analysis of voice AI opportunities
 */
async function deepAnalyzeWithAI(
  company: Company,
  analyzedProducts: AnalyzedProduct[]
): Promise<{
  recommendations: string[];
  competitiveInsights: string[];
  inferredPotential: number;
  tokensUsed: number;
}> {
  const prompt = `Analyze this company for ElevenLabs voice AI opportunities:

Company: ${company.name}
Industry: ${company.industry}
Description: ${company.description || 'N/A'}
Size: ${company.size}

Products analyzed:
${analyzedProducts.map((p) => `- ${p.original.name}: ${p.original.description} (Potential: ${p.voiceAIPotential.score}/100)`).join('\n')}

Provide:
1. recommendations: 3-5 specific, actionable recommendations for voice AI integration
2. competitiveInsights: 2-3 insights about how voice AI could give them competitive advantage
3. inferredPotential: Overall voice AI potential score (0-100)

Consider:
- Their specific business model
- Industry trends
- How competitors might be using voice AI
- Quick wins vs long-term opportunities

Return as JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  try {
    const result = JSON.parse(text);
    return {
      recommendations: result.recommendations || [],
      competitiveInsights: result.competitiveInsights || [],
      inferredPotential: result.inferredPotential || 50,
      tokensUsed,
    };
  } catch {
    return {
      recommendations: ['Schedule a discovery call to understand specific needs'],
      competitiveInsights: ['Voice AI adoption is growing in this industry'],
      inferredPotential: 50,
      tokensUsed,
    };
  }
}

/**
 * Identify top voice AI opportunities
 */
function identifyTopOpportunities(
  analyzedProducts: AnalyzedProduct[],
  company: Company,
  aiAnalysis: { recommendations: string[]; competitiveInsights: string[] }
): VoiceAIOpportunity[] {
  const opportunities: VoiceAIOpportunity[] = [];

  // Create opportunities from analyzed products
  for (const product of analyzedProducts) {
    if (product.voiceAIPotential.score >= 50) {
      for (const category of product.categories.slice(0, 2)) {
        const categoryConfig = Object.values(VOICE_AI_CATEGORIES).find((c) => c.name === category);

        opportunities.push({
          area: category,
          product: product.original.name,
          description: product.implementationIdeas[0] || `Integrate voice AI with ${product.original.name}`,
          potentialImpact: product.voiceAIPotential.score >= 70 ? 'High' : 'Medium',
          elevenlabsProducts: product.suggestedElevenLabsProducts,
          implementationComplexity: categoryConfig?.products.includes('Conversational AI') ? 'Medium' : 'Low',
          roi: product.voiceAIPotential.score >= 70 ? 'High - 10x+ ROI potential' : 'Medium - 5x ROI potential',
        });
      }
    }
  }

  // Add industry-level opportunity if no product-specific ones
  if (opportunities.length === 0) {
    opportunities.push({
      area: 'General Voice AI',
      product: company.name,
      description: `Explore voice AI applications for ${company.industry}`,
      potentialImpact: 'Medium',
      elevenlabsProducts: ['Text to Speech API', 'Conversational AI'],
      implementationComplexity: 'Low',
      roi: 'Medium - Start with pilot project',
    });
  }

  // Sort by impact and return top 5
  return opportunities
    .sort((a, b) => {
      const impactOrder = { High: 3, Medium: 2, Low: 1 };
      return impactOrder[b.potentialImpact] - impactOrder[a.potentialImpact];
    })
    .slice(0, 5);
}

/**
 * Quick product potential check
 */
export function quickProductPotential(product: Product): number {
  const text = `${product.name} ${product.description}`.toLowerCase();
  let score = 40;

  const highValueKeywords = ['video', 'audio', 'content', 'media', 'voice', 'speak', 'listen'];
  const mediumValueKeywords = ['customer', 'support', 'chat', 'learn', 'train', 'game'];

  score += highValueKeywords.filter((kw) => text.includes(kw)).length * 10;
  score += mediumValueKeywords.filter((kw) => text.includes(kw)).length * 5;

  return Math.min(100, score);
}

export default {
  analyzeProducts,
  quickProductPotential,
  VOICE_AI_CATEGORIES,
};
