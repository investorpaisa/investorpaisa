
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { MainSidebar } from '@/components/main-sidebar';

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <MainSidebar />
        <div className="flex flex-col flex-1">
          <MainNav />
          <main className="flex-1 pt-20 px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
