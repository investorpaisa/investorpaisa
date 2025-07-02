
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import ModernLayout from '@/layouts/ModernLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ModernHome from '@/pages/ModernHome';
import ProfileNew from '@/pages/ProfileNew';
import Market from '@/pages/Market';
import Inbox from '@/pages/Inbox';
import Notifications from '@/pages/Notifications';
import { MyNetwork } from '@/pages/MyNetwork';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Protected routes with modern layout */}
            <Route path="/" element={<ProtectedRoute><ModernLayout /></ProtectedRoute>}>
              <Route path="professional" element={<ModernHome />} />
              <Route path="home" element={<Navigate to="/professional" replace />} />
              <Route path="feed" element={<Navigate to="/professional" replace />} />
              <Route path="profile" element={<ProfileNew />} />
              <Route path="profile/:userId" element={<PublicProfile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="market" element={<Market />} />
              <Route path="messages" element={<Inbox />} />
              <Route path="network" element={<MyNetwork />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
