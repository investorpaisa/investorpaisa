
import { supabase } from "@/integrations/supabase/client";
import { User } from "../api";
import { showToast } from "./utils";
import { login } from "./loginService";

export const register = async (name: string, email: string, password: string): Promise<User | null> {
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

    // Auto-login the user after registration (without waiting for email confirmation)
    await login(email, password);

    showToast(
      "Registration successful",
      "Your account has been created successfully"
    );

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
    showToast(
      "Registration failed",
      error instanceof Error ? error.message : "Something went wrong",
      "destructive"
    );
    return null;
  }
};
