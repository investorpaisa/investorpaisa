
import { supabase } from "@/integrations/supabase/client";
import { User } from "../api";
import { fetchUserProfile, formatUser, showToast } from "./utils";

export const login = async (email: string, password: string) => {
  try {
    // Login with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      // If it's an email not confirmed error but email confirmation is disabled, try to continue
      if (authError.message.includes('Email not confirmed') || authError.code === 'email_not_confirmed') {
        console.log("Email not confirmed error detected, attempting to continue anyway");
        
        // Try to get the user's data from supabase auth
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          // Get user profile data
          const profileData = await fetchUserProfile(userData.user.id);
          
          showToast(
            "Login successful",
            "Welcome back to Investor Paisa!"
          );
          
          return formatUser(userData.user, profileData);
        }
      }
      
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Login failed");
    }

    // Get user profile data
    const profileData = await fetchUserProfile(authData.user.id);

    showToast(
      "Login successful",
      "Welcome back to Investor Paisa!"
    );

    // Return user data
    return formatUser(authData.user, profileData);
  } catch (error) {
    console.error("Login error:", error);
    
    showToast(
      "Login failed",
      error instanceof Error ? error.message : "Something went wrong",
      "destructive"
    );
    
    // We're not re-throwing the error anymore to allow the UI to continue
    return null;
  }
};
