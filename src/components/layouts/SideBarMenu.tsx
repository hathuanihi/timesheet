import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout } from '@/stores/slices/authSlice';
import { AppDispatch } from '@/stores/store';
import { FolderGit, UserRound, LogOutIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/constants/constants';
import { cn } from '@/lib/utils';

export const SideBarMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [imgError, setImgError] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const avatarUrl = useMemo(
    () => user?.avatarFullPath || user?.avatarPath || null,
    [user],
  );

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const { displayName, initials } = useMemo(() => {
    if (!user) return { displayName: 'User', initials: '' };
    const name = user.name || user.userName || '';
    const surname = user.surname || '';
    return {
      displayName: `${name} ${surname}`.trim() || user.userName,
      initials: `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase(),
    };
  }, [user]);

  return (
    <aside className="w-64 p-4 bg-gradient-to-b from-emerald-500 via-emerald-500/85 to-cyan-600 h-full text-white flex flex-col">
      <div className="mb-4 px-1 cursor-default">
        <h1 className="text-sm font-semibold uppercase tracking-wider text-white/85">
          {APP_NAME}
        </h1>
      </div>

      <div className="mb-4 rounded-xl bg-white/10 backdrop-blur-sm p-3 shadow-sm">
        <div className="flex items-center gap-3 cursor-default">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={displayName || 'User avatar'}
              className="h-12 w-12 rounded-full ring-2 ring-white/40 object-cover bg-white/20"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center">
              {initials ? (
                <span className="text-white font-semibold">{initials}</span>
              ) : (
                <UserRound className="text-white/90" />
              )}
            </div>
          )}
          <div className="leading-tight">
            <div className="font-bold uppercase tracking-wide">
              {displayName}
            </div>
            <div className="text-white/85 text-sm truncate max-w-[10rem]">
              {user?.emailAddress ?? ''}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/15 mb-3" />

      <nav className="mb-3">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2 rounded-lg transition-colors duration-200 outline-none',
                  'focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                  {
                    'bg-white/20 ring-1 ring-white/30 shadow-sm': isActive,
                    'hover:bg-white/10': !isActive,
                  },
                )
              }
              end
            >
              <FolderGit className="mr-2 opacity-95 group-hover:opacity-100" />
              <span className="text-base font-medium">Projects</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="flex-1" />

      <div className="cursor-default">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-start gap-2 bg-transparent hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-2" />
          <span className="text-base font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};
