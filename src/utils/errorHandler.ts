import { IError } from '@/types/abp.type';

export const toIError = (err: unknown, fallback: string): IError => {
  let code: number | null = null;

  if (err && typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;

    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (typeof response.status === 'number') {
        code = response.status;
      }
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (data.error) {
          const errorData = data.error as IError;
          return { ...errorData, code };
        }
      }
    }

    if (errorObj.error) {
      return { ...(errorObj.error as IError), code };
    }

    if (typeof errorObj.message === 'string') {
      return {
        code,
        message: errorObj.message,
        details: errorObj.details ?? null,
      } as IError;
    }
  }

  return { code: null, message: fallback, details: null } as IError;
};

export const getErrorMessage = (e: unknown, fallback: string): string => {
  const err = toIError(e, fallback);
  return (err.details || err.message || fallback) as string;
};
