
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { InvestorPaisaHome } from '@/pages/InvestorPaisaHome';
import { MyNetwork } from '@/pages/MyNetwork';
import { ProfileNew } from '@/pages/ProfileNew';
import { Market } from '@/pages/Market';
import { Onboarding } from '@/pages/Onboarding';
import { PageLoader } from '@/components/ui/page-loader';
import { ErrorToast } from '@/components/ui/error-toast';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <InvestorPaisaHome />
              </ProtectedRoute>
            } />
            
            <Route path="/network" element={
              <ProtectedRoute>
                <MyNetwork />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileNew />
              </ProtectedRoute>
            } />
            
            <Route path="/market" element={
              <ProtectedRoute>
                <Market />
              </ProtectedRoute>
            } />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
          
          <PageLoader />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
