/**
 * NetworkOS - Deep Company Enrichment API
 * Multi-source enrichment with validation and deduplication
 */

import type {
  Company,
  EnrichmentSource,
  EnrichmentProvider,
  EnrichmentResult,
  FundingInfo,
  Location,
  Product,
} from './lib/types';
import { getCompanyByDomain, updateCompany, logEnrichment } from './lib/supabase';

// Provider configurations
const PROVIDER_CONFIGS: Record<EnrichmentProvider, {
  priority: number;
  dataTypes: string[];
  costPerRequest: number;
  rateLimit: number;
}> = {
  'Clearbit': { priority: 1, dataTypes: ['company', 'social', 'tech'], costPerRequest: 0.10, rateLimit: 100 },
  'Apollo.io': { priority: 2, dataTypes: ['company', 'contacts', 'funding'], costPerRequest: 0.05, rateLimit: 60 },
  'Hunter.io': { priority: 3, dataTypes: ['emails', 'contacts'], costPerRequest: 0.03, rateLimit: 30 },
  'People Data Labs': { priority: 4, dataTypes: ['contacts', 'company'], costPerRequest: 0.08, rateLimit: 60 },
  'Perplexity': { priority: 5, dataTypes: ['research', 'news'], costPerRequest: 0.02, rateLimit: 30 },
  'Crunchbase': { priority: 6, dataTypes: ['funding', 'investors'], costPerRequest: 0.15, rateLimit: 20 },
  'LinkedIn': { priority: 7, dataTypes: ['company', 'employees'], costPerRequest: 0.00, rateLimit: 10 },
  'Manual': { priority: 99, dataTypes: ['any'], costPerRequest: 0, rateLimit: 999 },
  'AI Research': { priority: 10, dataTypes: ['any'], costPerRequest: 0.01, rateLimit: 100 },
};

// Types for enrichment
export interface DeepEnrichmentOptions {
  providers?: EnrichmentProvider[];
  maxCost?: number;
  forceRefresh?: boolean;
  dataTypes?: ('company' | 'contacts' | 'funding' | 'tech' | 'social' | 'news')[];
}

interface ProviderData {
  provider: EnrichmentProvider;
  data: Partial<Company>;
  confidence: number;
  dataPoints: string[];
  cost: number;
  duration: number;
}

/**
 * Main deep enrichment function
 */
export async function enrichCompanyDeep(
  domain: string,
  options: DeepEnrichmentOptions = {}
): Promise<EnrichmentResult> {
  const startTime = Date.now();
  const {
    providers = ['Clearbit', 'Apollo.io', 'Perplexity'],
    maxCost = 1.0,
    forceRefresh = false,
    dataTypes = ['company', 'funding', 'tech'],
  } = options;

  // Check existing data
  const existingCompany = await getCompanyByDomain(domain);
  if (existingCompany && !forceRefresh) {
    const daysSinceEnriched = existingCompany.lastEnriched
      ? (Date.now() - new Date(existingCompany.lastEnriched).getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    if (daysSinceEnriched < 30) {
      return {
        success: true,
        company: existingCompany,
        sources: existingCompany.enrichmentSources,
        totalCost: 0,
        totalDuration: 0,
      };
    }
  }

  // Filter providers by data types needed
  const relevantProviders = providers.filter((provider) => {
    const config = PROVIDER_CONFIGS[provider];
    return dataTypes.some((dt) => config.dataTypes.includes(dt) || config.dataTypes.includes('any'));
  });

  // Sort by priority
  const sortedProviders = relevantProviders.sort(
    (a, b) => PROVIDER_CONFIGS[a].priority - PROVIDER_CONFIGS[b].priority
  );

  // Run enrichment from each provider
  const providerResults: ProviderData[] = [];
  let totalCost = 0;

  for (const provider of sortedProviders) {
    const config = PROVIDER_CONFIGS[provider];

    // Check budget
    if (totalCost + config.costPerRequest > maxCost) {
      continue;
    }

    try {
      const result = await enrichFromProvider(domain, provider);
      providerResults.push(result);
      totalCost += result.cost;

      // Log the enrichment
      await logEnrichment({
        entityType: 'company',
        entityId: existingCompany?.id || domain,
        provider,
        status: result.dataPoints.length > 0 ? 'success' : 'partial',
        dataPointsFound: result.dataPoints.length,
        cost: result.cost,
        duration: result.duration,
      });
    } catch (error) {
      await logEnrichment({
        entityType: 'company',
        entityId: existingCompany?.id || domain,
        provider,
        status: 'failed',
        dataPointsFound: 0,
        cost: 0,
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Merge and validate data from all providers
  const mergedData = mergeProviderData(providerResults, existingCompany);

  // Build enrichment sources
  const sources: EnrichmentSource[] = providerResults.map((r) => ({
    provider: r.provider,
    dataPoints: r.dataPoints,
    enrichedAt: new Date(),
    confidence: r.confidence,
  }));

  // Save or update company
  let savedCompany: Company;
  if (existingCompany) {
    savedCompany = await updateCompany(existingCompany.id, {
      ...mergedData,
      enrichmentSources: [...(existingCompany.enrichmentSources || []), ...sources],
      lastEnriched: new Date(),
    });
  } else {
    // Would need to create - but we need more required fields
    savedCompany = mergedData as Company;
  }

  return {
    success: true,
    company: savedCompany,
    sources,
    totalCost,
    totalDuration: Date.now() - startTime,
  };
}

/**
 * Enrich from a specific provider
 */
async function enrichFromProvider(domain: string, provider: EnrichmentProvider): Promise<ProviderData> {
  const startTime = Date.now();

  switch (provider) {
    case 'Clearbit':
      return enrichFromClearbit(domain, startTime);
    case 'Apollo.io':
      return enrichFromApollo(domain, startTime);
    case 'Hunter.io':
      return enrichFromHunter(domain, startTime);
    case 'Perplexity':
      return enrichFromPerplexity(domain, startTime);
    default:
      return {
        provider,
        data: {},
        confidence: 0,
        dataPoints: [],
        cost: 0,
        duration: Date.now() - startTime,
      };
  }
}

/**
 * Enrich from Clearbit
 */
async function enrichFromClearbit(domain: string, startTime: number): Promise<ProviderData> {
  const apiKey = process.env.CLEARBIT_API_KEY;
  if (!apiKey) {
    return { provider: 'Clearbit', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: 0 };
  }

  try {
    const response = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) throw new Error(`Clearbit error: ${response.status}`);

    const data = await response.json();
    const dataPoints: string[] = [];
    const company: Partial<Company> = {};

    if (data.name) {
      company.name = data.name;
      dataPoints.push('name');
    }
    if (data.description) {
      company.description = data.description;
      dataPoints.push('description');
    }
    if (data.category?.industry) {
      company.industry = data.category.industry;
      dataPoints.push('industry');
    }
    if (data.category?.subIndustry) {
      company.subIndustry = data.category.subIndustry;
      dataPoints.push('subIndustry');
    }
    if (data.metrics?.employees) {
      company.employeeCount = data.metrics.employees;
      company.size = mapEmployeeCountToSize(data.metrics.employees);
      dataPoints.push('employeeCount', 'size');
    }
    if (data.metrics?.estimatedAnnualRevenue) {
      company.revenue = data.metrics.estimatedAnnualRevenue;
      dataPoints.push('revenue');
    }
    if (data.tech) {
      company.techStack = data.tech;
      dataPoints.push('techStack');
    }
    if (data.foundedYear) {
      company.foundedYear = data.foundedYear;
      dataPoints.push('foundedYear');
    }
    if (data.linkedin?.handle) {
      company.linkedinUrl = `https://linkedin.com/company/${data.linkedin.handle}`;
      dataPoints.push('linkedinUrl');
    }
    if (data.twitter?.handle) {
      company.twitterHandle = data.twitter.handle;
      dataPoints.push('twitterHandle');
    }
    if (data.location) {
      company.headquarters = {
        city: data.location.city,
        state: data.location.state,
        country: data.location.country,
        timezone: data.location.timeZone,
      };
      dataPoints.push('headquarters');
    }

    return {
      provider: 'Clearbit',
      data: company,
      confidence: 0.9,
      dataPoints,
      cost: PROVIDER_CONFIGS['Clearbit'].costPerRequest,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Clearbit enrichment failed:', error);
    return { provider: 'Clearbit', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: Date.now() - startTime };
  }
}

/**
 * Enrich from Apollo.io
 */
async function enrichFromApollo(domain: string, startTime: number): Promise<ProviderData> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return { provider: 'Apollo.io', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: 0 };
  }

  try {
    const response = await fetch('https://api.apollo.io/v1/organizations/enrich', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ domain }),
    });

    if (!response.ok) throw new Error(`Apollo error: ${response.status}`);

    const data = await response.json();
    const org = data.organization;
    const dataPoints: string[] = [];
    const company: Partial<Company> = {};

    if (org.name) {
      company.name = org.name;
      dataPoints.push('name');
    }
    if (org.short_description) {
      company.description = org.short_description;
      dataPoints.push('description');
    }
    if (org.industry) {
      company.industry = org.industry;
      dataPoints.push('industry');
    }
    if (org.estimated_num_employees) {
      company.employeeCount = org.estimated_num_employees;
      company.size = mapEmployeeCountToSize(org.estimated_num_employees);
      dataPoints.push('employeeCount', 'size');
    }
    if (org.annual_revenue) {
      company.revenue = formatRevenue(org.annual_revenue);
      dataPoints.push('revenue');
    }
    if (org.founded_year) {
      company.foundedYear = org.founded_year;
      dataPoints.push('foundedYear');
    }
    if (org.linkedin_url) {
      company.linkedinUrl = org.linkedin_url;
      dataPoints.push('linkedinUrl');
    }
    if (org.twitter_url) {
      company.twitterHandle = org.twitter_url.split('/').pop();
      dataPoints.push('twitterHandle');
    }

    // Funding info
    if (org.total_funding || org.latest_funding_round_date) {
      company.funding = {
        totalRaised: org.total_funding ? formatFunding(org.total_funding) : undefined,
        lastRoundDate: org.latest_funding_round_date ? new Date(org.latest_funding_round_date) : undefined,
        stage: org.latest_funding_stage,
      };
      dataPoints.push('funding');
    }

    return {
      provider: 'Apollo.io',
      data: company,
      confidence: 0.85,
      dataPoints,
      cost: PROVIDER_CONFIGS['Apollo.io'].costPerRequest,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Apollo enrichment failed:', error);
    return { provider: 'Apollo.io', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: Date.now() - startTime };
  }
}

/**
 * Enrich from Hunter.io
 */
async function enrichFromHunter(domain: string, startTime: number): Promise<ProviderData> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    return { provider: 'Hunter.io', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: 0 };
  }

  try {
    const response = await fetch(
      `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apiKey}&limit=5`,
      { method: 'GET' }
    );

    if (!response.ok) throw new Error(`Hunter error: ${response.status}`);

    const result = await response.json();
    const data = result.data;
    const dataPoints: string[] = [];
    const company: Partial<Company> = {};

    if (data.organization) {
      company.name = data.organization;
      dataPoints.push('name');
    }
    if (data.country) {
      company.headquarters = { country: data.country };
      dataPoints.push('headquarters');
    }

    // Hunter primarily provides email patterns, not company data
    // The value is in the emails found, which we handle in find-contacts

    return {
      provider: 'Hunter.io',
      data: company,
      confidence: 0.7,
      dataPoints,
      cost: PROVIDER_CONFIGS['Hunter.io'].costPerRequest,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Hunter enrichment failed:', error);
    return { provider: 'Hunter.io', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: Date.now() - startTime };
  }
}

/**
 * Enrich from Perplexity (real-time web search)
 */
async function enrichFromPerplexity(domain: string, startTime: number): Promise<ProviderData> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return { provider: 'Perplexity', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: 0 };
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: `Research the company at ${domain}. Provide:
1. Company name
2. What they do (brief description)
3. Industry
4. Approximate employee count
5. Recent news or funding
6. Main products/services

Return as JSON with keys: name, description, industry, employeeCount, recentNews, products (array)`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Perplexity error: ${response.status}`);

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    const dataPoints: string[] = [];
    const company: Partial<Company> = {};

    // Try to parse JSON from response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        if (parsed.name) {
          company.name = parsed.name;
          dataPoints.push('name');
        }
        if (parsed.description) {
          company.description = parsed.description;
          dataPoints.push('description');
        }
        if (parsed.industry) {
          company.industry = parsed.industry;
          dataPoints.push('industry');
        }
        if (parsed.employeeCount) {
          company.employeeCount = parseInt(parsed.employeeCount);
          company.size = mapEmployeeCountToSize(company.employeeCount);
          dataPoints.push('employeeCount');
        }
        if (parsed.products && Array.isArray(parsed.products)) {
          company.products = parsed.products.map((p: string | Record<string, unknown>) => ({
            name: typeof p === 'string' ? p : p.name,
            description: typeof p === 'string' ? '' : (p.description || ''),
          }));
          dataPoints.push('products');
        }
      }
    } catch {
      // If JSON parsing fails, we still got some data
    }

    return {
      provider: 'Perplexity',
      data: company,
      confidence: 0.6, // Lower confidence for AI-sourced data
      dataPoints,
      cost: PROVIDER_CONFIGS['Perplexity'].costPerRequest,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Perplexity enrichment failed:', error);
    return { provider: 'Perplexity', data: {}, confidence: 0, dataPoints: [], cost: 0, duration: Date.now() - startTime };
  }
}

/**
 * Merge data from multiple providers with conflict resolution
 */
function mergeProviderData(results: ProviderData[], existing?: Company | null): Partial<Company> {
  const merged: Partial<Company> = existing ? { ...existing } : {};

  // Sort by confidence (highest first)
  const sorted = results.sort((a, b) => b.confidence - a.confidence);

  for (const result of sorted) {
    const data = result.data;

    // Only overwrite if no existing value or higher confidence source
    if (data.name && !merged.name) merged.name = data.name;
    if (data.description && !merged.description) merged.description = data.description;
    if (data.industry && !merged.industry) merged.industry = data.industry;
    if (data.subIndustry && !merged.subIndustry) merged.subIndustry = data.subIndustry;
    if (data.size && !merged.size) merged.size = data.size;
    if (data.employeeCount && !merged.employeeCount) merged.employeeCount = data.employeeCount;
    if (data.revenue && !merged.revenue) merged.revenue = data.revenue;
    if (data.foundedYear && !merged.foundedYear) merged.foundedYear = data.foundedYear;
    if (data.linkedinUrl && !merged.linkedinUrl) merged.linkedinUrl = data.linkedinUrl;
    if (data.twitterHandle && !merged.twitterHandle) merged.twitterHandle = data.twitterHandle;

    // Merge arrays
    if (data.techStack && data.techStack.length > 0) {
      merged.techStack = [...new Set([...(merged.techStack || []), ...data.techStack])];
    }

    if (data.products && data.products.length > 0) {
      const existingNames = new Set((merged.products || []).map((p) => p.name.toLowerCase()));
      const newProducts = data.products.filter((p) => !existingNames.has(p.name.toLowerCase()));
      merged.products = [...(merged.products || []), ...newProducts];
    }

    // Merge complex objects
    if (data.funding) {
      merged.funding = { ...(merged.funding || {}), ...data.funding };
    }

    if (data.headquarters) {
      merged.headquarters = { ...(merged.headquarters || {} as Location), ...data.headquarters };
    }
  }

  return merged;
}

/**
 * Helper: Map employee count to size range
 */
function mapEmployeeCountToSize(count: number): Company['size'] {
  if (count <= 10) return '1-10';
  if (count <= 50) return '11-50';
  if (count <= 200) return '51-200';
  if (count <= 500) return '201-500';
  if (count <= 1000) return '501-1000';
  if (count <= 5000) return '1001-5000';
  if (count <= 10000) return '5001-10000';
  return '10000+';
}

/**
 * Helper: Format revenue string
 */
function formatRevenue(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount}`;
}

/**
 * Helper: Format funding string
 */
function formatFunding(amount: number): string {
  return formatRevenue(amount);
}

export default {
  enrichCompanyDeep,
};
