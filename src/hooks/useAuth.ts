import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/rootReducer';
import { getItem, removeItem } from '@/utils/localStorage';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated: isAuthFromStore,
  } = useSelector((state: RootState) => state.auth);

  const accessToken = token ?? getItem('access_token');
  const storedUser = useMemo(() => {
    const str = getItem('user');
    try {
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  }, []);

  const hasToken = Boolean(accessToken);
  const hasUser = Boolean(user || storedUser);
  const isAuthenticated = isAuthFromStore || (hasToken && hasUser);

  if (!isAuthenticated) {
    removeItem('user');
  }

  return {
    isAuthenticated,
    user: user ?? storedUser,
    token: accessToken as string | null,
    hasToken,
    hasUser,
  } as const;
};
