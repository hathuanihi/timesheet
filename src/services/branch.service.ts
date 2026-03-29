import axiosInstance from '@/utils/axiosInstance';
import { IBranchResponse } from '@/types/branch.type';
import { IAbpResponse } from '@/types/abp.type';
import { toIError } from '@/utils/errorHandler';

const BASE = '/services/app/Branch';

export async function getAllBranchesAPI(): Promise<IBranchResponse[]> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<IBranchResponse[]>
    >(`${BASE}/GetAllNotPagging`);
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve branch list');
  }
}
