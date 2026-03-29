import axiosInstance from '@/utils/axiosInstance';
import { ICustomerResponse, ICustomerRequest } from '@/types/customer.type';
import { toIError } from '@/utils/errorHandler';
import { IAbpPagedResult, IAbpResponse } from '@/types/abp.type';

const BASE = '/services/app/Customer';

export async function getAllCustomersAPI(): Promise<ICustomerResponse[]> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<ICustomerResponse[]>
    >(`${BASE}/GetAll`);
    if (!res?.success || !res?.result) {
      throw (
        res?.error ?? {
          message: 'Could not retrieve customer list',
          details: res?.error?.details ?? null,
        }
      );
    }
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve customer list');
  }
}

export async function createCustomerAPI(
  payload: ICustomerRequest,
): Promise<void> {
  try {
    const { data: res } = await axiosInstance.post<IAbpResponse<void>>(
      `${BASE}/Save`,
      payload,
    );
    if (!res?.success) {
      throw (
        res?.error ?? {
          message: 'Could not create customer',
          details: res?.error?.details ?? null,
        }
      );
    }
  } catch (error) {
    throw toIError(error, 'Could not create customer');
  }
}

interface GetAllPaggingInput {
  searchText: string;
  maxResultCount: number;
  skipCount: number;
}

export async function searchCustomersAPI(
  params: GetAllPaggingInput,
): Promise<ICustomerResponse[]> {
  try {
    const { data: res } = await axiosInstance.post<
      IAbpResponse<IAbpPagedResult<ICustomerResponse>>
    >(`${BASE}/GetAllPagging`, params);
    if (!res?.success || !res?.result) {
      throw (
        res?.error ?? {
          message: 'Could not search customers',
          details: res?.error?.details ?? null,
        }
      );
      return [];
    }
    return res.result.items || [];
  } catch (error) {
    throw toIError(error, 'Could not search customers');
  }
}
