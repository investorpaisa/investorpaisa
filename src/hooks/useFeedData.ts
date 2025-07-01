
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  category: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  saved: boolean;
}

// Mock data for now - replace with real API calls later
const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "Priya Sharma",
      username: "priyasharma",
      avatar: "/placeholder.svg",
      role: "Senior Portfolio Manager",
      verified: true
    },
    category: "Market Analysis",
    title: "NIFTY 50 Technical Analysis - Bullish Momentum Expected",
    content: "Based on recent market trends and technical indicators, NIFTY 50 is showing strong bullish signals. The RSI is trending upward and we're seeing increased institutional buying. Key resistance levels to watch: 19,800 and 20,200.",
    timestamp: "2h",
    likes: 234,
    comments: 47,
    shares: 18,
    saved: false
  },
  {
    id: 2,
    author: {
      name: "Rajesh Kumar",
      username: "rajeshk",
      avatar: "/placeholder.svg",
      role: "Investment Advisor",
      verified: true
    },
    category: "Cryptocurrency",
    title: "Bitcoin's Path to ₹40L - Is It Sustainable?",
    content: "Bitcoin has crossed ₹35L mark again. While the momentum is strong, investors should be cautious about overleveraging. Key support levels and risk management strategies discussed.",
    timestamp: "4h",
    likes: 156,
    comments: 89,
    shares: 23,
    saved: false
  },
  {
    id: 3,
    author: {
      name: "Meera Patel",
      username: "meerap",
      avatar: "/placeholder.svg",
      role: "Financial Planner",
      verified: false
    },
    category: "Personal Finance",
    title: "SIP vs Lump Sum: Which Strategy Works Better in 2024?",
    content: "Comprehensive analysis of SIP vs Lump Sum investment strategies. Market volatility makes SIP more attractive for retail investors. Here's the data that backs this up...",
    timestamp: "6h",
    likes: 89,
    comments: 34,
    shares: 12,
    saved: false
  }
];

export const useFeedData = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    refreshPosts: () => {
      // Implement refresh logic here
      setPosts([...mockPosts]);
    }
  };
};
