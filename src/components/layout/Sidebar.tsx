
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  FileText, 
  ShoppingCart, 
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={cn(
      "fixed top-0 left-0 z-40 h-screen transition-transform duration-300 bg-white border-r",
      isOpen ? "w-64" : "w-0 -translate-x-full"
    )}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b">
          <span className="text-xl font-semibold">Admin Dashboard</span>
        </div>
        
        {/* Navigation */}
        <nav className="overflow-y-auto py-5 px-3 h-full">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <LayoutDashboard className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <span className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Management
              </span>
            </li>
            <li>
              <Link to="/users" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <Users className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                <span className="ml-3">Users</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <Package className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                <span className="ml-3">Products</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                <span className="ml-3">Orders</span>
              </Link>
            </li>
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <span className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Pages
              </span>
            </li>
            <li>
              <details className="group">
                <summary className="flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                    <span className="ml-3">Pages</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                </summary>
                <ul className="pl-8 mt-1 space-y-1">
                  <li>
                    <Link to="/login" className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="block p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      Register
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <span className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </span>
            </li>
            <li>
              <Link to="/settings" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <Settings className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                <span className="ml-3">Settings</span>
              </Link>
            </li>
            <li>
              <button className="w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <LogOut className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};
