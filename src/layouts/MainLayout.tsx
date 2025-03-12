
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { GeminiSearch } from '@/components/search/GeminiSearch';
import MarketTicker from '@/components/market/MarketTicker';
import { useState } from 'react';

const MainLayout = () => {
  const isMobile = useIsMobile();
  const [searchExpanded, setSearchExpanded] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainSidebar />
        <div className="flex flex-col flex-1">
          <div className={`sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 pt-2 ${isMobile ? 'px-2' : 'px-4 md:px-8'}`}>
            <GeminiSearch 
              expanded={searchExpanded} 
              onExpandToggle={setSearchExpanded}
              trendingTopics={[]}
            />
          </div>
          
          <main className={`flex-1 pb-16 ${isMobile ? 'px-2' : 'px-4 md:px-8'} w-full mx-auto`}>
            <Outlet />
          </main>
          
          {/* Market Ticker Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-10">
            <MarketTicker />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
