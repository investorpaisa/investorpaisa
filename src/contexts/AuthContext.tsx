
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { firebaseAuth, googleProvider } from '@/integrations/firebase';
import { UserProfile, OnboardingData, UserRole } from '@/types/app';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  // Legacy method names for backward compatibility
  register: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  login: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // If Supabase isn't configured, expose a minimal context so that
  // the landing page can render without runtime errors.
  if (!supabase) {
    const value: AuthContextType = {
      user: null,
      profile: null,
      loading: false,
      signUp: async () => ({ error: new Error('Supabase not configured') }),
      signIn: async () => ({ error: new Error('Supabase not configured') }),
      signOut: async () => {},
      updateProfile: async () => {},
      completeOnboarding: async () => {},
      signInWithGoogle: async () => {},
      register: async () => ({ error: new Error('Supabase not configured') }),
      login: async () => ({ user: null, error: new Error('Supabase not configured') })
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      if (!loading) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        // Transform the data to match UserProfile interface
        const userProfile: UserProfile = {
          id: data.id,
          username: data.username || '',
          email: user?.email || '',
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: (data.role as UserRole) || 'user',
          verification_status: 'unverified',
          financial_goals: {}, 
          risk_profile: undefined, 
          onboarding_completed: Boolean(data.onboarding_completed), // Ensure boolean conversion
          financial_literacy_score: undefined, 
          bio: data.bio,
          credentials: {}, 
          followers: data.followers || 0,
          following: data.following || 0,
          is_verified: data.is_verified || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfile(userProfile);
      } else {
        // Create profile if it doesn't exist
        await createProfile(userId);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: user?.email?.split('@')[0] || '',
          full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
          avatar_url: user?.user_metadata?.avatar_url || null,
          role: 'user',
          onboarding_completed: false
        })
        .select()
        .single();

      if (error) throw error;

      const userProfile: UserProfile = {
        id: data.id,
        username: data.username || '',
        email: user?.email || '',
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        role: 'user',
        verification_status: 'unverified',
        financial_goals: {},
        risk_profile: undefined,
        onboarding_completed: false,
        financial_literacy_score: undefined,
        bio: data.bio,
        credentials: {},
        followers: 0,
        following: 0,
        is_verified: false,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/home`
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Check your email",
        description: "We've sent you a verification link"
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in"
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
    
    // Refresh profile
    await fetchProfile(user.id);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) throw new Error('No user logged in');

    // Update the database to mark onboarding as complete
    const { error } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;

    // Update local profile state
    if (profile) {
      setProfile({
        ...profile,
        onboarding_completed: true,
        financial_goals: data.financial_goals,
        risk_profile: data.risk_profile
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });

      if (error) {
        toast({
          title: 'Google sign in failed',
          description: error.message,
          variant: 'destructive'
        });
        throw error;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: 'Google sign in failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Legacy methods for backward compatibility
  const register = signUp;
  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return { user, error: result.error };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    completeOnboarding,
    signInWithGoogle,
    register,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
