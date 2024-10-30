import React from 'react';
import { UserCount } from './UserCount';

export const Navbar: React.FC = () => {
  return (
    <nav className="h-8 border-b border-gray-300 flex items-center justify-between px-4">
      <div className="flex-1"></div>  {/* Empty space for left side can be used for Logo*/}
      <UserCount/>
    </nav>
  );
};
