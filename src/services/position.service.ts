import axiosInstance from '@/utils/axiosInstance';
import { IPositionResponse } from '@/types/position.type';
import { IAbpResponse } from '@/types/abp.type';
import { toIError } from '@/utils/errorHandler';

const BASE = '/services/app/Position';

export async function getAllPositionsAPI(): Promise<IPositionResponse[]> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<IPositionResponse[]>
    >(`${BASE}/GetAll`);
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve position list');
  }
}
