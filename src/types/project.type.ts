export interface IProjectResponse {
  customerName: string;
  name: string;
  code: string;
  status: number;
  pms: string[];
  activeMember: number;
  projectType: number;
  timeStart: string;
  timeEnd: string;
  id: number;
}

export interface IProjectQuantity {
  status: number;
  quantity: number;
}

export interface ICreateEditProjectType {
  id?: number;
  name: string;
  code: string;
  status: number;
  timeStart: string;
  timeEnd: string;
  note: string;
  projectType: number;
  customerId: number | null;
  tasks: ITaskRequest[];
  users: IUserRequest[];
  projectTargetUsers?: ITargetUserRequest[];
  komuChannelId: string;
  isNotifyToKomu: boolean;
  isNoticeKMSubmitTS: boolean;
  isNoticeKMRequestOffDate: boolean;
  isNoticeKMApproveRequestOffDate: boolean;
  isNoticeKMRequestChangeWorkingTime: boolean;
  isNoticeKMApproveChangeWorkingTime: boolean;
  isAllUserBelongTo: boolean;
}

export interface ITaskRequest {
  taskId: number;
  billable: boolean;
  id: number;
}

export interface IUserRequest {
  userId: number;
  type: number;
  isTemp: boolean;
  id: number;
}

export interface ITargetUserRequest {
  userId: number;
  roleName: string;
  id: number;
}
