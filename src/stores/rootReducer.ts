import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import timesheetReducer from './slices/timesheetSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  timesheet: timesheetReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
