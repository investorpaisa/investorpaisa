
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ProfessionalHome from '@/pages/ProfessionalHome';
import ProfileNew from '@/pages/ProfileNew';
import Market from '@/pages/Market';
import Inbox from '@/pages/Inbox';
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

            {/* Protected routes with main layout */}
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="professional" element={<ProfessionalHome />} />
              <Route path="home" element={<Navigate to="/professional" replace />} />
              <Route path="feed" element={<Navigate to="/professional" replace />} />
              <Route path="profile" element={<ProfileNew />} />
              <Route path="profile/:userId" element={<ProfileNew />} />
              <Route path="market" element={<Market />} />
              <Route path="messages" element={<Inbox />} />
              <Route path="network" element={<MyNetwork />} />
              <Route path="notifications" element={<div className="p-6">Notifications coming soon...</div>} />
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
