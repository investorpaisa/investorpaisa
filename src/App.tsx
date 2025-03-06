
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Components
import { CookieConsent } from "./components/LegalDisclaimer";

// Lazy-loaded pages
const Feed = lazy(() => import("./pages/Feed"));
const Discover = lazy(() => import("./pages/Discover"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Loading component
import { PageLoader } from "./components/ui/page-loader";

const queryClient = new QueryClient();

const App = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  
  useEffect(() => {
    // Ensure dark mode is applied
    document.documentElement.classList.add('dark');
    
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      // Show cookie consent after a short delay
      const timer = setTimeout(() => setShowCookieConsent(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieConsent(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route 
                path="login" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Login />
                  </Suspense>
                } 
              />
              <Route 
                path="register" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Register />
                  </Suspense>
                } 
              />
            </Route>
            
            {/* App routes */}
            <Route path="/app" element={<MainLayout />}>
              <Route 
                path="feed" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Feed />
                  </Suspense>
                } 
              />
              <Route 
                path="discover" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Discover />
                  </Suspense>
                } 
              />
              <Route 
                path="inbox" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Inbox />
                  </Suspense>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Profile />
                  </Suspense>
                } 
              />
              <Route 
                path="profile/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Profile />
                  </Suspense>
                } 
              />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Premium-styled Cookie consent banner */}
        {showCookieConsent && (
          <div className="fixed bottom-0 left-0 right-0 bg-premium-dark-800/95 backdrop-blur-xl p-4 z-50 border-t border-premium-gold/20 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/80 text-sm">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
              <div className="flex gap-2">
                <button className="btn-outline text-xs py-1.5 px-3">
                  Privacy Policy
                </button>
                <button 
                  className="btn-premium text-xs py-1.5 px-3"
                  onClick={handleAcceptCookies}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
