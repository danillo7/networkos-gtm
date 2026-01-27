/**
 * NetworkOS - Company Card Component
 * Displays company information with AI score and quick actions
 */

'use client';

import * as React from 'react';
import {
  Building2,
  Users,
  Globe,
  Linkedin,
  ExternalLink,
  Sparkles,
  Mail,
  Phone,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress, ScoreDisplay } from '@/components/ui/progress';
import { cn } from '@/utils/cn';
import type { Company, AIScore } from '@/api/lib/types';

interface CompanyCardProps {
  company: Company;
  onEnrich?: (company: Company) => void;
  onGeneratePitch?: (company: Company) => void;
  onFindContacts?: (company: Company) => void;
  onViewDetails?: (company: Company) => void;
  isLoading?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function CompanyCard({
  company,
  onEnrich,
  onGeneratePitch,
  onFindContacts,
  onViewDetails,
  isLoading = false,
  variant = 'default',
}: CompanyCardProps) {
  const [showActions, setShowActions] = React.useState(false);

  const score = company.aiScore?.overall ?? 0;
  const hasScore = company.aiScore !== undefined;

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { variant: 'success' as const, label: 'High Fit' };
    if (score >= 40) return { variant: 'warning' as const, label: 'Medium Fit' };
    return { variant: 'destructive' as const, label: 'Low Fit' };
  };

  const scoreBadge = getScoreBadge(score);

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isLoading && 'opacity-50'
        )}
        onClick={() => onViewDetails?.(company)}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{company.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {company.industry} - {company.size}
            </p>
          </div>
          {hasScore && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{score}</span>
              <Badge variant={scoreBadge.variant} className="text-xs">
                {scoreBadge.label}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        isLoading && 'opacity-50'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {company.name}
                {company.linkedinUrl && (
                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-3 w-3" />
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {company.domain}
                </a>
              </div>
            </div>
          </div>

          {hasScore && (
            <div className="text-right">
              <ScoreDisplay score={score} label="AI Score" size="sm" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{company.industry}</Badge>
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            {company.size}
          </Badge>
          {company.funding?.stage && (
            <Badge variant="info">{company.funding.stage}</Badge>
          )}
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {company.description}
          </p>
        )}

        {/* Score Breakdown */}
        {hasScore && company.aiScore && variant === 'detailed' && (
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <h4 className="text-sm font-medium">Score Breakdown</h4>
            <div className="grid gap-2">
              <ScoreRow label="Company Fit" value={company.aiScore.companyFit} />
              <ScoreRow label="Voice AI Opportunity" value={company.aiScore.voiceAIOpportunity} />
              <ScoreRow label="Timing Signals" value={company.aiScore.timingSignals} />
              <ScoreRow label="Budget Indicators" value={company.aiScore.budgetIndicators} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Confidence: {company.aiScore.confidence}%
            </p>
          </div>
        )}

        {/* Tech Stack */}
        {company.techStack && company.techStack.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium text-muted-foreground">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1">
              {company.techStack.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {company.techStack.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{company.techStack.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEnrich?.(company)}
            disabled={isLoading}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Enrich
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onFindContacts?.(company)}
            disabled={isLoading}
          >
            <Users className="mr-1 h-3 w-3" />
            Find Contacts
          </Button>
          <Button
            size="sm"
            onClick={() => onGeneratePitch?.(company)}
            disabled={isLoading}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            Generate Pitch
          </Button>
        </div>

        {/* Last Enriched */}
        {company.lastEnriched && (
          <p className="text-xs text-muted-foreground">
            Last enriched: {new Date(company.lastEnriched).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Score row helper component
function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex-1 text-xs">{label}</span>
      <Progress value={value} className="w-24" size="sm" />
      <span className="w-8 text-right text-xs font-medium">{value}</span>
    </div>
  );
}

export default CompanyCard;
