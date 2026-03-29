import { useMemo } from 'react';
import { percent } from '@/utils/formatDate';

export interface UseStatsOptions<T> {
  getId: (item: T) => string | number;
  getName: (item: T) => string;
  getTotalMinutes: (item: T) => number | undefined;
  getBillableMinutes: (item: T) => number | undefined;
}

export function useStats<T>(items: T[], opts: UseStatsOptions<T>) {
  const { getId, getName, getTotalMinutes, getBillableMinutes } = opts;

  return useMemo(() => {
    const totalMin = items.reduce(
      (acc, it) => acc + (getTotalMinutes(it) || 0),
      0,
    );
    const billMin = items.reduce(
      (acc, it) => acc + (getBillableMinutes(it) || 0),
      0,
    );
    const percentage = percent(totalMin, billMin);

    const rows = items.map((it) => {
      const t = getTotalMinutes(it) || 0;
      const b = getBillableMinutes(it) || 0;
      return {
        id: getId(it),
        name: getName(it),
        totalMin: t,
        billMin: b,
        pct: percent(t, b),
      } as const;
    });

    return {
      totalMin,
      billMin,
      percentage,
      rows,
    } as const;
  }, [items, getId, getName, getTotalMinutes, getBillableMinutes]);
}
