import React, { useMemo } from 'react';
import { ProjectDropdown } from './ProjectDropdown';
import { IProjectResponse } from '@/types/project.type';
import { formatDateRangeByLocale, formatDate } from '@/utils/formatDate';
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_TYPE_CONFIG,
  BADGE_FALLBACK_CLASS,
} from '@/constants/constants';

interface ProjectItemsProps {
  projects: IProjectResponse[];
}
const PmsDisplay: React.FC<{ pms: string[] }> = ({ pms }) => {
  if (pms.length === 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 truncate">
        No PM
      </span>
    );
  }
  const text =
    pms.length > 2 ? `${pms.slice(0, 2).join(', ')}, ...` : pms.join(', ');
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 truncate"
      title={pms.join(', ')}
    >
      {text}
    </span>
  );
};

export const ProjectItems: React.FC<ProjectItemsProps> = ({ projects }) => {
  const projectsByCustomer = useMemo(() => {
    const grouped = projects.reduce(
      (acc, project) => {
        const customerName = project.customerName.trim();
        if (!acc[customerName]) {
          acc[customerName] = [];
        }
        acc[customerName].push(project);
        return acc;
      },
      {} as Record<string, IProjectResponse[]>,
    );

    return Object.entries(grouped).map(([customerName, projects]) => ({
      customerName,
      projects,
    }));
  }, [projects]);

  return (
    <div className="space-y-6">
      {projectsByCustomer.map((customerGroup, idx) => (
        <div key={customerGroup.customerName}>
          <div className="rounded-xl bg-gradient-to-r from-primary to-cyan-700 text-white px-3 sm:px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-semibold">
                {idx + 1}
              </div>
              <h3 className="text-sm sm:text-base font-semibold truncate max-w-[50vw] sm:max-w-[60vw]">
                {customerGroup.customerName}
              </h3>
            </div>
            <span className="text-xs sm:text-sm bg-white/15 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              {customerGroup.projects.length} Project
              {customerGroup.projects.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {customerGroup.projects.map((project) => {
              const statusInfo =
                project.status === 0
                  ? PROJECT_STATUS_CONFIG[0]
                  : PROJECT_STATUS_CONFIG[1];
              const typeInfo = PROJECT_TYPE_CONFIG[project.projectType] ?? {
                code: 'UNK',
                className: BADGE_FALLBACK_CLASS,
              };

              return (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-white rounded-lg border"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.code}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <PmsDisplay pms={project.pms ?? []} />
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        {project.activeMember} members
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeInfo.className}`}
                      >
                        {typeInfo.code}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {project.timeEnd
                          ? formatDateRangeByLocale(project.timeStart, project.timeEnd)
                          : formatDate(project.timeStart)}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 sm:ml-4">
                    <ProjectDropdown
                      projectId={project.id}
                      status={project.status ? 0 : 1}
                      projectName={project.name}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
