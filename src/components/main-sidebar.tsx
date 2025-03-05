
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home, Compass, MessageSquare, User, TrendingUp, FileText, Calendar, Wallet } from 'lucide-react';

export function MainSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const mainNavItems = [
    {
      title: 'My Feed',
      icon: Home,
      path: '/app/feed',
    },
    {
      title: 'Discover',
      icon: Compass,
      path: '/app/discover',
    },
    {
      title: 'Inbox',
      icon: MessageSquare,
      path: '/app/inbox',
    },
    {
      title: 'Profile',
      icon: User,
      path: '/app/profile',
    },
  ];
  
  const financeNavItems = [
    {
      title: 'Investments',
      icon: TrendingUp,
      path: '/app/investments',
    },
    {
      title: 'Taxation',
      icon: FileText,
      path: '/app/taxation',
    },
    {
      title: 'Planning',
      icon: Calendar,
      path: '/app/planning',
    },
    {
      title: 'Personal Finance',
      icon: Wallet,
      path: '/app/personal-finance',
    },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-ip-blue">Investor Paisa</h2>
          <p className="text-xs text-muted-foreground">Your financial community</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
