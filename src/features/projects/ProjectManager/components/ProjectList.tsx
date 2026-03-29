import React from 'react';
import { ProjectItems } from './ProjectItems';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IProjectResponse } from '@/types/project.type';
import { IError } from '@/types/abp.type';

type Props = {
  projects: IProjectResponse[];
  error: IError | null;
};

export const ProjectList: React.FC<Props> = ({ projects, error }) => {
  return (
    <section className="relative space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error.details || error.message || 'An error occurred'}
          </AlertDescription>
        </Alert>
      )}

      {!error &&
        (projects.length > 0 ? (
          <ProjectItems projects={projects} />
        ) : (
          <div className="p-4 text-muted-foreground">
            No projects to display.
          </div>
        ))}
    </section>
  );
};

export default ProjectList;
