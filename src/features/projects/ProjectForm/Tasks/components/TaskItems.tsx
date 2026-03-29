import React from 'react';
import { ITaskResponse } from '@/types/task.type';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TASK_STATUS_CONFIG } from '@/constants/constants';

type Props = {
  task: ITaskResponse;
  onSelect?: (task: ITaskResponse) => void;
  selectedMode?: boolean;
  onRemove?: (taskId: number) => void;
  onUnselect?: (task: ITaskResponse) => void;
  isSelected?: boolean;
};

export const TaskItems: React.FC<Props> = ({
  task,
  onSelect,
  selectedMode = false,
  onRemove,
  isSelected = false,
  onUnselect,
}) => {
  const clickable = Boolean(onSelect) && !selectedMode;
  const statusInfo = TASK_STATUS_CONFIG[String(task.isDeleted)];

  const handleClick = () => {
    if (!clickable) return;
    if (isSelected) onUnselect?.(task);
    else onSelect?.(task);
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove?.(task.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <li
      className={cn(
        'flex items-center gap-4 p-3 rounded-md border transition-colors',
        isSelected && !selectedMode
          ? 'bg-sky-50 border-sky-200 hover:bg-sky-100'
          : 'border-gray-200 hover:bg-gray-50',
        clickable ? 'cursor-pointer' : 'cursor-default',
      )}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
    >
      {isSelected && !selectedMode && (
        <Check className="h-5 w-5 text-green-600 shrink-0" />
      )}
      {selectedMode && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleRemoveClick}
          aria-label={`Remove ${task.name}`}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{task.name}</div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-full border',
            statusInfo.className,
          )}
        >
          {statusInfo.label}
        </span>
      </div>
    </li>
  );
};
