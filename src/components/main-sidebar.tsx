import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  Users,
  ChevronRight,
  ChevronDown,
  Pin,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserCircles } from '@/hooks/useCircles';
import { toast } from 'sonner';

export function MainSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [circlesExpanded, setCirclesExpanded] = useState(false);
  const { data: circles = [] } = useUserCircles(user?.id);

  const sidebarItems = [
    {
      title: 'Home',
      icon: <Home className="h-5 w-5" />,
      path: '/home',
      exact: true,
    },
    {
      title: 'Discover',
      icon: <Search className="h-5 w-5" />,
      path: '/discover',
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/notifications',
      badge: 3,
    },
    {
      title: 'Messages',
      icon: <Mail className="h-5 w-5" />,
      path: '/inbox',
      badge: 1,
    },
    {
      title: 'Market',
      icon: <PieChart className="h-5 w-5" />,
      path: '/market',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCircleManagement = (circleId: string) => {
    toast.info('Circle management coming soon');
  };

  const handlePinCircle = (circleId: string) => {
    toast.success('Circle pinned successfully');
  };
  
  const circleSidebarItems = circles?.slice(0, circlesExpanded ? circles.length : 3) || [];

  const renderContent = () => (
    <div className="flex h-full flex-col gap-2 py-4">
      {isMobile && (
        <div className="px-4 mb-2">
          <Link to={`/profile/${user?.id}`} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </Link>
        </div>
      )}

      <div className="px-2 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block"
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <Button
              variant={pathname === item.path ? "default" : "ghost"}
              className={`w-full justify-start ${pathname === item.path ? 'bg-ip-teal text-white' : ''}`}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
              {item.badge && (
                <span className="ml-auto bg-ip-teal text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {item.badge}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </div>

      <Separator className="my-2" />

      <div className="px-2">
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setCirclesExpanded(!circlesExpanded)}
        >
          <div className="flex items-center">
            <Users className="h-5 w-5" />
            <span className="ml-2">My Circles</span>
          </div>
          {circlesExpanded ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
        </Button>

        <div className="space-y-1 mt-1 pl-2">
          {circleSidebarItems.map((circle) => (
            <div key={circle.id} className="flex items-center group">
              <Link
                to={`/circles/${circle.id}`}
                className="flex-1"
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                >
                  {circle.name}
                  {circle.hasNewPost && (
                    <span className="h-2 w-2 rounded-full bg-ip-teal ml-2"></span>
                  )}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePinCircle(circle.id)}>
                    <Pin className="h-4 w-4 mr-2" /> Pin Circle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCircleManagement(circle.id)}>
                    <Settings className="h-4 w-4 mr-2" /> Manage Circle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {circles && circles.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-muted-foreground"
              onClick={() => setCirclesExpanded(!circlesExpanded)}
            >
              {circlesExpanded ? "Show less" : `View all (${circles.length})`}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-auto px-2 space-y-1">
        <Link to="/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-5 w-5" />
            <span className="ml-2">Settings</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-2">Log out</span>
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed z-50 top-4 left-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </Button>
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 sm:max-w-sm p-0">
            {renderContent()}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="h-screen sticky top-0 w-64 border-r bg-background p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <Avatar className="cursor-pointer" onClick={() => navigate(`/profile/${user?.id}`)}>
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate cursor-pointer hover:underline" onClick={() => navigate(`/profile/${user?.id}`)}>
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
