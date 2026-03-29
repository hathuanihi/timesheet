import axios from 'axios';
import { getItem, removeItem } from './localStorage';
import { store } from '@/stores/store';
import { logout } from '@/stores/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getItem('access_token');
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] =
        `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        store.dispatch(logout());
      } catch {
        // fallback if store unavailable
        removeItem('user');
        removeItem('access_token');
      }
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
