
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, Search, Users, MessageCircle, Bell, 
  TrendingUp, Building, User, Settings, LogOut,
  Bookmark, PlusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AISearchOverlay } from '@/components/search/AISearchOverlay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MainLayout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error logging out",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigation = [
    { name: 'Home', href: '/professional', icon: Home, current: true },
    { name: 'My Network', href: '/network', icon: Users, current: false },
    { name: 'Messages', href: '/messages', icon: MessageCircle, current: false },
    { name: 'Notifications', href: '/notifications', icon: Bell, current: false },
    { name: 'Market', href: '/market', icon: TrendingUp, current: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  InvestorPaisa
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <Button
                variant="outline"
                onClick={() => setShowSearch(true)}
                className="w-full justify-start text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100 rounded-2xl h-12"
              >
                <Search className="h-5 w-5 mr-3" />
                <span>Search people, posts, companies...</span>
              </Button>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-12 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  onClick={() => window.location.href = item.href}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1 hidden sm:block">{item.name}</span>
                </Button>
              ))}
              
              {/* Profile Dropdown */}
              <div className="ml-4 flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded-full hover:bg-slate-100"
                  onClick={() => window.location.href = '/profile'}
                >
                  <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-blue-200 transition-all">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 w-8 p-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* AI Search Overlay */}
      <AISearchOverlay 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />

      {/* Create Post FAB */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all z-30"
        onClick={() => {
          // Scroll to top and focus on create post
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MainLayout;
