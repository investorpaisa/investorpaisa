
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Crown,
  Verified
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Feed', href: '/feed', icon: TrendingUp },
  { name: 'Circles', href: '/circles', icon: Users },
  { name: 'Market', href: '/market', icon: BarChart3 },
  { name: 'Discover', href: '/discover', icon: Search },
  { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
];

export const MainNav = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'expert':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'influencer':
        return <Verified className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'expert':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Expert</Badge>;
      case 'influencer':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Influencer</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IP</span>
          </div>
          <span className="font-bold text-xl text-gray-900">InvestorPaisa</span>
        </Link>

        {/* Navigation */}
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive
                    ? 'text-green-600 border-b-2 border-green-600 pb-1'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="sm" asChild>
            <Link to="/inbox">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || profile?.username} />
                  <AvatarFallback>
                    {(profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || profile?.username}
                    </p>
                    {getRoleIcon(profile?.role || 'user')}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email}
                  </p>
                  {getRoleBadge(profile?.role || 'user')}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/profile/${profile?.id}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
