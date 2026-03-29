import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  getAllProjectsAPI,
  CreateProjectAPI,
  GetAllProjectsParams,
  getProjectByIdAPI,
} from '@/services/project.service';
import { getAllUsersAPI } from '@/services/user.service';
import { getAllTasksAPI } from '@/services/task.service';
import { IProjectResponse } from '@/types/project.type';
import { RootState } from '@/stores/rootReducer';
import { FILTER_STATUS } from '@/constants/constants';
import { toIError } from '@/utils/errorHandler';
import {
  projectSchema,
  type ProjectFormValues,
} from '@/validations/project.schema';
import {
  mapFormDataToApiPayload,
  mapApiResponseToFormData,
} from '@/helpers/projectSliceHelpers';
import { AppDispatch } from '../store';
import { getQuantityProjectAPI } from '@/services/project.service';
import { IProjectQuantity } from '@/types/project.type';
import { IError } from '@/types/abp.type';

type AppThunkApiConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: IError;
};

type QuantityMap = Record<FilterStatusKey, number>;

const getDefaultProjectForm = (): ProjectFormValues => {
  const result = projectSchema.safeParse({});
  if (result.success) return result.data;

  return {
    clientId: 0,
    projectName: '',
    projectCode: '',
    projectType: 1,
    timeStart: new Date().toISOString(),
    timeEnd: '',
    note: '',
    autoAddUser: false,
    teamSelections: [],
    taskSelections: [],
    notifications: {
      isNotifyToKomu: false,
      komuChannelId: '',
      isNoticeKMSubmitTS: false,
      isNoticeKMRequestOffDate: false,
      isNoticeKMApproveRequestOffDate: false,
      isNoticeKMRequestChangeWorkingTime: false,
      isNoticeKMApproveChangeWorkingTime: false,
    },
  };
};

export type FilterStatusKey = (typeof FILTER_STATUS)[number]['key'];

export interface ProjectState {
  items: IProjectResponse[];
  filters: {
    query: string;
    status: FilterStatusKey;
  };
  form: ProjectFormValues;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: IError | null;
  quantities: QuantityMap;
}

const initialState: ProjectState = {
  items: [],
  filters: {
    query: '',
    status: FILTER_STATUS[0].key,
  },
  form: getDefaultProjectForm(),
  status: 'idle',
  error: null,
  quantities: { all: 0, 0: 0, 1: 0 },
};

export const fetchProjects = createAsyncThunk<
  IProjectResponse[],
  void,
  { state: RootState; rejectValue: IError }
>('project/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const { filters } = getState().project;
    const params: GetAllProjectsParams = {};
    if (filters.query.trim()) params.search = filters.query.trim();
    if (filters.status !== FILTER_STATUS[0].key)
      params.status = filters.status as 0 | 1;
    return (await getAllProjectsAPI(params)) ?? [];
  } catch (e) {
    return rejectWithValue(toIError(e, 'Failed to load projects'));
  }
});

export const fetchProjectById = createAsyncThunk<
  ProjectFormValues,
  number,
  AppThunkApiConfig
>('project/fetchById', async (projectId, { rejectWithValue }) => {
  try {
    const [projectData, allTasks, allUsers] = await Promise.all([
      getProjectByIdAPI(projectId),
      getAllTasksAPI(),
      getAllUsersAPI(),
    ]);
    return mapApiResponseToFormData(projectData, allTasks, allUsers);
  } catch (e) {
    return rejectWithValue(toIError(e, 'Failed to load project details'));
  }
});

export const saveProject = createAsyncThunk<
  void,
  { data: ProjectFormValues; projectId?: number },
  AppThunkApiConfig
>(
  'project/save',
  async ({ data, projectId }, { rejectWithValue, dispatch }) => {
    try {
      const apiPayload = mapFormDataToApiPayload(data);
      if (projectId) {
        apiPayload.id = projectId;
      }
      await CreateProjectAPI(apiPayload);
      await dispatch(fetchProjects());
    } catch (e) {
      return rejectWithValue(
        toIError(e, `Failed to ${projectId ? 'update' : 'create'} project`),
      );
    }
  },
);

export const initializeNewProjectForm = createAsyncThunk<
  ProjectFormValues,
  void,
  AppThunkApiConfig
>('project/initializeNew', async (_, { rejectWithValue }) => {
  try {
    const emptyForm = getDefaultProjectForm();
    const allTasks = await getAllTasksAPI();
    const defaultTasks = allTasks.filter((task) => task.type === 0);
    return { ...emptyForm, taskSelections: defaultTasks };
  } catch (e) {
    return rejectWithValue(toIError(e, 'Could not load default tasks'));
  }
});

export const fetchProjectQuantities = createAsyncThunk<
  QuantityMap,
  void,
  AppThunkApiConfig
>('project/fetchQuantities', async (_, { rejectWithValue }) => {
  try {
    const responseData = await getQuantityProjectAPI();
    return processQuantityData(responseData);
  } catch (e) {
    return rejectWithValue(
      toIError(e, 'Could not retrieve project quantities'),
    );
  }
});
const processQuantityData = (data: unknown): QuantityMap => {
  const initialQuantities: QuantityMap = { all: 0, 0: 0, 1: 0 };
  if (!Array.isArray(data)) return initialQuantities;

  let total = 0;
  const statusQuantities = data.reduce(
    (acc: Record<0 | 1, number>, item: IProjectQuantity) => {
      if (
        typeof item?.status === 'number' &&
        typeof item.quantity === 'number'
      ) {
        const quantity = item.quantity;
        if (item.status === 0 || item.status === 1) {
          acc[item.status] = (acc[item.status] || 0) + quantity;
        }
        total += quantity;
      }
      return acc;
    },
    { 0: 0, 1: 0 },
  );

  return { ...initialQuantities, ...statusQuantities, all: total };
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setFilterQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<FilterStatusKey>) {
      state.filters.status = action.payload;
    },
    updateProjectForm(
      state,
      action: PayloadAction<Partial<ProjectFormValues>>,
    ) {
      state.form = { ...state.form, ...action.payload };
    },
    resetProjectForm(state) {
      state.form = getDefaultProjectForm();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.form = action.payload;
      })
      .addCase(saveProject.fulfilled, (state) => {
        state.status = 'succeeded';
        state.form = getDefaultProjectForm();
      })
      .addCase(fetchProjectQuantities.fulfilled, (state, action) => {
        state.quantities = action.payload;
      })
      .addCase(initializeNewProjectForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.form = action.payload;
      })
      .addMatcher(
        isPending(fetchProjects, fetchProjectById, saveProject),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(fetchProjects, fetchProjectById, saveProject),
        (state, action) => {
          state.status = 'failed';
          state.error = (action.payload as unknown as IError) ?? {
            code: null,
            message: action.error?.message ?? 'Unknown error',
            details: null,
          };
        },
      );
  },
});

export const {
  setFilterQuery,
  setFilterStatus,
  updateProjectForm,
  resetProjectForm,
} = projectSlice.actions;

export default projectSlice.reducer;
