import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/services/api';
import { authService } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<boolean>;
  updateUserProfile: (updatedProfile: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle OAuth errors from URL
    const handleOAuthError = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        toast({
          title: "Authentication failed",
          description: "Google sign-in failed. Please check your configuration and try again.",
          variant: "destructive"
        });
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    // Check for OAuth errors first
    handleOAuthError();

    // Check if user is already logged in
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          
          // Show success message for OAuth login
          if (session.user.app_metadata.provider === 'google') {
            toast({
              title: "Welcome!",
              description: "Successfully signed in with Google"
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      if (user) {
        setUser(user);
      }
      return user;
    } catch (error) {
      console.error("Login error in context:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.register(name, email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      // User will be set by the auth state change listener if successful
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const success = await authService.logout();
      if (success) {
        setUser(null);
      }
      return success;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (updatedProfile: Partial<User>) => {
    if (!user) return;
    
    // Update user state with the new profile data
    setUser({
      ...user,
      ...updatedProfile
    });

    // In a real app, we would also call an API to update the user's profile
    console.log('Profile updated:', updatedProfile);
    // This is where you would call a service to update the user profile
    // e.g. userService.updateProfile(user.id, updatedProfile)
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, signInWithGoogle, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
