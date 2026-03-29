import React, { useCallback, useEffect } from 'react';
import Loading from '@/components/ui/loading';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { fetchTimesheetTeams } from '@/stores/slices/timesheetSlice';
import {
  selectTimesheetTeams,
  selectTimesheetTeamsError,
  selectTimesheetTeamsLoading,
} from '@/stores/selectors/timesheetSelectors';
import { getErrorMessage } from '@/utils/errorHandler';
import ProgressBar from '@/components/ui/progress-bar';
import { minutesToHoursLabel } from '@/utils/formatDate';
import { useStats } from '@/hooks/useStats';

type TeamTabProps = {
  projectId: number;
  startDate: string | undefined;
  endDate: string | undefined;
};

export const TeamTab: React.FC<TeamTabProps> = ({
  projectId,
  startDate,
  endDate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectTimesheetTeams);
  const { totalMin, billMin, percentage, rows } = useStats(items, {
    getId: (item) => item.userID,
    getName: (item) => item.userName,
    getTotalMinutes: (item) => item.totalWorkingTime,
    getBillableMinutes: (item) => item.billableWorkingTime,
  });
  const loading = useSelector(selectTimesheetTeamsLoading);
  const error = useSelector(selectTimesheetTeamsError);

  const pid = projectId ?? 0;

  const load = useCallback(async () => {
    if (!pid) return;
    try {
      await dispatch(
        fetchTimesheetTeams({
          projectId: pid,
          startDate: startDate || '',
          endDate: endDate || '',
        }),
      ).unwrap();
    } catch (e) {
      console.error(getErrorMessage(e, 'Failed to load team stats'));
    }
  }, [pid, startDate, endDate, dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-3">
      {loading && (
        <div className="py-6 flex justify-center">
          <Loading size="md" />
        </div>
      )}
      {error && <div className="text-destructive text-sm">{error}</div>}

      {!loading && !error && (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-3">Member</th>
                  <th className="py-2 pr-3">Total Hours</th>
                  <th className="py-2 pr-3">Billable Hours</th>
                  <th className="py-2 pr-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t bg-muted/40">
                  <td className="py-3 pr-3 font-medium">Total</td>
                  <td className="py-3 pr-3">{minutesToHoursLabel(totalMin)}</td>
                  <td className="py-3 pr-3">
                    <>
                      {minutesToHoursLabel(billMin)}{' '}
                      <span className="text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </>
                  </td>
                  <td className="py-3 pr-3">
                    <ProgressBar value={percentage} />
                  </td>
                </tr>

                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-muted-foreground">
                      No data
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-2 pr-3">{row.name}</td>
                      <td className="py-2 pr-3">
                        {minutesToHoursLabel(row.totalMin)}
                      </td>
                      <td className="py-2 pr-3">
                        {minutesToHoursLabel(row.billMin)}{' '}
                        <span className="text-muted-foreground">
                          ({row.pct}%)
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        <ProgressBar value={row.pct} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
