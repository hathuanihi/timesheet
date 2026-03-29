import { useMemo, useState, useCallback } from 'react';
import {
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfQuarter,
  endOfQuarter,
  addQuarters,
  startOfYear,
  endOfYear,
  addYears,
} from 'date-fns';
import { formatDateRangeByPattern, toISODate } from '@/utils/formatDate';
import {
  DATE_LABEL_PATTERN,
  WEEK_STARTS_ON,
  TIME_RANGE_OPTIONS,
} from '@/constants/constants';

export type TimeFilterType = (typeof TIME_RANGE_OPTIONS)[number]['key'];

interface UseTimeRangeProps {
  initialFilterType?: TimeFilterType;
  initialAnchor?: Date;
  initialCustomRange?: { from?: Date; to?: Date };
}

const periodCalculators = {
  day: {
    getStart: startOfDay,
    getEnd: endOfDay,
    add: addDays,
  },
  week: {
    getStart: (date: Date) =>
      startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
    getEnd: (date: Date) => endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
    add: addWeeks,
  },
  month: {
    getStart: startOfMonth,
    getEnd: endOfMonth,
    add: addMonths,
  },
  quarter: {
    getStart: startOfQuarter,
    getEnd: endOfQuarter,
    add: addQuarters,
  },
  year: {
    getStart: startOfYear,
    getEnd: endOfYear,
    add: addYears,
  },
};

const navigableKinds: TimeFilterType[] = [
  'day',
  'week',
  'month',
  'quarter',
  'year',
];

export const useTimeRange = ({
  initialFilterType = 'week',
  initialAnchor = new Date(),
  initialCustomRange = {},
}: UseTimeRangeProps = {}) => {
  const [filterType, setFilterType] =
    useState<TimeFilterType>(initialFilterType);
  const [anchor, setAnchor] = useState<Date>(initialAnchor);
  const [customRange, setCustomRangeState] = useState(initialCustomRange);

  const timeRange = useMemo(() => {
    let start: Date | undefined;
    let end: Date | undefined;
    let label: string;

    switch (filterType) {
      case 'all':
        start = undefined;
        end = undefined;
        label = 'All Time';
        break;

      case 'custom':
        start = customRange.from ? startOfDay(customRange.from) : undefined;
        end = customRange.to ? endOfDay(customRange.to) : undefined;
        label =
          start && end
            ? formatDateRangeByPattern(start, end, DATE_LABEL_PATTERN)
            : 'Custom Time';
        break;

      default:
        if (filterType in periodCalculators) {
          const calculator =
            periodCalculators[filterType as keyof typeof periodCalculators];
          start = calculator.getStart(anchor);
          end = calculator.getEnd(anchor);
          label = formatDateRangeByPattern(start, end, DATE_LABEL_PATTERN);
        } else {
          start = undefined;
          end = undefined;
          label = 'Invalid Range';
        }
        break;
    }

    return {
      start,
      end,
      label,
      startDate: start ? toISODate(start) : undefined,
      endDate: end ? toISODate(end) : undefined,
    };
  }, [anchor, filterType, customRange]);

  const isNavigable = useMemo(
    () => navigableKinds.includes(filterType),
    [filterType],
  );

  const navigate = useCallback(
    (direction: 1 | -1) => {
      if (isNavigable) {
        const calculator =
          periodCalculators[filterType as keyof typeof periodCalculators];
        setAnchor((prevAnchor) => calculator.add(prevAnchor, direction));
      }
    },
    [filterType, isNavigable],
  );

  const goToPrev = useCallback(() => navigate(-1), [navigate]);
  const goToNext = useCallback(() => navigate(1), [navigate]);

  const setCustomDateRange = useCallback(
    (range: { from?: Date; to?: Date }) => {
      setFilterType('custom');

      if (range.from && range.to && range.from > range.to) {
        setCustomRangeState({ from: range.to, to: range.from });
      } else {
        setCustomRangeState(range);
      }
    },
    [],
  );

  return {
    filterType,
    setFilterType,
    ...timeRange,
    isNavigable,
    goToPrev,
    goToNext,
    setCustomDateRange,
  };
};
