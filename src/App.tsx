
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from '@/layouts/MainLayout';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Feed from '@/pages/Feed';
import Profile from '@/pages/Profile';
import Inbox from '@/pages/Inbox';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        path: "feed",
        element: <ProtectedRoute><Feed /></ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "profile/:id",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "inbox",
        element: <ProtectedRoute><Inbox /></ProtectedRoute>,
      },
    ],
  },
]);

const queryClient = new QueryClient();

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
