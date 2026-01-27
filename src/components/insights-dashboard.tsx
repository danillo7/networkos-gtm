/**
 * NetworkOS - Insights Dashboard Component
 * Analytics and metrics visualization
 */

'use client';

import * as React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Mail,
  Target,
  DollarSign,
  Clock,
  Sparkles,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/cn';
import type { DashboardMetrics, UrgentAction, Activity as ActivityType } from '@/api/lib/types';

interface InsightsDashboardProps {
  metrics: DashboardMetrics;
  onActionClick?: (action: UrgentAction) => void;
  onViewAll?: (section: 'companies' | 'contacts' | 'opportunities' | 'activity') => void;
  isLoading?: boolean;
}

export function InsightsDashboard({
  metrics,
  onActionClick,
  onViewAll,
  isLoading = false,
}: InsightsDashboardProps) {
  return (
    <div className={cn('space-y-6', isLoading && 'opacity-50 pointer-events-none')}>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Companies"
          value={metrics.totalCompanies}
          icon={<Building2 className="h-4 w-4" />}
          trend={metrics.weekOverWeekGrowth.companies}
          onClick={() => onViewAll?.('companies')}
        />
        <MetricCard
          title="Contacts"
          value={metrics.totalContacts}
          icon={<Users className="h-4 w-4" />}
          trend={metrics.weekOverWeekGrowth.contacts}
          onClick={() => onViewAll?.('contacts')}
        />
        <MetricCard
          title="Active Sequences"
          value={metrics.activeSequences}
          icon={<Mail className="h-4 w-4" />}
          onClick={() => onViewAll?.('opportunities')}
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(metrics.pipelineValue / 1000).toFixed(0)}K`}
          icon={<DollarSign className="h-4 w-4" />}
          trend={metrics.weekOverWeekGrowth.opportunities}
          onClick={() => onViewAll?.('opportunities')}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Average AI Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.averageAIScore}</div>
            <Progress value={metrics.averageAIScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.averageAIScore >= 70
                ? 'Excellent lead quality'
                : metrics.averageAIScore >= 50
                  ? 'Good lead quality'
                  : 'Consider refining targeting'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Enrichment Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(metrics.enrichmentSuccessRate * 100).toFixed(0)}%
            </div>
            <Progress value={metrics.enrichmentSuccessRate * 100} className="mt-2" variant="success" />
            <p className="text-xs text-muted-foreground mt-2">
              Data enrichment completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              Pitch Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(metrics.pitchEngagementRate * 100).toFixed(0)}%
            </div>
            <Progress value={metrics.pitchEngagementRate * 100} className="mt-2" variant="default" />
            <p className="text-xs text-muted-foreground mt-2">
              Reply and open rate combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Actions & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Urgent Actions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                Urgent Actions
              </CardTitle>
              <Badge variant="destructive">{metrics.urgentActions.length}</Badge>
            </div>
            <CardDescription>Tasks requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.urgentActions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No urgent actions at this time
              </p>
            ) : (
              metrics.urgentActions.slice(0, 5).map((action, index) => (
                <UrgentActionCard
                  key={index}
                  action={action}
                  onClick={() => onActionClick?.(action)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onViewAll?.('activity')}>
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            ) : (
              metrics.recentActivity.slice(0, 5).map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Automated analysis of your pipeline and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <InsightCard
              title="Top Performing Industry"
              value="Media & Entertainment"
              description="75% higher conversion rate"
              trend="up"
            />
            <InsightCard
              title="Best Pitch Type"
              value="Technical emails"
              description="2.3x more replies"
              trend="up"
            />
            <InsightCard
              title="Optimal Send Time"
              value="Tuesday 10am"
              description="Based on open rates"
              trend="neutral"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  onClick?: () => void;
}

function MetricCard({ title, value, icon, trend, onClick }: MetricCardProps) {
  return (
    <Card
      className={cn('cursor-pointer transition-all hover:shadow-md', onClick && 'hover:border-primary')}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center text-xs mt-1">
            {trend >= 0 ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+{trend}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500">{trend}%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Urgent Action Card Component
interface UrgentActionCardProps {
  action: UrgentAction;
  onClick?: () => void;
}

function UrgentActionCard({ action, onClick }: UrgentActionCardProps) {
  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-blue-500 bg-blue-50',
  };

  const typeIcons = {
    follow_up_due: <Clock className="h-4 w-4" />,
    high_score_lead: <Sparkles className="h-4 w-4" />,
    reply_received: <Mail className="h-4 w-4" />,
    meeting_soon: <Users className="h-4 w-4" />,
  };

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 p-3 cursor-pointer transition-all hover:shadow-sm',
        priorityColors[action.priority]
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-muted-foreground">
          {typeIcons[action.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{action.message}</p>
          {action.dueAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Due: {new Date(action.dueAt).toLocaleString()}
            </p>
          )}
        </div>
        <Badge variant={action.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
          {action.priority}
        </Badge>
      </div>
    </div>
  );
}

// Activity Card Component
interface ActivityCardProps {
  activity: ActivityType;
}

function ActivityCard({ activity }: ActivityCardProps) {
  const typeIcons: Record<string, React.ReactNode> = {
    'Email Sent': <Mail className="h-4 w-4 text-blue-500" />,
    'Email Received': <Mail className="h-4 w-4 text-green-500" />,
    'Call Made': <Users className="h-4 w-4 text-purple-500" />,
    'Meeting': <Users className="h-4 w-4 text-teal-500" />,
    'LinkedIn': <Users className="h-4 w-4 text-blue-700" />,
    'Note Added': <Activity className="h-4 w-4 text-gray-500" />,
    'Stage Changed': <Target className="h-4 w-4 text-orange-500" />,
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">
        {typeIcons[activity.type] || <Activity className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{activity.description}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Insight Card Component
interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

function InsightCard({ title, value, description, trend }: InsightCardProps) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

export default InsightsDashboard;
