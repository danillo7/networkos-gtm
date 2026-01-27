/**
 * AI Insights Panel Component
 * Displays AI-generated insights and recommendations
 */

'use client';

import * as React from 'react';
import {
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Loader2,
  Calendar,
  Phone,
  Mail,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useOrchestrate } from '@/hooks/useApi';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'action' | 'timing' | 'trend';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    onClick?: () => void;
  }>;
  metadata?: Record<string, string | number>;
}

// Sample insights for demo
const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'warning',
    priority: 'high',
    title: '3 high-score leads need attention',
    description: 'TechCorp, DataFlow, and AIStart have AI scores above 85 but haven\'t been contacted in 7+ days.',
    actions: [
      { label: 'View Leads' },
      { label: 'Generate Outreach Plan' },
    ],
    metadata: {
      leads: 3,
      avgScore: 87,
    },
  },
  {
    id: '2',
    type: 'timing',
    priority: 'high',
    title: 'Best time to reach TechCorp',
    description: 'Based on engagement patterns, Sarah Chen (CTO) is most responsive on Tuesday mornings between 9-11 AM PST.',
    actions: [
      { label: 'Schedule Call' },
      { label: 'Send Email Now' },
    ],
    metadata: {
      contact: 'Sarah Chen',
      company: 'TechCorp',
    },
  },
  {
    id: '3',
    type: 'opportunity',
    priority: 'medium',
    title: 'DataFlow shows strong timing signals',
    description: 'Recent job postings for audio engineers and funding announcement suggest high Voice AI opportunity.',
    actions: [
      { label: 'Research Now' },
      { label: 'Generate Pitch' },
    ],
    metadata: {
      signals: 4,
      fitScore: 91,
    },
  },
  {
    id: '4',
    type: 'trend',
    priority: 'medium',
    title: 'Pipeline velocity improving',
    description: 'Average deal cycle time decreased by 15% this month. Demo-to-proposal conversion rate is up 8%.',
    actions: [
      { label: 'View Analytics' },
    ],
    metadata: {
      improvement: '15%',
      conversion: '8%',
    },
  },
  {
    id: '5',
    type: 'action',
    priority: 'low',
    title: 'Follow up on 5 pending proposals',
    description: 'Proposals sent more than 3 days ago without response. Consider scheduling follow-up calls.',
    actions: [
      { label: 'View Proposals' },
      { label: 'Auto-Generate Follow-ups' },
    ],
    metadata: {
      proposals: 5,
      avgDays: 4,
    },
  },
];

interface AIInsightsPanelProps {
  compact?: boolean;
  maxInsights?: number;
  onNavigate?: (destination: string) => void;
}

export function AIInsightsPanel({
  compact = false,
  maxInsights = 5,
  onNavigate,
}: AIInsightsPanelProps) {
  const [insights, setInsights] = React.useState<Insight[]>(SAMPLE_INSIGHTS.slice(0, maxInsights));
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const { orchestrate, loading } = useOrchestrate();

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Call orchestrator for new insights
    const result = await orchestrate({
      type: 'quick',
      options: { includeInsights: true },
    });

    // For now, just shuffle sample insights to simulate refresh
    setInsights(prev => [...prev].sort(() => Math.random() - 0.5));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Target className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'action':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'text-green-400 bg-green-500/20';
      case 'warning':
        return 'text-orange-400 bg-orange-500/20';
      case 'action':
        return 'text-blue-400 bg-blue-500/20';
      case 'timing':
        return 'text-purple-400 bg-purple-500/20';
      case 'trend':
        return 'text-cyan-400 bg-cyan-500/20';
      default:
        return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (compact) {
    return (
      <div className="glass-card p-4 glow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-white text-sm">AI Insights</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
              {insights.filter(i => i.priority === 'high').length} urgent
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
          >
            <RefreshCw className={cn('h-4 w-4', (isRefreshing || loading) && 'animate-spin')} />
          </button>
        </div>

        <div className="space-y-2">
          {insights.slice(0, 3).map((insight) => (
            <div
              key={insight.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className={cn('h-2 w-2 rounded-full', getPriorityColor(insight.priority))} />
              <span className="text-xs text-white/80 truncate flex-1">{insight.title}</span>
              <ChevronRight className="h-3 w-3 text-white/40" />
            </div>
          ))}
        </div>

        {insights.length > 3 && (
          <button className="w-full mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors">
            View all {insights.length} insights →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-6 glow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            <p className="text-xs text-white/50">
              Last updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw className={cn('h-4 w-4', (isRefreshing || loading) && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {(isRefreshing || loading) && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-white/60">Analyzing your pipeline...</p>
          </div>
        </div>
      )}

      {/* Insights List */}
      {!isRefreshing && !loading && (
        <div className="space-y-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {/* Generate Action Plan CTA */}
      {!isRefreshing && !loading && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">
                Based on these insights, generate a comprehensive action plan
              </p>
            </div>
            <button className="btn-primary text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Action Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Insight Card
function InsightCard({
  insight,
  onNavigate,
}: {
  insight: Insight;
  onNavigate?: (destination: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Target className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'action':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getInsightColors = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return { icon: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
      case 'warning':
        return { icon: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
      case 'action':
        return { icon: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
      case 'timing':
        return { icon: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' };
      case 'trend':
        return { icon: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' };
      default:
        return { icon: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    }
  };

  const colors = getInsightColors(insight.type);

  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all cursor-pointer',
        colors.bg,
        colors.border,
        'hover:bg-white/[0.07]'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        {/* Priority Indicator */}
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
          colors.bg,
          colors.icon
        )}>
          {getInsightIcon(insight.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-white text-sm">{insight.title}</h4>
            {insight.priority === 'high' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase">
                Urgent
              </span>
            )}
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {insight.description}
          </p>

          {/* Expanded Content */}
          {expanded && (
            <div className="mt-4 space-y-3">
              {/* Metadata */}
              {insight.metadata && (
                <div className="flex flex-wrap gap-3">
                  {Object.entries(insight.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs">
                      <span className="text-white/40 capitalize">{key}:</span>
                      <span className="text-white/80 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {insight.actions && insight.actions.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  {insight.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                      }}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-lg transition-colors',
                        index === 0
                          ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand Indicator */}
        <ChevronRight
          className={cn(
            'h-4 w-4 text-white/40 transition-transform shrink-0',
            expanded && 'rotate-90'
          )}
        />
      </div>
    </div>
  );
}

// Quick Insights Widget (for sidebar or small spaces)
export function QuickInsightsWidget({ onViewAll }: { onViewAll?: () => void }) {
  const urgentCount = 2;
  const totalCount = 5;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">AI Insights</p>
          <p className="text-xs text-white/50">{urgentCount} urgent, {totalCount} total</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="text-white/70 truncate">3 high-score leads need attention</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          <span className="text-white/70 truncate">Best time to reach TechCorp</span>
        </div>
      </div>

      <button
        onClick={onViewAll}
        className="w-full text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-1"
      >
        View all insights <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

export default AIInsightsPanel;
