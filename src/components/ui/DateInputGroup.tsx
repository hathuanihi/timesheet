import React from 'react';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/datePicker';

interface StringDateRange {
  from?: string | null;
  to?: string | null;
}

interface DateInputGroupProps {
  value: StringDateRange | undefined;
  onChange: (range: StringDateRange | undefined) => void;
  inputClassName?: string;
  containerClassName?: string;
  startError?: string;
  endError?: string;
}

export const DateInputGroup: React.FC<DateInputGroupProps> = ({
  value,
  onChange,
  inputClassName,
  containerClassName,
  startError,
  endError,
}) => {
  const handleStartDateChange = (date: Date | undefined) => {
    const from = date ? date.toISOString() : undefined;
    onChange({ from, to: value?.to ?? undefined });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    const to = date ? date.toISOString() : undefined;
    onChange({ from: value?.from ?? undefined, to });
  };

  return (
    <div>
      <div
        className={cn(
          'flex flex-wrap items-start gap-2 w-full',
          containerClassName,
        )}
      >
        <div className="w-full sm:flex-1">
          <DatePicker
            value={value?.from ? new Date(value.from) : undefined}
            onChange={handleStartDateChange}
            placeholder="Start date"
            ariaInvalid={!!startError}
            className={cn(
              'w-full sm:flex-1 sm:min-w-[180px] hover:bg-transparent',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              inputClassName,
            )}
            closeOnSelect
            toDate={value?.to ? new Date(value.to) : undefined}
          />
          <div className="h-3 mt-1 text-left">
            {startError && (
              <p className="text-xs text-destructive">{startError}</p>
            )}
          </div>
        </div>

        <div className="w-full sm:flex-1">
          <DatePicker
            value={value?.to ? new Date(value.to) : undefined}
            onChange={handleEndDateChange}
            placeholder="End date"
            ariaInvalid={!!endError}
            className={cn(
              'w-full sm:flex-1 sm:min-w-[180px] hover:bg-transparent',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              inputClassName,
            )}
            closeOnSelect
            fromDate={value?.from ? new Date(value.from) : undefined}
          />
          <div className="h-3 mt-1 text-left">
            {endError && <p className="text-xs text-destructive">{endError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
