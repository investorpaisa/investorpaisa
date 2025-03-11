
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PinIcon,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrendingCircles } from '@/hooks/useCircles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function MainSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: circles = [] } = useTrendingCircles(10);
  const [isCirclesExpanded, setIsCirclesExpanded] = useState(true);
  const [pinnedCircles, setPinnedCircles] = useState<Record<string, boolean>>({});

  const handlePinCircle = (circleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    setPinnedCircles(prev => {
      const updated = { ...prev };
      updated[circleId] = !updated[circleId];
      return updated;
    });
    
    toast.success(pinnedCircles[circleId] ? 'Circle unpinned' : 'Circle pinned');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCircleManage = (circleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    // In a real app, this would navigate to a circle management page
    navigate(`/app/circles/${circleId}/manage`);
  };
  
  // Sort circles with pinned ones at the top
  const sortedCircles = [...circles].sort((a, b) => {
    if (pinnedCircles[a.id] && !pinnedCircles[b.id]) return -1;
    if (!pinnedCircles[a.id] && pinnedCircles[b.id]) return 1;
    return 0;
  });

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
          <div 
            className="px-4 mb-4 flex items-center gap-3 cursor-pointer hover:bg-black/5 p-2 rounded-md transition-colors"
            onClick={handleProfileClick}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || 'IP'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name || 'User'}</span>
              {user && user.email && (
                <p className="text-sm text-muted-foreground">
                  @{user.email.split('@')[0]}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-1 px-2 mb-6">
          <Link to="/home" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/home' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/market" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/market' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <BarChart2 className="h-5 w-5" />
            <span>Market</span>
          </Link>
          <Link to="/mycircle" className={`flex items-center gap-x-2 rounded-md px-3 py-2 text-sm ${location.pathname === '/mycircle' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors`}>
            <CircleUser className="h-5 w-5" />
            <span>My Circle</span>
          </Link>
        </div>
        
        <div className="border-t border-black/5 pt-6 px-2">
          <div 
            className="mb-2 px-3 text-sm font-semibold text-black/60 flex items-center justify-between cursor-pointer"
            onClick={() => setIsCirclesExpanded(!isCirclesExpanded)}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              My Circles
            </div>
            {isCirclesExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {isCirclesExpanded && (
            <div className="space-y-1">
              {sortedCircles.map(circle => (
                <div key={circle.id} className="relative group">
                  <Link 
                    to={`/app/circles/${circle.id}`} 
                    className={`flex justify-between items-center px-3 py-2 text-sm rounded-md ${location.pathname === `/app/circles/${circle.id}` ? 'bg-black/5 font-medium' : 'hover:bg-black/5'} transition-colors w-full`}
                  >
                    <div className="flex items-center">
                      {pinnedCircles[circle.id] && (
                        <PinIcon className="h-3 w-3 mr-1 text-gold" />
                      )}
                      <span className="truncate">{circle.name}</span>
                    </div>
                    <div className="flex items-center">
                      {circle.hasNewPost && (
                        <div className="w-2 h-2 rounded-full bg-gold mr-2"></div>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handlePinCircle(circle.id, e)}>
                              <PinIcon className="mr-2 h-4 w-4" />
                              {pinnedCircles[circle.id] ? 'Unpin' : 'Pin'} circle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleCircleManage(circle.id, e)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Manage circle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toast.success('Circle removed');
                            }}>
                              Leave circle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              {circles.length === 0 && (
                <div className="text-sm px-3 py-1 text-muted-foreground">
                  No circles joined yet
                </div>
              )}
            </div>
          )}
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
