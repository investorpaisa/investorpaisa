import { supabase } from "@/integrations/supabase/client";
import { firebaseAuth, googleProvider } from "@/integrations/firebase";
import { User } from "../api";
import { fetchUserProfile, formatUser, showToast } from "./utils";
import { trackUserEvent } from "@/services/analytics/googleAnalytics";

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Track logout event
    trackUserEvent.logout();
    
    showToast(
      "Logged out",
      "You have been successfully logged out"
    );
    
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    showToast(
      "Logout failed",
      error instanceof Error ? error.message : "Something went wrong",
      "destructive"
    );
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }
    
    // Get user profile data
    const profileData = await fetchUserProfile(session.user.id);
    
    return formatUser(session.user, profileData);
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

export const signInWithGoogle = async () => {
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
      throw error;
    }

    trackUserEvent.login('google');
  } catch (error) {
    console.error('Google sign in error:', error);
    showToast(
      'Google sign in failed',
      error instanceof Error ? error.message : 'Something went wrong',
      'destructive'
    );
    throw error;
  }
};
