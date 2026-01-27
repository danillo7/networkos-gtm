/**
 * NetworkOS - Progress UI Component
 * Progress bars and score indicators
 */

import * as React from 'react';
import { cn } from '@/utils/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      showValue = false,
      size = 'default',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
      sm: 'h-1',
      default: 'h-2',
      lg: 'h-3',
    };

    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    };

    // Auto variant based on value
    const autoVariant = () => {
      if (variant !== 'default') return variantClasses[variant];
      if (percentage >= 70) return 'bg-green-500';
      if (percentage >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className={cn('w-full', className)} {...props}>
        <div
          ref={ref}
          className={cn(
            'w-full overflow-hidden rounded-full bg-secondary',
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              autoVariant()
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <span className="mt-1 text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

// Score display component
interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: 'sm' | 'default' | 'lg';
  showBar?: boolean;
}

export function ScoreDisplay({
  score,
  label,
  size = 'default',
  showBar = true,
}: ScoreDisplayProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    default: 'text-4xl',
    lg: 'text-6xl',
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={cn('font-bold', sizeClasses[size], getScoreColor(score))}>
        {score}
      </span>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      {showBar && <Progress value={score} className="w-full max-w-[120px]" />}
    </div>
  );
}

export { Progress };
