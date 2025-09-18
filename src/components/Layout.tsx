import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 md:rounded-tl-2xl shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;