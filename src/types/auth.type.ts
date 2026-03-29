import { IUser } from './user.type';
import { IAbpResponse } from './abp.type';

export interface IAuthState {
  user: IUser | null;
  loginData: IAuthenticateRequest | null;
  token: string | null;
  isAuthenticated?: boolean;
}

export interface IAuthenticateRequest {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
}

export type IAuthenticateResult = IAbpResponse<{
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  userId: number;
}>;

export type IGetCurrentLoginInformationsResponse = IAbpResponse<{
  applications?: {
    version: string;
    releaseDate: string;
    features: string[];
  } | null;
  user?: {
    id: number;
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    avatarFullPath?: string;
    avatarPath?: string;
  } | null;
  tenant?: {
    id: number;
    name: string;
    logoId?: number | null;
  } | null;
}>;
