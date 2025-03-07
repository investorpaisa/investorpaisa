
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/premium/button';
import { 
  Home, 
  Globe, 
  BarChart2, 
  Inbox, 
  Bell, 
  User, 
  ChevronRight, 
  Plus,
  LogOut,
  Settings,
  HelpCircle,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTrendingCircles } from '@/hooks/useCircles';

export function MainSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { data: circles = [] } = useTrendingCircles(10);

  return (
    <Sidebar className="border-r border-black/5 bg-white">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-6">
          <Link to="/feed">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">Investor</span>
              <span className="text-xl text-gold">Paisa</span>
            </div>
          </Link>
        </div>

        {user && (
          <div className="px-4 mb-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || 'IP'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name || 'User'}</span>
              <span className="text-xs text-muted-foreground">@{user.username || 'username'}</span>
            </div>
          </div>
        )}
        
        <div className="space-y-1 px-2 mb-6">
          <Link to="/feed" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/feed' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <Home className="h-5 w-5" />
            <span>Feed</span>
          </Link>
          <Link to="/discover" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/discover' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <Globe className="h-5 w-5" />
            <span>Discover</span>
          </Link>
          <Link to="/market" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/market' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <BarChart2 className="h-5 w-5" />
            <span>Market Data</span>
          </Link>
          <Link to="/inbox" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/inbox' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <Inbox className="h-5 w-5" />
            <span>Messages</span>
          </Link>
          <Link to="/profile" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/profile' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </div>
        
        <div className="border-t border-black/5 pt-6 px-2">
          <h4 className="mb-2 px-3 text-sm font-semibold text-black/60 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            My Circles
          </h4>
          <div className="space-y-1">
            {circles.map(circle => (
              <Link 
                key={circle.id}
                to={`/app/circles/${circle.id}`} 
                className={`flex justify-between items-center px-3 py-2 text-sm rounded-md ${location.pathname === `/app/circles/${circle.id}` ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors w-full`}
              >
                <span className="truncate">{circle.name}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              </Link>
            ))}
            {circles.length === 0 && (
              <div className="text-sm px-3 py-1 text-muted-foreground">
                No circles joined yet
              </div>
            )}
            <Link 
              to="/discover"
              className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-black/5 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Join Circles</span>
            </Link>
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex flex-col space-y-3 px-4 py-3">
          <PremiumButton variant="default" className="justify-center">
            Go Premium
          </PremiumButton>
          <Button variant="ghost" className="justify-start hover:bg-black/5" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
