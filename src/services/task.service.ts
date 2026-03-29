import axiosInstance from '@/utils/axiosInstance';
import { ITaskResponse } from '@/types/task.type';
import { IAbpResponse } from '@/types/abp.type';
import { toIError } from '@/utils/errorHandler';

const BASE = '/services/app/Task';

export async function getAllTasksAPI(): Promise<ITaskResponse[]> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<ITaskResponse[]>
    >(`${BASE}/GetAll`);
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve task list');
  }
}
