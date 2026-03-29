import React from 'react';
import { SideBarMenu } from './SideBarMenu';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBarMenu />
      <main className="flex-1 px-4 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
