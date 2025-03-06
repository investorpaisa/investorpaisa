
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, SearchIcon, MessagesSquare, TrendingUp, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function MainNav() {
  const location = useLocation();

  return (
    <header className="fixed top-0 w-full border-b border-premium-dark-700/50 bg-gradient-premium backdrop-blur-lg z-10">
      <div className="flex h-16 items-center px-4">
        <div className="md:hidden mr-2">
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center">
          <Link to="/app/feed" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-premium-gold font-bold">IP</span>
            <span className="hidden md:inline-block bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center mx-4 lg:mx-8">
          <div className="w-full max-w-md relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search for topics, users, or posts..." 
              className="w-full pl-9 bg-premium-dark-800/50 border-premium-dark-700/50 focus:border-premium-gold/50 focus:ring-1 focus:ring-premium-gold/20"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-premium-gold hover:bg-premium-dark-700/30">
            <TrendingUp className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-premium-gold hover:bg-premium-dark-700/30">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-premium-gold animate-glow" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-premium-gold hover:bg-premium-dark-700/30" asChild>
            <Link to="/app/inbox">
              <MessagesSquare className="h-5 w-5" />
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-premium-gold/20">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="bg-premium-dark-700 text-premium-gold">JP</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-premium-dark-800/90 backdrop-blur-md border border-premium-dark-700/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-premium-gold">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-premium-dark-700/50" />
              <DropdownMenuItem className="hover:bg-premium-dark-700/40 focus:bg-premium-dark-700/40" asChild>
                <Link to="/app/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-premium-dark-700/40 focus:bg-premium-dark-700/40">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-premium-gold" />
                  Upgrade to Premium
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-premium-dark-700/40 focus:bg-premium-dark-700/40">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-premium-dark-700/50" />
              <DropdownMenuItem className="hover:bg-premium-dark-700/40 focus:bg-premium-dark-700/40">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
