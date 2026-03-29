'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { Matcher } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  closeOnSelect?: boolean;
  fromDate?: Date;
  toDate?: Date;
  disabled?: Matcher | Matcher[];
  ariaInvalid?: boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  closeOnSelect = true,
  fromDate,
  toDate,
  disabled,
  ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);

    if (closeOnSelect && date) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          data-empty={!value}
          aria-invalid={ariaInvalid}
          className={cn(
            'w-[240px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground',
            ariaInvalid &&
              'ring-destructive/20 dark:ring-destructive/40 border-destructive',
            className,
          )}
        >
          <CalendarIcon
            className={`mr-2 h-4 w-4 ${ariaInvalid && 'text-destructive'}`}
          />
          {value ? (
            <span>{format(value, 'PPP')}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          fromDate={fromDate}
          toDate={toDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
