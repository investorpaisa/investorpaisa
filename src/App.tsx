
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

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

const App = () => (
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
