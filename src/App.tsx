
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Market from '@/pages/Market';
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Feed from '@/pages/Feed';
import Discover from '@/pages/Discover';
import Inbox from '@/pages/Inbox';
import Profile from '@/pages/Profile';
import Landing from '@/pages/Landing';
import NotFound from '@/pages/NotFound';
import Circle from '@/pages/Circle';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<Landing />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="feed" element={<Feed />} />
          <Route path="discover" element={<Discover />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile" element={<Profile />} />
          <Route path="market" element={<Market />} />
          <Route path="app/circles/:id" element={<Circle />} />
          <Route path="communities/:id" element={<Circle />} /> {/* Added for backward compatibility */}
          <Route path="app/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
