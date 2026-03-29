import { RootState } from '@/stores/rootReducer';

export const selectTimesheetTasks = (state: RootState) =>
  state.timesheet.tasks.items;
export const selectTimesheetTasksLoading = (state: RootState) =>
  state.timesheet.tasks.loading;
export const selectTimesheetTasksError = (state: RootState) =>
  state.timesheet.tasks.error;

export const selectTimesheetTeams = (state: RootState) =>
  state.timesheet.teams.items;
export const selectTimesheetTeamsLoading = (state: RootState) =>
  state.timesheet.teams.loading;
export const selectTimesheetTeamsError = (state: RootState) =>
  state.timesheet.teams.error;
