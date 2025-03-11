
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainSidebar />
        <div className="flex flex-col flex-1">
          <main className={`flex-1 pt-6 ${isMobile ? 'px-2' : 'px-4 md:px-8'} pb-12 w-full mx-auto`}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
