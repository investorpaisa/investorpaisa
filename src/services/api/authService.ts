
import { toast } from "@/hooks/use-toast";
import { User } from './types';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would make a fetch call to your backend
      if (email && password) {
        // Mock successful login
        const user: User = {
          id: "user-1",
          name: "John Doe",
          email: email,
          avatar: "https://i.pravatar.cc/150?u=user-1",
          role: 'user',
          followers: 42,
          following: 128,
          joined: "January 2023"
        };
        
        // Store user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        toast({
          title: "Login successful",
          description: "Welcome back to Investor Paisa!"
        });
        
        return user;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async register(name: string, email: string, password: string): Promise<User | null> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would make a fetch call to your backend
      if (name && email && password) {
        // Mock successful registration
        const user: User = {
          id: "user-" + Date.now(),
          name: name,
          email: email,
          role: 'user',
          followers: 0,
          following: 0,
          joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        
        // Store user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        toast({
          title: "Registration successful",
          description: "Welcome to Investor Paisa!"
        });
        
        return user;
      }
      
      throw new Error("Invalid registration details");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async logout(): Promise<boolean> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear user from localStorage
    localStorage.removeItem('currentUser');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    
    return true;
  }
};
