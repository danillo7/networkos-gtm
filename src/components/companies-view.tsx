/**
 * Companies View Component
 * List companies with AI Enrich functionality
 */

'use client';

import * as React from 'react';
import {
  Building2,
  Globe,
  Users,
  Zap,
  Search,
  Plus,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useResearchCompany, useScoreOpportunity } from '@/hooks/useApi';

// Sample companies data (would come from Supabase in production)
const SAMPLE_COMPANIES = [
  {
    id: '1',
    name: 'TechCorp Inc',
    domain: 'techcorp.com',
    industry: 'Technology',
    size: '201-500',
    description: 'Enterprise software solutions for modern businesses',
    techStack: ['React', 'Node.js', 'AWS'],
    aiScore: { overall: 85, companyFit: 88, voiceAIOpportunity: 82 },
    lastEnriched: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'MediaFlow',
    domain: 'mediaflow.io',
    industry: 'Media & Entertainment',
    size: '51-200',
    description: 'Streaming platform for content creators',
    techStack: ['Python', 'GCP', 'Kubernetes'],
    aiScore: { overall: 92, companyFit: 95, voiceAIOpportunity: 90 },
    lastEnriched: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'EduLearn',
    domain: 'edulearn.com',
    industry: 'E-Learning',
    size: '11-50',
    description: 'Online education platform for professionals',
    techStack: ['Vue.js', 'Django', 'Azure'],
    aiScore: null,
    lastEnriched: null,
  },
];

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  description?: string;
  techStack?: string[];
  aiScore?: { overall: number; companyFit: number; voiceAIOpportunity: number } | null;
  lastEnriched?: Date | null;
}

export function CompaniesView() {
  const [companies, setCompanies] = React.useState<Company[]>(SAMPLE_COMPANIES);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [showEnrichModal, setShowEnrichModal] = React.useState(false);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-theme">Companies</h2>
          <p className="text-sm text-theme-secondary">
            {companies.length} companies in your pipeline
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-tertiary" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full"
          />
        </div>
        <select className="h-10 rounded-xl bg-theme-tertiary border border-theme px-4 text-sm text-theme">
          <option value="">All Industries</option>
          <option value="technology">Technology</option>
          <option value="media">Media & Entertainment</option>
          <option value="elearning">E-Learning</option>
        </select>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onEnrich={() => {
              setSelectedCompany(company);
              setShowEnrichModal(true);
            }}
          />
        ))}
      </div>

      {/* Enrich Modal */}
      {showEnrichModal && selectedCompany && (
        <EnrichModal
          company={selectedCompany}
          onClose={() => {
            setShowEnrichModal(false);
            setSelectedCompany(null);
          }}
          onEnriched={(enrichedCompany) => {
            setCompanies((prev) =>
              prev.map((c) => (c.id === enrichedCompany.id ? enrichedCompany : c))
            );
          }}
        />
      )}
    </div>
  );
}

// Company Card Component
function CompanyCard({
  company,
  onEnrich,
}: {
  company: Company;
  onEnrich: () => void;
}) {
  return (
    <div className="glass-card p-5 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl icon-bg-blue icon-color-blue">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-theme group-hover:text-blue-400 transition-colors">
              {company.name}
            </h3>
            <a
              href={`https://${company.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-theme-secondary hover:text-theme-secondary flex items-center gap-1"
            >
              {company.domain}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        {company.aiScore && (
          <AIScoreBadge score={company.aiScore.overall} />
        )}
      </div>

      {/* Description */}
      {company.description && (
        <p className="text-sm text-theme-secondary mb-4 line-clamp-2">
          {company.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-primary">
          {company.industry}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-theme-tertiary text-theme-secondary">
          <Users className="mr-1 h-3 w-3" />
          {company.size}
        </span>
      </div>

      {/* Tech Stack */}
      {company.techStack && company.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {company.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded bg-theme-tertiary text-theme-secondary"
            >
              {tech}
            </span>
          ))}
          {company.techStack.length > 3 && (
            <span className="text-xs px-2 py-0.5 text-theme-tertiary">
              +{company.techStack.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-theme">
        {company.lastEnriched ? (
          <span className="text-xs text-theme-tertiary flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Enriched {new Date(company.lastEnriched).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-xs text-orange-400/80 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Not enriched
          </span>
        )}
        <button
          onClick={onEnrich}
          className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          AI Enrich
        </button>
      </div>
    </div>
  );
}

// AI Score Badge
function AIScoreBadge({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'score-high border-green-500/30';
    if (s >= 60) return 'score-medium border-yellow-500/30';
    return 'score-low border-red-500/30';
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium border',
        getScoreColor(score)
      )}
    >
      <Zap className="h-3.5 w-3.5" />
      {score}
    </div>
  );
}

// Enrich Modal Component
function EnrichModal({
  company,
  onClose,
  onEnriched,
}: {
  company: Company;
  onClose: () => void;
  onEnriched: (company: Company) => void;
}) {
  const { data, loading, error, research } = useResearchCompany();
  const { score } = useScoreOpportunity();
  const [step, setStep] = React.useState<'idle' | 'researching' | 'scoring' | 'complete'>('idle');

  const handleEnrich = async () => {
    setStep('researching');
    const researchResult = await research(company.domain, 'standard');

    if (researchResult) {
      setStep('scoring');
      const scoreResult = await score(researchResult.company);

      if (scoreResult) {
        setStep('complete');
        onEnriched({
          ...company,
          ...researchResult.company,
          aiScore: {
            overall: scoreResult.score.overall,
            companyFit: scoreResult.score.companyFit,
            voiceAIOpportunity: scoreResult.score.voiceAIOpportunity,
          },
          lastEnriched: new Date(),
        } as Company);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 glass-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme">
          <div>
            <h2 className="text-xl font-semibold text-theme flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Enrich
            </h2>
            <p className="text-sm text-theme-secondary mt-1">{company.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-theme-tertiary transition-colors"
          >
            <X className="h-5 w-5 text-theme-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'idle' && (
            <div className="text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg mx-auto mb-4">
                <Building2 className="h-8 w-8 text-theme" />
              </div>
              <h3 className="text-lg font-semibold text-theme mb-2">
                Enrich {company.name}
              </h3>
              <p className="text-theme-secondary text-sm mb-6 max-w-md mx-auto">
                AI will research this company to find detailed information,
                identify voice AI opportunities, and calculate a fit score.
              </p>
              <button onClick={handleEnrich} className="btn-primary px-8">
                <Sparkles className="mr-2 h-4 w-4" />
                Start AI Research
              </button>
            </div>
          )}

          {(step === 'researching' || step === 'scoring') && (
            <div className="py-8">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-purple-400 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-theme mb-2">
                  {step === 'researching' ? 'Researching Company...' : 'Calculating Score...'}
                </h3>
                <p className="text-theme-secondary text-sm">
                  {step === 'researching'
                    ? 'Analyzing products, tech stack, and voice AI opportunities'
                    : 'Evaluating company fit and scoring the opportunity'}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className={cn('flex items-center gap-2', step === 'researching' ? 'text-purple-400' : 'text-green-400')}>
                  {step === 'researching' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="text-sm">Research</span>
                </div>
                <ChevronRight className="h-4 w-4 text-theme-tertiary" />
                <div className={cn('flex items-center gap-2', step === 'scoring' ? 'text-purple-400' : 'text-theme-tertiary')}>
                  {step === 'scoring' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-current" />
                  )}
                  <span className="text-sm">Score</span>
                </div>
              </div>
            </div>
          )}

          {step === 'complete' && data && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <Check className="h-5 w-5" />
                <span className="font-medium">Research Complete</span>
              </div>

              {/* Company Overview */}
              <div className="glass-card p-4">
                <h4 className="text-sm font-medium text-theme mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Overview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-theme-secondary">Industry</span>
                    <p className="text-theme">{(data.company as Record<string, unknown>).industry as string || company.industry}</p>
                  </div>
                  <div>
                    <span className="text-theme-secondary">Size</span>
                    <p className="text-theme">{(data.company as Record<string, unknown>).size as string || company.size}</p>
                  </div>
                </div>
              </div>

              {/* Voice AI Opportunities */}
              {data.voiceAIOpportunities && data.voiceAIOpportunities.length > 0 && (
                <div className="glass-card p-4">
                  <h4 className="text-sm font-medium text-theme mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    Voice AI Opportunities
                    <span className="badge-primary ml-auto">{data.voiceAIOpportunities.length} found</span>
                  </h4>
                  <div className="space-y-2">
                    {data.voiceAIOpportunities.slice(0, 3).map((opp: unknown, i: number) => {
                      const opportunity = opp as { area: string; potentialImpact: string; description: string };
                      return (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <TrendingUp className={cn(
                            'h-4 w-4 mt-0.5',
                            opportunity.potentialImpact === 'High' ? 'text-green-400' : 'text-yellow-400'
                          )} />
                          <div>
                            <span className="text-theme">{opportunity.area}</span>
                            <span className={cn(
                              'ml-2 text-xs',
                              opportunity.potentialImpact === 'High' ? 'text-green-400' : 'text-yellow-400'
                            )}>
                              ({opportunity.potentialImpact} impact)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Timing Signals */}
              {data.signals && data.signals.length > 0 && (
                <div className="glass-card p-4">
                  <h4 className="text-sm font-medium text-theme mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    Timing Signals
                    <span className="badge-primary ml-auto">{data.signals.length} detected</span>
                  </h4>
                  <div className="space-y-2">
                    {data.signals.slice(0, 3).map((signal: unknown, i: number) => {
                      const sig = signal as { type: string; description: string };
                      return (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2" />
                          <span className="text-theme">{sig.description || sig.type}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button onClick={onClose} className="btn-primary">
                  Done
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-theme mb-2">Research Failed</h3>
              <p className="text-theme-secondary text-sm mb-4">{error}</p>
              <button onClick={handleEnrich} className="btn-primary">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompaniesView;
