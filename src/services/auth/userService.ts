import { supabase } from "@/integrations/supabase/client";
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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      throw error;
    }

    // Track Google signin attempt
    trackUserEvent.login('google');

    console.log("Redirecting to Google auth:", data);
  } catch (error) {
    console.error("Google sign in error:", error);
    showToast(
      "Google sign in failed",
      error instanceof Error ? error.message : "Something went wrong",
      "destructive"
    );
    throw error;
  }
};
