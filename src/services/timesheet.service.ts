import axiosInstance from '@/utils/axiosInstance';
import {
  ITimesheetStatisticTaskResponse,
  ITimesheetStatisticTeamsResponse,
} from '@/types/timesheet.type';
import { toIError } from '@/utils/errorHandler';
import { IAbpResponse } from '@/types/abp.type';

const BASE = '/services/app/TimeSheetProject';

export async function getTimeSheetStatisticTasksAPI(
  projectId: number,
  startDate: string,
  endDate: string,
): Promise<ITimesheetStatisticTaskResponse[]> {
  try {
    const response = await axiosInstance.get<
      IAbpResponse<ITimesheetStatisticTaskResponse[]>
    >(`${BASE}/GetTimeSheetStatisticTasks`, {
      params: {
        projectId,
        startDate,
        endDate,
      },
    });
    return response.data.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve timesheet statistics for tasks');
  }
}

export async function getTimeSheetStatisticTeamssAPI(
  projectId: number,
  startDate: string,
  endDate: string,
): Promise<ITimesheetStatisticTeamsResponse[]> {
  try {
    const response = await axiosInstance.get<
      IAbpResponse<ITimesheetStatisticTeamsResponse[]>
    >(`${BASE}/GetTimeSheetStatisticTeams`, {
      params: {
        projectId,
        startDate,
        endDate,
      },
    });
    return response.data.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve timesheet statistics for teams');
  }
}
