
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
      // Email not confirmed errors should be handled gracefully
      if (authError.message.includes('Email not confirmed') || authError.code === 'email_not_confirmed') {
        // Instead of trying to login anyway, suggest email verification
        showToast(
          "Email not verified",
          "Please check your inbox and verify your email before logging in",
          "destructive"
        );
        return null;
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
    
    return null;
  }
};
