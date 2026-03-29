import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getTimeSheetStatisticTasksAPI,
  getTimeSheetStatisticTeamssAPI,
} from '@/services/timesheet.service';
import {
  ITimesheetStatisticTaskResponse,
  ITimesheetStatisticTeamsResponse,
} from '@/types/timesheet.type';
import { RootState } from '@/stores/rootReducer';
import { getErrorMessage } from '@/utils/errorHandler';

export interface TimesheetFetchParams {
  projectId: number;
  startDate: string;
  endDate: string;
}

export interface TimesheetSectionState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  lastParams: TimesheetFetchParams | null;
}

export interface TimesheetState {
  tasks: TimesheetSectionState<ITimesheetStatisticTaskResponse>;
  teams: TimesheetSectionState<ITimesheetStatisticTeamsResponse>;
}

const createSectionState = <T>(): TimesheetSectionState<T> => ({
  items: [],
  loading: false,
  error: null,
  lastParams: null,
});

const initialState: TimesheetState = {
  tasks: createSectionState<ITimesheetStatisticTaskResponse>(),
  teams: createSectionState<ITimesheetStatisticTeamsResponse>(),
};

export const fetchTimesheetTasks = createAsyncThunk<
  ITimesheetStatisticTaskResponse[],
  TimesheetFetchParams,
  { state: RootState }
>(
  'timesheet/fetchTasks',
  async ({ projectId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const res = await getTimeSheetStatisticTasksAPI(
        projectId,
        startDate,
        endDate,
      );
      return res ?? [];
    } catch (e) {
      return rejectWithValue(
        getErrorMessage(e, 'Failed to load task statistics'),
      );
    }
  },
);

export const fetchTimesheetTeams = createAsyncThunk<
  ITimesheetStatisticTeamsResponse[],
  TimesheetFetchParams,
  { state: RootState }
>(
  'timesheet/fetchTeams',
  async ({ projectId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const res = await getTimeSheetStatisticTeamssAPI(
        projectId,
        startDate,
        endDate,
      );
      return res ?? [];
    } catch (e) {
      return rejectWithValue(
        getErrorMessage(e, 'Failed to load team statistics'),
      );
    }
  },
);

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    clearTimesheet(state) {
      state.tasks = createSectionState<ITimesheetStatisticTaskResponse>();
      state.teams = createSectionState<ITimesheetStatisticTeamsResponse>();
    },
  },
  extraReducers: (builder) => {
    builder
      // Tasks
      .addCase(fetchTimesheetTasks.pending, (state, action) => {
        state.tasks.loading = true;
        state.tasks.error = null;
        state.tasks.lastParams = action.meta.arg;
      })
      .addCase(fetchTimesheetTasks.fulfilled, (state, action) => {
        state.tasks.loading = false;
        state.tasks.items = action.payload;
      })
      .addCase(fetchTimesheetTasks.rejected, (state, action) => {
        state.tasks.loading = false;
        state.tasks.error = (action.payload as string) ?? 'Failed to load';
      })
      // Teams
      .addCase(fetchTimesheetTeams.pending, (state, action) => {
        state.teams.loading = true;
        state.teams.error = null;
        state.teams.lastParams = action.meta.arg;
      })
      .addCase(fetchTimesheetTeams.fulfilled, (state, action) => {
        state.teams.loading = false;
        state.teams.items = action.payload;
      })
      .addCase(fetchTimesheetTeams.rejected, (state, action) => {
        state.teams.loading = false;
        state.teams.error = (action.payload as string) ?? 'Failed to load';
      });
  },
});

export const { clearTimesheet } = timesheetSlice.actions;
export default timesheetSlice.reducer;
