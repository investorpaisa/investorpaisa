
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
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
  HelpCircle
} from 'lucide-react';

export function MainSidebar() {
  return (
    <Sidebar className="border-r border-premium-dark-700/20 bg-premium-dark-800/80 backdrop-blur-md">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-6">
          <Link to="/feed">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">Investor</span>
              <span className="text-xl text-premium-gold">Paisa</span>
            </div>
          </Link>
        </div>
        
        <div className="space-y-1 px-2 mb-6">
          <Link to="/feed" className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-premium-dark-700/30 transition-colors">
            <Home className="h-5 w-5" />
            <span>Feed</span>
          </Link>
          <Link to="/discover" className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-premium-dark-700/30 transition-colors">
            <Globe className="h-5 w-5" />
            <span>Discover</span>
          </Link>
          <Link to="/market" className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-premium-dark-700/30 transition-colors">
            <BarChart2 className="h-5 w-5" />
            <span>Market Data</span>
          </Link>
          <Link to="/inbox" className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-premium-dark-700/30 transition-colors">
            <Inbox className="h-5 w-5" />
            <span>Messages</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-premium-dark-700/30 transition-colors">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </div>
        
        <div className="border-t border-premium-dark-700/20 pt-6 px-2">
          <h4 className="mb-2 px-3 text-sm font-semibold text-muted-foreground">My Communities</h4>
          <div className="space-y-1">
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/StockMarket <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/PersonalFinance <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/Investing <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/OptionsTrading <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/RealEstate <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/CryptoCurrency <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/IndianStocks <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/MutualFunds <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/Bonds <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full">
              r/Commodities <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" className="justify-start px-3 hover:bg-premium-dark-700/30 w-full mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Join Community
          </Button>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex flex-col space-y-3 px-4 py-3">
          <PremiumButton variant="default" className="justify-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </PremiumButton>
          <Button variant="ghost" className="justify-start hover:bg-premium-dark-700/30">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-premium-dark-700/30">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-premium-dark-700/30">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
