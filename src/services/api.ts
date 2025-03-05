
import { toast } from "@/hooks/use-toast";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'expert';
  followers: number;
  following: number;
  joined: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  isRead: boolean;
}

// API service with mock implementation
class APIService {
  // Authentication
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
  }
  
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
  }
  
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
  
  // Current user
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  // Feed
  async getFeedPosts(): Promise<Post[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock feed posts
    return Array(10).fill(0).map((_, index) => ({
      id: `post-${index}`,
      title: `Financial insight #${index + 1}`,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: {
        id: `user-${index % 5}`,
        name: `User ${index % 5}`,
        email: `user${index % 5}@example.com`,
        avatar: `https://i.pravatar.cc/150?u=user-${index % 5}`,
        role: index % 7 === 0 ? 'expert' : 'user',
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 100),
        joined: "January 2023"
      },
      category: ['Taxation', 'Investments', 'Personal Finance', 'Debt Management'][index % 4],
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: Math.random() > 0.5
    }));
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock categories
    return [
      {
        id: "cat-1",
        name: "Taxation",
        description: "Discussions about tax planning and compliance",
        icon: "shield",
        postCount: 234
      },
      {
        id: "cat-2",
        name: "Investments",
        description: "Topics related to various investment options",
        icon: "line-chart",
        postCount: 567
      },
      {
        id: "cat-3",
        name: "Personal Finance",
        description: "Budget planning and financial management",
        icon: "wallet",
        postCount: 432
      },
      {
        id: "cat-4",
        name: "Debt Management",
        description: "Strategies to manage and reduce debt",
        icon: "info",
        postCount: 189
      }
    ];
  }
  
  // Error handler helper
  private handleError(error: unknown): never {
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Unknown error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    throw new Error("An unexpected error occurred");
  }
}

// Create and export a singleton instance
export const apiService = new APIService();
