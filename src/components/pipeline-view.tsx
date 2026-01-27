/**
 * Pipeline View Component
 * Kanban-style pipeline management
 */

'use client';

import * as React from 'react';
import {
  Building2,
  DollarSign,
  User,
  Calendar,
  MoreHorizontal,
  Plus,
  Zap,
  ArrowRight,
  GripVertical,
  ChevronDown,
  Check,
  X,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Pipeline stages configuration
const PIPELINE_STAGES = [
  { id: 'new', name: 'New Lead', color: 'bg-blue-500' },
  { id: 'outreach', name: 'Outreach', color: 'bg-purple-500' },
  { id: 'engaged', name: 'Engaged', color: 'bg-yellow-500' },
  { id: 'demo', name: 'Demo', color: 'bg-orange-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-pink-500' },
  { id: 'closed', name: 'Closed Won', color: 'bg-green-500' },
];

// Sample opportunities data
const SAMPLE_OPPORTUNITIES = [
  {
    id: '1',
    company: { name: 'TechCorp Inc', domain: 'techcorp.com' },
    contact: { name: 'Sarah Chen', title: 'CTO' },
    value: 50000,
    stage: 'new',
    aiScore: 92,
    probability: 75,
    lastActivity: '2 hours ago',
    nextStep: 'Send initial pitch',
  },
  {
    id: '2',
    company: { name: 'DataFlow Systems', domain: 'dataflow.io' },
    contact: { name: 'Mike Johnson', title: 'VP Engineering' },
    value: 120000,
    stage: 'outreach',
    aiScore: 85,
    probability: 60,
    lastActivity: '1 day ago',
    nextStep: 'Follow up on email',
  },
  {
    id: '3',
    company: { name: 'AI Startup Co', domain: 'aistartup.com' },
    contact: { name: 'Emily Davis', title: 'CEO' },
    value: 200000,
    stage: 'engaged',
    aiScore: 88,
    probability: 70,
    lastActivity: '3 hours ago',
    nextStep: 'Schedule demo call',
  },
  {
    id: '4',
    company: { name: 'Acme Corp', domain: 'acme.com' },
    contact: { name: 'John Smith', title: 'CTO' },
    value: 85000,
    stage: 'demo',
    aiScore: 78,
    probability: 80,
    lastActivity: '1 day ago',
    nextStep: 'Send proposal',
  },
  {
    id: '5',
    company: { name: 'CloudInc', domain: 'cloudinc.io' },
    contact: { name: 'Lisa Wang', title: 'VP Product' },
    value: 75000,
    stage: 'new',
    aiScore: 72,
    probability: 45,
    lastActivity: '5 days ago',
    nextStep: 'Research company',
  },
  {
    id: '6',
    company: { name: 'MediaCo', domain: 'media.co' },
    contact: { name: 'Alex Brown', title: 'Head of Engineering' },
    value: 95000,
    stage: 'outreach',
    aiScore: 81,
    probability: 55,
    lastActivity: '2 days ago',
    nextStep: 'LinkedIn connection request',
  },
  {
    id: '7',
    company: { name: 'Enterprise Solutions', domain: 'enterprise.com' },
    contact: { name: 'Robert Kim', title: 'CIO' },
    value: 350000,
    stage: 'proposal',
    aiScore: 91,
    probability: 85,
    lastActivity: '4 hours ago',
    nextStep: 'Review contract terms',
  },
];

interface Opportunity {
  id: string;
  company: { name: string; domain: string };
  contact: { name: string; title: string };
  value: number;
  stage: string;
  aiScore: number;
  probability: number;
  lastActivity: string;
  nextStep: string;
}

export function PipelineView() {
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>(SAMPLE_OPPORTUNITIES);
  const [draggedItem, setDraggedItem] = React.useState<Opportunity | null>(null);
  const [dragOverStage, setDragOverStage] = React.useState<string | null>(null);

  // Calculate stage totals
  const stageTotals = React.useMemo(() => {
    const totals: Record<string, { count: number; value: number }> = {};
    PIPELINE_STAGES.forEach(stage => {
      const stageOpps = opportunities.filter(o => o.stage === stage.id);
      totals[stage.id] = {
        count: stageOpps.length,
        value: stageOpps.reduce((sum, o) => sum + o.value, 0),
      };
    });
    return totals;
  }, [opportunities]);

  // Calculate total pipeline value
  const totalPipelineValue = React.useMemo(() => {
    return opportunities.reduce((sum, o) => sum + o.value, 0);
  }, [opportunities]);

  // Calculate weighted pipeline
  const weightedPipelineValue = React.useMemo(() => {
    return opportunities.reduce((sum, o) => sum + (o.value * o.probability / 100), 0);
  }, [opportunities]);

  // Drag handlers
  const handleDragStart = (opp: Opportunity) => {
    setDraggedItem(opp);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (stageId: string) => {
    if (draggedItem && draggedItem.stage !== stageId) {
      setOpportunities(prev =>
        prev.map(o =>
          o.id === draggedItem.id ? { ...o, stage: stageId } : o
        )
      );
    }
    setDraggedItem(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverStage(null);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Pipeline</h2>
          <p className="text-sm text-white/50">
            {opportunities.length} opportunities • {formatCurrency(totalPipelineValue)} total value
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Opportunity
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Total Pipeline</p>
              <p className="text-xl font-semibold text-white">{formatCurrency(totalPipelineValue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Weighted Pipeline</p>
              <p className="text-xl font-semibold text-white">{formatCurrency(weightedPipelineValue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Avg AI Score</p>
              <p className="text-xl font-semibold text-white">
                {Math.round(opportunities.reduce((sum, o) => sum + o.aiScore, 0) / opportunities.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              'flex-shrink-0 w-72 rounded-xl border transition-colors',
              dragOverStage === stage.id
                ? 'bg-white/10 border-purple-500/50'
                : 'bg-white/[0.02] border-white/10'
            )}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(stage.id)}
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn('h-3 w-3 rounded-full', stage.color)} />
                  <h3 className="text-sm font-medium text-white">{stage.name}</h3>
                </div>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                  {stageTotals[stage.id]?.count || 0}
                </span>
              </div>
              <p className="text-sm text-white/50">
                {formatCurrency(stageTotals[stage.id]?.value || 0)}
              </p>
            </div>

            {/* Stage Cards */}
            <div className="p-2 space-y-2 min-h-[400px]">
              {opportunities
                .filter(o => o.stage === stage.id)
                .map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isDragging={draggedItem?.id === opp.id}
                    onDragStart={() => handleDragStart(opp)}
                    onDragEnd={handleDragEnd}
                    formatCurrency={formatCurrency}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Opportunity Card Component
function OpportunityCard({
  opportunity,
  isDragging,
  onDragStart,
  onDragEnd,
  formatCurrency,
}: {
  opportunity: Opportunity;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  formatCurrency: (value: number) => string;
}) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'p-3 rounded-xl bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing transition-all hover:bg-white/[0.07]',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">
            {opportunity.company.name}
          </h4>
          <p className="text-xs text-white/50 truncate">
            {opportunity.contact.name} • {opportunity.contact.title}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-white/40" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-10 w-32 rounded-lg bg-[#1c1c1e] border border-white/10 shadow-xl py-1">
              <button className="w-full px-3 py-1.5 text-left text-sm text-white/70 hover:bg-white/10">
                Edit
              </button>
              <button className="w-full px-3 py-1.5 text-left text-sm text-white/70 hover:bg-white/10">
                View Details
              </button>
              <button className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-white/10">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Value & Score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-white">
          {formatCurrency(opportunity.value)}
        </span>
        <div className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium',
          opportunity.aiScore >= 80
            ? 'bg-green-500/20 text-green-400'
            : opportunity.aiScore >= 60
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        )}>
          <Zap className="h-3 w-3" />
          {opportunity.aiScore}
        </div>
      </div>

      {/* Probability Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/50">Probability</span>
          <span className="text-white/70">{opportunity.probability}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              opportunity.probability >= 70
                ? 'bg-green-400'
                : opportunity.probability >= 40
                ? 'bg-yellow-400'
                : 'bg-red-400'
            )}
            style={{ width: `${opportunity.probability}%` }}
          />
        </div>
      </div>

      {/* Next Step */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs">
        <ArrowRight className="h-3 w-3 text-purple-400 shrink-0" />
        <span className="text-white/60 truncate">{opportunity.nextStep}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1 text-xs text-white/40">
          <Clock className="h-3 w-3" />
          {opportunity.lastActivity}
        </div>
        <GripVertical className="h-4 w-4 text-white/20" />
      </div>
    </div>
  );
}

export default PipelineView;
