import axiosInstance from '@/utils/axiosInstance';
import { setItem } from '@/utils/localStorage';
import { IUser } from '@/types/user.type';
import {
  IAuthenticateRequest,
  IAuthenticateResult,
  IGetCurrentLoginInformationsResponse,
} from '@/types/auth.type';
import { toIError } from '@/utils/errorHandler';

export async function loginAPI(payload: IAuthenticateRequest): Promise<string> {
  try {
    const { data: auth } = await axiosInstance.post<IAuthenticateResult>(
      '/TokenAuth/Authenticate',
      payload,
    );
    if (!auth?.success || !auth?.result?.accessToken) {
      throw (
        auth?.error ?? {
          message: 'Login failed',
          details: auth?.error?.details ?? null,
        }
      );
    }
    const token = auth.result.accessToken;
    setItem('access_token', token);
    return token;
  } catch (e) {
    throw toIError(e, 'Login failed');
  }
}

export async function fetchCurrentUserAPI(): Promise<IUser> {
  try {
    const { data: info } =
      await axiosInstance.get<IGetCurrentLoginInformationsResponse>(
        '/services/app/Session/GetCurrentLoginInformations',
      );
    if (!info?.success || !info?.result?.user) {
      throw (
        info?.error ?? {
          message: 'Could not retrieve user information',
          details: info?.error?.message ?? null,
        }
      );
    }
    return info.result.user;
  } catch (e) {
    throw toIError(e, 'Could not retrieve user information');
  }
}

export const authService = {
  loginAPI,
  fetchCurrentUserAPI,
};
