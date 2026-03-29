import React from 'react';
import { useLocation, useRouteError, useNavigate } from 'react-router-dom';
import { IError } from '@/types/abp.type';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

type NotFoundState = {
  status?: number;
  message?: string;
};

const isIError = (v: unknown): v is IError => {
  if (!v || typeof v !== 'object') return false;
  const obj = v as Record<string, unknown>;
  return (
    ('message' in obj && typeof obj.message === 'string') ||
    'details' in obj ||
    'code' in obj
  );
};

type NotFoundViewProps = {
  routeError?: unknown;
};

const getStatusMessage = (routeError: unknown, state: NotFoundState) => {
  if (isIError(routeError)) {
    const code = routeError.code ?? state.status ?? 404;
    const message =
      routeError.message ??
      routeError.details ??
      state.message ??
      'Page not found';
    return { status: code, message };
  }
  const status = state.status ?? 404;
  const message = state.message ?? 'Page not found';
  return { status, message };
};

export const NotFoundErrorElement: React.FC = () => {
  const routeError = useRouteError();
  return <NotFoundView routeError={routeError} />;
};

export const NotFoundView: React.FC<NotFoundViewProps> = ({ routeError }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as NotFoundState;

  const { status, message } = getStatusMessage(routeError, state);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-12">
      <div className="space-y-6 flex flex-col mx-auto w-full p-8 text-center cursor-default">
        <div>
          <h1 className="mt-4 text-8xl font-extrabold tracking-tight text-foreground">
            {status}
          </h1>
        </div>

        <div>
          <h2 className="text-3xl font-semibold">{message}</h2>
          <p className="mt-2 text-muted-foreground">
            Page you are looking for might have been moved, deleted, or you do
            not have access.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            className="hover:bg-transparent"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button variant="default" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" /> Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundView;
