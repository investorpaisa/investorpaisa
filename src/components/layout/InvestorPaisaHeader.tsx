
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Bell, TrendingUp, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SearchComponent } from '@/components/header/SearchComponent';
import { NotificationsComponent } from '@/components/header/NotificationsComponent';

export const InvestorPaisaHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/network', icon: Users, label: 'My Network' },
    { path: '/create-post', icon: Plus, label: 'Post' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/market', icon: TrendingUp, label: 'Market' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">IP</span>
              </div>
              <span className="text-xl font-bold text-black">InvestorPaisa</span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <SearchComponent />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                    active 
                      ? 'text-black bg-gray-100' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Menu */}
          <div className="flex items-center space-x-4">
            <NotificationsComponent />
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar_url || '/placeholder.svg'}
                alt={user?.full_name || 'Profile'}
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-black"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
