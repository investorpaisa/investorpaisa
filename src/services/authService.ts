import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "./api";

class AuthService {
  async register(name: string, email: string, password: string): Promise<User | null> {
    try {
      // Register user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            username: email.split('@')[0],
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account"
      });

      // Return user data
      return {
        id: authData.user.id,
        name: name,
        email: email,
        role: 'user',
        followers: 0,
        following: 0,
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      return null;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      // Login with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Check specifically for email not confirmed error
        if (authError.message.includes('Email not confirmed') || authError.code === 'email_not_confirmed') {
          throw { ...authError, code: 'email_not_confirmed' };
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Login failed");
      }

      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      toast({
        title: "Login successful",
        description: "Welcome back to Investor Paisa!"
      });

      // Return user data with the correct role type
      return {
        id: authData.user.id,
        name: profileData?.full_name || authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        avatar: profileData?.avatar_url,
        role: (profileData?.role as 'user' | 'expert') || 'user',
        followers: profileData?.followers || 0,
        following: profileData?.following || 0,
        joined: new Date(authData.user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error("Login error:", error);
      
      // Don't show toast for email_not_confirmed error since we'll handle it in the UI
      if (error instanceof Error && error.message.includes('Email not confirmed') || 
         (typeof error === 'object' && error !== null && 'code' in error && error.code === 'email_not_confirmed')) {
        throw error;
      }
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      throw error; // Re-throw to allow the component to handle it
    }
  }

  async logout(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }
      
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      return {
        id: session.user.id,
        name: profileData?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        avatar: profileData?.avatar_url,
        role: (profileData?.role as 'user' | 'expert') || 'user',
        followers: profileData?.followers || 0,
        following: profileData?.following || 0,
        joined: new Date(session.user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
