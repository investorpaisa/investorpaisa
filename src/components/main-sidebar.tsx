
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  BarChart2, 
  Users,
  User, 
  LogOut,
  MessageCircle,
  CircleUser,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrendingCircles } from '@/hooks/useCircles';

export function MainSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { data: circles = [] } = useTrendingCircles(10);

  return (
    <Sidebar className="border-r border-black/5 bg-white">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-6">
          <Link to="/home">
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
              {user && user.email && (
                <p className="mb-2 text-sm text-muted-foreground">
                  @{user.email.split('@')[0]}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-1 px-2 mb-6">
          <Link to="/home" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/home' || location.pathname === '/feed' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/mycircle" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/mycircle' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <CircleUser className="h-5 w-5" />
            <span>My Circle</span>
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
                {circle.hasNewPost && (
                  <div className="w-2 h-2 rounded-full bg-gold ml-2"></div>
                )}
              </Link>
            ))}
            {circles.length === 0 && (
              <div className="text-sm px-3 py-1 text-muted-foreground">
                No circles joined yet
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex flex-col space-y-3 px-4 py-3">
          <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground px-2 py-1">
            <Settings className="h-4 w-4 inline-block mr-2" />
            Settings
          </Link>
          <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground px-2 py-1">
            <HelpCircle className="h-4 w-4 inline-block mr-2" />
            Help & Support
          </Link>
          <Button variant="ghost" className="justify-start hover:bg-black/5" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
