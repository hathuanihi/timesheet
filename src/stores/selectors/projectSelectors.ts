import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/stores/rootReducer';

export const selectProjectState = (state: RootState) => state.project;
export const selectProjects = createSelector(
  [selectProjectState],
  (project) => project.items,
);
export const selectProjectById = (projectId: number | undefined) =>
  createSelector([selectProjects], (projects) =>
    projects.find((project) => project.id === projectId),
  );
export const selectProjectForm = createSelector(
  [selectProjectState],
  (project) => project.form,
);
export const selectProjectFilters = createSelector(
  [selectProjectState],
  (project) => project.filters,
);
export const selectProjectQuery = createSelector(
  [selectProjectFilters],
  (filters) => filters.query,
);
export const selectProjectFilterStatus = createSelector(
  [selectProjectFilters],
  (filters) => filters.status,
);
export const selectProjectStatus = createSelector(
  [selectProjectState],
  (project) => project.status,
);
export const selectProjectError = createSelector(
  [selectProjectState],
  (project) => project.error,
);
export const selectProjectIsLoading = createSelector(
  [selectProjectStatus],
  (status) => status === 'loading',
);

export const selectProjectQuantities = createSelector(
  [selectProjectState],
  (project) => project.quantities,
);
