import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PROJECT_TYPE_CONFIG } from '@/constants/constants';

type Props = {
  value?: number;
  onChange?: (value?: number) => void;
  className?: string;
  disabled?: boolean;
};

export const ProjectTypeSelect: React.FC<Props> = ({
  value,
  onChange,
  className,
  disabled,
}) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4', className)}>
      {Object.entries(PROJECT_TYPE_CONFIG).map(([id, config]) => {
        const typeId = Number(id);
        const selected = value === typeId;

        return (
          <Button
            key={typeId}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(typeId)}
            className={cn(
              'w-full rounded-md border px-4 py-2 text-center font-semibold cursor-pointer transition-all',
              selected
                ? config.className
                : 'bg-transparent text-gray-700 hover:bg-gray-50',
            )}
          >
            {config.name}
          </Button>
        );
      })}
    </div>
  );
};

export default ProjectTypeSelect;
