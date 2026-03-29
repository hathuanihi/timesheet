import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimeRange, TimeFilterType } from '@/hooks/useTimeRange';
import { TIME_RANGE_OPTIONS, TABS_PROJECT_VIEW } from '@/constants/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateInputGroup } from '@/components/ui/DateInputGroup';
import { TasksTab } from './TasksTab';
import { TeamTab } from './TeamTab';

export type ViewProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
  projectId?: number;
};

export const ViewProjectModal: React.FC<ViewProjectModalProps> = ({
  open,
  onOpenChange,
  projectName,
  projectId,
}) => {
  const [tab, setTab] = useState<(typeof TABS_PROJECT_VIEW)[number]['id']>('tasks');

  const {
    filterType,
    setFilterType,
    start,
    end,
    startDate,
    endDate,
    label,
    isNavigable,
    goToPrev,
    goToNext,
    setCustomDateRange,
  } = useTimeRange({ initialFilterType: 'week' });

  const handleFilterTypeChange = useCallback(
    (newTimeFilterType: TimeFilterType) => {
      if (newTimeFilterType === 'custom') {
        setCustomDateRange({ from: start, to: end });
      } else {
        setFilterType(newTimeFilterType);
      }
    },
    [start, end, setFilterType, setCustomDateRange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl lg:max-w-2xl h-[90vh] px-4 py-4 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {projectName ? `Project: ${projectName}` : 'Project Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 w-full flex flex-col mt-4">
          <div className="space-y-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 w-full">
              <div className="flex flex-col sm:flex-row flex-1 min-w-0 items-stretch sm:items-center gap-2 sm:gap-4">
                <div className="flex w-full sm:w-auto min-w-0 items-center gap-2 rounded-lg border bg-background px-2 sm:px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Button
                      aria-label="Previous"
                      onClick={goToPrev}
                      variant="outline"
                      size="icon"
                      className="text-muted-foreground hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={!isNavigable}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      aria-label="Next"
                      onClick={goToNext}
                      variant="outline"
                      size="icon"
                      className="text-muted-foreground hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={!isNavigable}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mx-2 h-6 w-px bg-border flex-shrink-0" />
                  <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:gap-2 cursor-default min-w-0 w-[210px] h-[32px] max-h-[32px]">
                    <div className="truncate text-xs font-medium leading-tight sm:text-base min-w-0 w-full h-[50px] max-h-[50px] flex items-center">
                      {label}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full sm:w-auto items-center gap-2 rounded-lg border bg-background px-2 sm:px-3 py-2 justify-between sm:justify-start min-w-0">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  Time Range:
                </span>
                <Select
                  value={filterType}
                  onValueChange={handleFilterTypeChange}
                >
                  <SelectTrigger className="h-auto w-full sm:w-auto min-w-0 sm:min-w-[120px] border-0 p-0 shadow-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_RANGE_OPTIONS.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filterType === 'custom' && (
              <div className="w-full">
                <DateInputGroup
                  value={{
                    from: start?.toISOString(),
                    to: end?.toISOString(),
                  }}
                  onChange={(range) =>
                    setCustomDateRange({
                      from: range?.from ? new Date(range.from) : undefined,
                      to: range?.to ? new Date(range.to) : undefined,
                    })
                  }
                  containerClassName="w-full"
                />
              </div>
            )}

            <div className="border-b flex items-center gap-4 sm:gap-6">
              {TABS_PROJECT_VIEW.map((tabInfo) => (
                <button
                  key={tabInfo.id}
                  className={cn(
                    'px-2 sm:px-3 py-2 text-sm -mb-px border-b-2 whitespace-nowrap shrink-0 cursor-pointer',
                    tab === tabInfo.id
                      ? 'border-primary font-medium text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setTab(tabInfo.id)}
                >
                  {tabInfo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-4 pr-1">
            {tab === 'tasks' ? (
              <TasksTab
                projectId={projectId ?? 0}
                startDate={startDate}
                endDate={endDate}
              />
            ) : (
              <TeamTab
                projectId={projectId ?? 0}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};