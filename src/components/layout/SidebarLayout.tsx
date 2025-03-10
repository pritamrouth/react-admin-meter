
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  // Default to closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  useEffect(() => {
    // Handle window resize events to adjust sidebar state
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={cn(
        "flex flex-col flex-1 overflow-hidden transition-all duration-300",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <footer className="bg-white p-4 border-t text-center text-sm text-gray-500">
          <p>Admin Dashboard © {new Date().getFullYear()} - Created with ♥</p>
        </footer>
      </div>
    </div>
  );
};
