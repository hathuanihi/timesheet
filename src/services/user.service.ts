import axiosInstance from '@/utils/axiosInstance';
import { IUserResponse } from '@/types/user.type';
import { toIError } from '@/utils/errorHandler';
import { IAbpResponse } from '@/types/abp.type';

const BASE = '/services/app/User';

export async function getAllUsersAPI(): Promise<IUserResponse[]> {
  try {
    const response = await axiosInstance.get<IAbpResponse<IUserResponse[]>>(
      `${BASE}/GetUserNotPagging`,
    );
    return response.data.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve users');
  }
}
