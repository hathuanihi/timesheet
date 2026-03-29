import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getItem,
  getJSONItem,
  removeItem,
  setItem,
} from '../../utils/localStorage';
import { IAuthState } from '@/types/auth.type';
import { IUser } from '../../types/user.type';

const storedToken = getItem('access_token');
const storedUser = getJSONItem<IUser>('user');

const initialState: IAuthState = {
  user: storedUser,
  loginData: {
    userNameOrEmailAddress: '',
    password: '',
    rememberClient: false,
  },
  token: storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        user: IUser;
        rememberClient?: boolean;
      }>,
    ) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      setItem('access_token', token);
      setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loginData = {
        userNameOrEmailAddress: '',
        password: '',
        rememberClient: false,
      };
      removeItem('user');
      removeItem('access_token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
