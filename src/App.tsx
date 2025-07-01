
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';

// Import pages
import Landing from '@/pages/Landing';
import { InvestorPaisaHome } from '@/pages/InvestorPaisaHome';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import ProfileNew from '@/pages/ProfileNew';
import UserProfile from '@/pages/UserProfile';
import { MyNetwork } from '@/pages/MyNetwork';
import Market from '@/pages/Market';
import MarketWithComparison from '@/pages/MarketWithComparison';
import Discover from '@/pages/Discover';
import NotFound from '@/pages/NotFound';
import Inbox from '@/pages/Inbox';
import Portfolio from '@/pages/Portfolio';
import Dashboard from '@/pages/Dashboard';
import Onboarding from '@/pages/Onboarding';
import FinancialOnboarding from '@/pages/FinancialOnboarding';
import Feed from '@/pages/Feed';
import Home from '@/pages/Home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<InvestorPaisaHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/profile-new" element={<ProfileNew />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/network" element={<MyNetwork />} />
              <Route path="/market" element={<Market />} />
              <Route path="/market-comparison" element={<MarketWithComparison />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/messaging" element={<Inbox />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/financial-onboarding" element={<FinancialOnboarding />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/old-home" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
