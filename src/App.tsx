
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
import Home from '@/pages/Home';
import Inbox from '@/pages/Inbox';
import ProfileNew from '@/pages/ProfileNew';
import EditProfile from '@/pages/EditProfile';
import Landing from '@/pages/Landing';
import NotFound from '@/pages/NotFound';
import Circle from '@/pages/Circle';
import Circles from '@/pages/Circles';
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
          <Route path="home" element={<Home />} />
          <Route path="feed" element={<Home />} /> {/* Redirect from old path */}
          <Route path="discover" element={<Home />} /> {/* Redirect from old path */}
          <Route path="market" element={<Market />} />
          <Route path="mycircle" element={<Circles />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile" element={<ProfileNew />} />
          <Route path="edit-profile" element={<EditProfile />} />
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
