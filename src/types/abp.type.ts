export interface IError {
  code?: number | null;
  message?: string;
  details?: string | null;
  validationErrors?: Array<{
    message: string;
    members: string[];
  }>;
}

export interface IAbpResponse<T> {
  result: T;
  targetUrl?: string | null;
  success: boolean;
  error: IError | null;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
}

export interface IAbpPagedResult<TItem> {
  totalCount: number;
  items: TItem[];
}
