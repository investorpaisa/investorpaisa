
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import FinancialOnboarding from "@/pages/FinancialOnboarding";
import Portfolio from "@/pages/Portfolio";
import Home from "@/pages/Home";
import Feed from "@/pages/Feed";
import Market from "@/pages/Market";
import Discover from "@/pages/Discover";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import Circles from "@/pages/Circles";
import Circle from "@/pages/Circle";
import Inbox from "@/pages/Inbox";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import MarketWithComparison from "@/pages/MarketWithComparison";
import ProfileNew from "@/pages/ProfileNew";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <FinancialOnboarding />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="home" element={<Home />} />
            <Route path="feed" element={<Feed />} />
            <Route path="discover" element={<Discover />} />
            <Route path="market" element={<Market />} />
            <Route path="market-comparison" element={<MarketWithComparison />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:userId" element={<ProfileNew />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="circles" element={<Circles />} />
            <Route path="circles/:circleId" element={<Circle />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Legacy onboarding route */}
            <Route path="onboarding-legacy" element={<Onboarding />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
