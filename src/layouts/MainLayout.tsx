
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { MainSidebar } from '@/components/main-sidebar';
import { MainNav } from '@/components/main-nav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-gold/30 blur-3xl animate-float" style={{ top: "20%", left: "10%" }}></div>
        <div className="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl animate-float-slow" style={{ bottom: "10%", right: "10%" }}></div>
      </div>
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <MainSidebar />
        </motion.div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navigation */}
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <MainNav />
          </motion.div>
          
          {/* Page content */}
          <motion.main 
            className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default MainLayout;
