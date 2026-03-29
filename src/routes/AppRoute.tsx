import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { MainLayout } from '@/components/layouts/MainLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import NotFoundPage, { NotFoundErrorElement } from '@/pages/NotFoundPage';
import { ProjectManager } from '@/features/projects/ProjectManager';
import { General } from '@/features/projects/ProjectForm/General';
import { Team } from '@/features/projects/ProjectForm/Team';
import { Tasks } from '@/features/projects/ProjectForm/Tasks';
import { Notifications } from '@/features/projects/ProjectForm/Notifications';
import { ProjectForm } from '@/features/projects/ProjectForm';
import { getProjectByIdAPI } from '@/services/project.service';
import { getAllTasksAPI } from '@/services/task.service';
import { getAllUsersAPI } from '@/services/user.service';
import { mapApiResponseToFormData } from '@/helpers/projectSliceHelpers';
import { toIError } from '@/utils/errorHandler';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: (
          <MainLayout>
            <ProjectManager />
          </MainLayout>
        ),
      },
      {
        path: '/general',
        element: (
          <MainLayout>
            <ProjectForm />
          </MainLayout>
        ),
        children: [{ index: true, element: <General /> }],
      },
      {
        path: '/team',
        element: (
          <MainLayout>
            <ProjectForm />
          </MainLayout>
        ),
        children: [{ index: true, element: <Team /> }],
      },
      {
        path: '/tasks',
        element: (
          <MainLayout>
            <ProjectForm />
          </MainLayout>
        ),
        children: [{ index: true, element: <Tasks /> }],
      },
      {
        path: '/notification',
        element: (
          <MainLayout>
            <ProjectForm />
          </MainLayout>
        ),
        children: [{ index: true, element: <Notifications /> }],
      },
      {
        path: ':projectId',
        element: (
          <MainLayout>
            <ProjectForm />
          </MainLayout>
        ),
        loader: async ({ params }) => {
          console.log('[loader] project loader start', params);
          const id = Number(params.projectId);
          if (!id || Number.isNaN(id)) {
            throw new Response('Not Found', { status: 404 });
          }
          try {
            const [projectData, allTasks, allUsers] = await Promise.all([
              getProjectByIdAPI(id),
              getAllTasksAPI(),
              getAllUsersAPI(),
            ]);
            console.log('[loader] apis resolved', {
              project: !!projectData,
              tasks: Array.isArray(allTasks) ? allTasks.length : allTasks,
              users: Array.isArray(allUsers) ? allUsers.length : allUsers,
            });
            return mapApiResponseToFormData(projectData, allTasks, allUsers);
          } catch (e) {
            console.log('[loader] error', e);
            const err = toIError(e, 'Failed to load project');
            if (err.code === 404) {
              throw new Response('Not Found', { status: 404 });
            }
            throw e;
          }
        },
        errorElement: <NotFoundErrorElement />,
        children: [
          { path: 'general', element: <General /> },
          { path: 'team', element: <Team /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'notification', element: <Notifications /> },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  { path: '/not-found', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export const AppRoute: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
