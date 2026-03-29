import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectFilter } from './components/ProjectFilter';
import { ProjectList } from './components/ProjectList';
import Loading from '@/components/ui/loading';
import { fetchProjects } from '@/stores/slices/projectSlice';
import type { AppDispatch } from '@/stores/store';
import {
  selectProjects,
  selectProjectError,
  selectProjectIsLoading,
  selectProjectQuery,
  selectProjectFilterStatus,
} from '@/stores/selectors/projectSelectors';

export const ProjectManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectIsLoading);
  const error = useSelector(selectProjectError);
  const query = useSelector(selectProjectQuery);
  const filterStatus = useSelector(selectProjectFilterStatus);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, query, filterStatus]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="sticky top-0 z-20 bg-white pt-4 pb-2">
        <ProjectFilter />
      </div>

      <ProjectList projects={projects} error={error} />

      {loading && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
};
