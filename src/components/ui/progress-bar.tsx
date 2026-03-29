import React from 'react';
import { cn } from '@/lib/utils';

type ProgressBarProps = {
  value: number;
  className?: string;
  heightClassName?: string;
  colorClassName?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  heightClassName = 'h-2',
  colorClassName = 'bg-emerald-500',
}) => {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div
      className={cn(
        'w-full rounded-full overflow-hidden bg-gray-300',
        heightClassName,
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
    >
      <div
        className={cn('h-full transition-all', colorClassName)}
        style={{ width: `${v}%` }}
      />
    </div>
  );
};

export default ProgressBar;
