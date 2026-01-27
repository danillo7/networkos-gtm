/**
 * NetworkOS - Pipeline Manager Component
 * Kanban-style opportunity pipeline with drag & drop
 */

'use client';

import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Building2,
  GripVertical,
  MoreHorizontal,
  Plus,
  Calendar,
  DollarSign,
  User,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { Opportunity, OpportunityStage, Company, Contact } from '@/api/lib/types';

// Pipeline stages configuration
const PIPELINE_STAGES: Array<{
  id: OpportunityStage;
  label: string;
  color: string;
  description: string;
}> = [
  {
    id: 'New Lead',
    label: 'New Leads',
    color: 'bg-blue-100 text-blue-800',
    description: 'Fresh leads to research',
  },
  {
    id: 'Researching',
    label: 'Researching',
    color: 'bg-purple-100 text-purple-800',
    description: 'Currently being enriched',
  },
  {
    id: 'Outreach Started',
    label: 'Outreach',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Initial contact made',
  },
  {
    id: 'Engaged',
    label: 'Engaged',
    color: 'bg-green-100 text-green-800',
    description: 'Active conversation',
  },
  {
    id: 'Meeting Scheduled',
    label: 'Meeting',
    color: 'bg-teal-100 text-teal-800',
    description: 'Demo or call booked',
  },
  {
    id: 'Demo Done',
    label: 'Demo Done',
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Product shown',
  },
  {
    id: 'Proposal Sent',
    label: 'Proposal',
    color: 'bg-orange-100 text-orange-800',
    description: 'Awaiting decision',
  },
  {
    id: 'Negotiation',
    label: 'Negotiation',
    color: 'bg-pink-100 text-pink-800',
    description: 'Terms discussion',
  },
];

interface PipelineManagerProps {
  opportunities: OpportunityWithDetails[];
  onStageChange: (opportunityId: string, newStage: OpportunityStage) => Promise<void>;
  onOpportunityClick?: (opportunity: OpportunityWithDetails) => void;
  onAddLead?: () => void;
  isLoading?: boolean;
}

interface OpportunityWithDetails extends Opportunity {
  company: Company;
  contact?: Contact;
}

export function PipelineManager({
  opportunities,
  onStageChange,
  onOpportunityClick,
  onAddLead,
  isLoading = false,
}: PipelineManagerProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [localOpportunities, setLocalOpportunities] = React.useState(opportunities);

  React.useEffect(() => {
    setLocalOpportunities(opportunities);
  }, [opportunities]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeOpp = localOpportunities.find((o) => o.id === active.id);
    const overStage = over.id as OpportunityStage;

    if (activeOpp && activeOpp.stage !== overStage && PIPELINE_STAGES.some((s) => s.id === overStage)) {
      // Optimistic update
      setLocalOpportunities((prev) =>
        prev.map((o) => (o.id === active.id ? { ...o, stage: overStage } : o))
      );

      try {
        await onStageChange(active.id as string, overStage);
      } catch (error) {
        // Revert on error
        setLocalOpportunities(opportunities);
      }
    }
  };

  const activeOpportunity = activeId
    ? localOpportunities.find((o) => o.id === activeId)
    : null;

  const getOpportunitiesForStage = (stage: OpportunityStage) =>
    localOpportunities.filter((o) => o.stage === stage);

  const getTotalValue = (stage: OpportunityStage) => {
    const opps = getOpportunitiesForStage(stage);
    return opps.reduce((sum, o) => sum + (o.value || 0), 0);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Pipeline</h2>
          <p className="text-sm text-muted-foreground">
            {localOpportunities.length} opportunities in pipeline
          </p>
        </div>
        <Button onClick={onAddLead}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              opportunities={getOpportunitiesForStage(stage.id)}
              totalValue={getTotalValue(stage.id)}
              onOpportunityClick={onOpportunityClick}
              isLoading={isLoading}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOpportunity && (
            <OpportunityCard
              opportunity={activeOpportunity}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Pipeline Column Component
interface PipelineColumnProps {
  stage: (typeof PIPELINE_STAGES)[0];
  opportunities: OpportunityWithDetails[];
  totalValue: number;
  onOpportunityClick?: (opportunity: OpportunityWithDetails) => void;
  isLoading?: boolean;
}

function PipelineColumn({
  stage,
  opportunities,
  totalValue,
  onOpportunityClick,
  isLoading,
}: PipelineColumnProps) {
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: { type: 'column' },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-72"
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className={cn('text-xs', stage.color)}>
              {stage.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {opportunities.length}
            </span>
          </div>
          {totalValue > 0 && (
            <p className="text-sm text-muted-foreground">
              ${totalValue.toLocaleString()}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-2 min-h-[200px]">
          <SortableContext
            items={opportunities.map((o) => o.id)}
            strategy={verticalListSortingStrategy}
          >
            {opportunities.map((opportunity) => (
              <SortableOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onClick={() => onOpportunityClick?.(opportunity)}
              />
            ))}
          </SortableContext>

          {opportunities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">{stage.description}</p>
              <p className="text-xs mt-1">Drop leads here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Sortable Opportunity Card Wrapper
interface SortableOpportunityCardProps {
  opportunity: OpportunityWithDetails;
  onClick?: () => void;
}

function SortableOpportunityCard({ opportunity, onClick }: SortableOpportunityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <OpportunityCard
        opportunity={opportunity}
        isDragging={isDragging}
        onClick={onClick}
        dragListeners={listeners}
      />
    </div>
  );
}

// Opportunity Card Component
interface OpportunityCardProps {
  opportunity: OpportunityWithDetails;
  isDragging?: boolean;
  onClick?: () => void;
  dragListeners?: Record<string, unknown>;
}

function OpportunityCard({
  opportunity,
  isDragging,
  onClick,
  dragListeners,
}: OpportunityCardProps) {
  const score = opportunity.company.aiScore?.overall;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isDragging && 'opacity-50 shadow-lg rotate-2'
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {dragListeners && (
            <button
              {...dragListeners}
              className="mt-1 cursor-grab touch-none"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium truncate">
                {opportunity.company.name}
              </span>
            </div>

            {opportunity.contact && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="truncate">{opportunity.contact.fullName}</span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              {score !== undefined && (
                <Badge
                  variant={score >= 70 ? 'success' : score >= 40 ? 'warning' : 'secondary'}
                  className="text-xs"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  {score}
                </Badge>
              )}

              {opportunity.value && (
                <Badge variant="outline" className="text-xs">
                  <DollarSign className="mr-1 h-3 w-3" />
                  {opportunity.value.toLocaleString()}
                </Badge>
              )}
            </div>

            {opportunity.expectedCloseDate && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon-sm" className="flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PipelineManager;
