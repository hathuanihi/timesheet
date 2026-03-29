import axiosInstance from '@/utils/axiosInstance';
import {
  IProjectResponse,
  ICreateEditProjectType,
  IProjectQuantity,
} from '@/types/project.type';
import { toIError } from '@/utils/errorHandler';
import { IAbpResponse } from '@/types/abp.type';

export type GetAllProjectsParams = {
  status?: 0 | 1;
  search?: string;
};

const BASE = '/services/app/Project';

export async function getAllProjectsAPI(
  params?: GetAllProjectsParams,
): Promise<IProjectResponse[]> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<IProjectResponse[]>
    >(`${BASE}/GetAll`, { params });
    if (!res?.success || !res?.result) {
      throw (
        res?.error ?? {
          message: 'Could not retrieve project list',
          details: res?.error?.details ?? null,
        }
      );
    }
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve project list');
  }
}

export async function getProjectByIdAPI(
  input: number,
): Promise<ICreateEditProjectType> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<ICreateEditProjectType>
    >(`${BASE}/Get`, { params: { input } });
    if (!res?.success || !res?.result) {
      throw (
        res?.error ?? {
          message: 'Could not retrieve project',
          details: res?.error?.details ?? null,
        }
      );
    }
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve project');
  }
}

export async function DeactivateProjectAPI(id: number): Promise<void> {
  try {
    const { data: res } = await axiosInstance.post<IAbpResponse<void>>(
      `${BASE}/Inactive`,
      { id },
    );
    if (!res?.success) {
      throw (
        res?.error ?? {
          message: 'Could not deactivate project',
          details: res?.error?.details ?? null,
        }
      );
    }
  } catch (error) {
    throw toIError(error, 'Could not deactivate project');
  }
}

export async function ActivateProjectAPI(id: number): Promise<void> {
  try {
    const { data: res } = await axiosInstance.post<IAbpResponse<void>>(
      `${BASE}/Active`,
      { id },
    );
    if (!res?.success) {
      throw (
        res?.error ?? {
          message: 'Could not activate project',
          details: res?.error?.details ?? null,
        }
      );
    }
  } catch (error) {
    throw toIError(error, 'Could not activate project');
  }
}

export async function DeleteProjectAPI(id: number): Promise<void> {
  try {
    const { data: res } = await axiosInstance.delete<IAbpResponse<void>>(
      `${BASE}/Delete`,
      { params: { id } },
    );
    if (!res?.success) {
      throw (
        res?.error ?? {
          message: 'Could not delete project',
          details: res?.error?.details ?? null,
        }
      );
    }
  } catch (error) {
    throw toIError(error, 'Could not delete project');
  }
}

export async function CreateProjectAPI(
  data: ICreateEditProjectType,
): Promise<IProjectResponse> {
  try {
    const { data: res } = await axiosInstance.post<
      IAbpResponse<IProjectResponse>
    >(`${BASE}/Save`, data);

    if (!res.success || !res.result) {
      const defaultError = {
        message: 'Could not create project',
        details: null,
      };
      throw res.error || defaultError;
    }

    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not create project');
  }
}

export async function getQuantityProjectAPI(): Promise<IProjectQuantity> {
  try {
    const { data: res } = await axiosInstance.get<
      IAbpResponse<IProjectQuantity>
    >(`${BASE}/GetQuantityProject`);
    if (!res?.success || !res?.result) {
      throw (
        res?.error ?? {
          message: 'Could not retrieve project quantities',
          details: res?.error?.details ?? null,
        }
      );
    }
    return res.result;
  } catch (error) {
    throw toIError(error, 'Could not retrieve project quantities');
  }
}
