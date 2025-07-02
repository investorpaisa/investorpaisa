
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Home, Search, Users, MessageCircle, Bell, 
  TrendingUp, Building, User, Settings, LogOut,
  Bookmark, PlusCircle, Menu, X, ImageIcon, Video, FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ModernSearchOverlay } from '@/components/search/ModernSearchOverlay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

const ModernLayout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [createPostContent, setCreatePostContent] = useState('');

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

  const handleCreatePost = async () => {
    if (!createPostContent.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: createPostContent.substring(0, 100),
          content: createPostContent,
          visibility: 'public'
        })
        .select()
        .single();

      if (error) throw error;

      // Record post creation activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'post',
        target_type: 'post',
        target_id: data.id
      });

      setCreatePostContent('');
      setShowCreatePost(false);
      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with your network."
      });

      // Navigate to home if not already there
      if (location.pathname !== '/professional') {
        navigate('/professional');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigation = [
    { name: 'Home', href: '/professional', icon: Home, active: location.pathname === '/professional' },
    { name: 'Network', href: '/network', icon: Users, active: location.pathname === '/network' },
    { name: 'Messages', href: '/messages', icon: MessageCircle, active: location.pathname === '/messages' },
    { name: 'Notifications', href: '/notifications', icon: Bell, active: location.pathname === '/notifications' },
    { name: 'Markets', href: '/market', icon: TrendingUp, active: location.pathname === '/market' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Desktop Header */}
      {!isMobile && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      InvestorPaisa
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern Search Bar */}
              <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSearch(true)}
                    className="w-full justify-start text-slate-500 bg-slate-50/80 border border-slate-200/50 hover:bg-slate-100/80 rounded-3xl h-12 px-6 backdrop-blur-sm"
                  >
                    <Search className="h-5 w-5 mr-3 text-slate-400" />
                    <span className="text-slate-600">Search for people, posts, companies...</span>
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center space-x-1">
                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-1">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(item.href)}
                      className={`flex flex-col items-center px-4 py-2 h-16 w-16 rounded-2xl transition-all duration-200 ${
                        item.active 
                          ? 'text-blue-600 bg-blue-50 shadow-sm' 
                          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      <item.icon className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Profile & Actions */}
                <div className="flex items-center space-x-3 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="p-1 rounded-2xl hover:bg-slate-100 transition-all duration-200"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold">
                        {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-2xl h-10 w-10 p-0 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>

                  {/* Mobile Menu Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="lg:hidden border-t border-slate-200/50 py-4">
                <div className="flex justify-around">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(item.href);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all duration-200 ${
                        item.active 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/50 shadow-lg">
          <div className="flex items-center justify-around px-4 py-2">
            {navigation.slice(0, 2).map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center px-4 py-3 rounded-2xl transition-all duration-200 ${
                  item.active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Button>
            ))}
            
            {/* Center Create Button */}
            <Button
              onClick={() => setShowCreatePost(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="h-6 w-6 text-white" />
            </Button>
            
            {navigation.slice(2).map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center px-4 py-3 rounded-2xl transition-all duration-200 ${
                  item.active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {/* Desktop Floating Action Button */}
      {!isMobile && (
        <Button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 z-40"
        >
          <PlusCircle className="h-7 w-7 text-white" />
        </Button>
      )}

      {/* Modern Search Overlay */}
      <ModernSearchOverlay 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="sm:max-w-2xl rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <PlusCircle className="h-6 w-6 mr-3 text-blue-600" />
              Create Post
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                  {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-sm text-slate-600">Sharing with your network</p>
              </div>
            </div>

            <textarea
              value={createPostContent}
              onChange={(e) => setCreatePostContent(e.target.value)}
              placeholder="What's happening in the markets? Share your insights..."
              className="w-full min-h-32 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500"
            />
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600 hover:bg-slate-100">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600 hover:bg-slate-100">
                  <Video className="h-5 w-5 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600 hover:bg-slate-100">
                  <FileText className="h-5 w-5 mr-2" />
                  Document
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreatePost(false)}
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!createPostContent.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl px-6"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModernLayout;
