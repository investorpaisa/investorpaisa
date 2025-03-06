
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
import { 
  Home, 
  Compass, 
  MessageSquare, 
  User, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Wallet,
  Sparkles,
  Users,
  BookOpen
} from 'lucide-react';

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

  const communityItems = [
    {
      title: 'Expert Circle',
      icon: Sparkles,
      path: '/app/expert-circle',
    },
    {
      title: 'Groups',
      icon: Users,
      path: '/app/groups',
    },
    {
      title: 'Learning Hub',
      icon: BookOpen,
      path: '/app/learning',
    },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-premium-dark-700/50">
      <SidebarContent className="bg-gradient-premium">
        <div className="px-4 py-6 flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</h2>
          <p className="text-xs text-muted-foreground mt-1">Your financial community</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-premium-gold/70 font-medium text-xs uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    className={isActive(item.path) ? "bg-premium-dark-700/40 text-premium-gold border-l-2 border-premium-gold" : "hover:bg-premium-dark-700/20"}
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
          <SidebarGroupLabel className="text-premium-gold/70 font-medium text-xs uppercase tracking-wider">Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    className={isActive(item.path) ? "bg-premium-dark-700/40 text-premium-gold border-l-2 border-premium-gold" : "hover:bg-premium-dark-700/20"}
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
          <SidebarGroupLabel className="text-premium-gold/70 font-medium text-xs uppercase tracking-wider">Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    className={isActive(item.path) ? "bg-premium-dark-700/40 text-premium-gold border-l-2 border-premium-gold" : "hover:bg-premium-dark-700/20"}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <div className="glass-accent rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Upgrade to Premium</p>
            <button className="btn-premium text-xs w-full">
              <Sparkles className="h-3 w-3" />
              Unlock All Features
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
