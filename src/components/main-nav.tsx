
import { Link } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';
import { PremiumButton } from './ui/premium/button';
import { Button } from './ui/button';
import { BarChart2, Bell, Home, Globe, Inbox, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MainNav() {
  const { signOut } = useAuth();
  const userData = useUserData();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger className="lg:hidden mr-2">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        
        <div className="flex items-center">
          <Link to="/feed" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">Investor<span className="text-gold">Paisa</span></span>
          </Link>
        </div>
        
        <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link to="/feed" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold">
            <Home className="h-4 w-4" />
            <span>Feed</span>
          </Link>
          <Link to="/discover" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold">
            <Globe className="h-4 w-4" />
            <span>Discover</span>
          </Link>
          <Link to="/market" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold">
            <BarChart2 className="h-4 w-4" />
            <span>Market</span>
          </Link>
        </nav>
        
        <div className="ml-auto flex items-center gap-2">
          <PremiumButton size="sm" className="hidden lg:flex">
            Go Premium
          </PremiumButton>
          <button className="text-black/50 hover:text-black h-8 w-8 rounded-md grid place-items-center transition-colors">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-md p-0 data-[state=open]:bg-black/5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.avatar} />
                  <AvatarFallback>{userData?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
