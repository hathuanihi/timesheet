export interface IUser {
  id: number;
  userName: string;
  name: string;
  surname: string;
  isActive?: boolean;
  emailAddress: string;
  avatarPath?: string;
  avatarFullPath?: string;
  branchId?: number;
  type?: number;
}

export interface IUserResponse {
  name: string;
  emailAddress: string;
  isActive: boolean;
  type: number;
  jobTitle: string;
  level: string;
  userCode: string;
  avatarPath: string;
  avatarFullPath: string;
  branch: string;
  branchColor: string;
  branchDisplayName: string;
  branchId: number;
  positionId: number;
  positionName: string;
  id: number;
}
