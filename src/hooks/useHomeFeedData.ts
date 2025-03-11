
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

interface TrendingTopic {
  id: number;
  topic: string;
  posts: number;
}

export const useHomeFeedData = () => {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = () => {
      setLoading(true);
      
      // Mock feed posts
      const posts: Post[] = [
        {
          id: 1,
          author: {
            name: 'Rahul Sharma',
            username: 'rahul_investments',
            avatar: '/placeholder.svg',
            role: 'Financial Advisor',
            verified: true,
          },
          category: 'Investments',
          title: 'How to start your SIP journey in 2023',
          content: 'Systematic Investment Plans (SIPs) are one of the best ways to invest in mutual funds. They allow you to invest a fixed amount at regular intervals, helping you build wealth over time through the power of compounding and rupee cost averaging. Here are the steps to get started...',
          timestamp: '2 hours ago',
          likes: 245,
          comments: 45,
          shares: 12,
          saved: false,
        },
        {
          id: 2,
          author: {
            name: 'Priya Patel',
            username: 'priya_tax',
            avatar: '/placeholder.svg',
            role: 'Tax Consultant',
            verified: true,
          },
          category: 'Taxation',
          title: 'Important tax changes for FY 2023-24 you should know',
          content: 'The government has introduced several changes in the tax regime for FY 2023-24. These changes impact how you calculate your tax liability and the deductions available. Let me break down the key changes that will affect most taxpayers...',
          timestamp: '5 hours ago',
          likes: 189,
          comments: 32,
          shares: 24,
          saved: true,
        },
        {
          id: 3,
          author: {
            name: 'Vikram Malhotra',
            username: 'vikram_finance',
            avatar: '/placeholder.svg',
            role: 'Personal Finance Expert',
            verified: false,
          },
          category: 'Personal Finance',
          title: 'Five credit card hacks that saved me ₹50,000 last year',
          content: 'Credit cards, when used wisely, can be powerful financial tools. Over the past year, I\'ve implemented several strategies that helped me save money and maximize rewards. Here are five credit card hacks that resulted in significant savings...',
          timestamp: '1 day ago',
          likes: 320,
          comments: 78,
          shares: 56,
          saved: false,
        },
      ];

      // Mock trending topics
      const topics: TrendingTopic[] = [
        {
          id: 1,
          topic: 'Budget 2023',
          posts: 345,
        },
        {
          id: 2,
          topic: 'Cryptocurrency Regulations',
          posts: 245,
        },
        {
          id: 3,
          topic: 'New Tax Regime',
          posts: 189,
        },
        {
          id: 4,
          topic: 'Mutual Fund SIP',
          posts: 156,
        },
        {
          id: 5,
          topic: 'Stock Market Crash',
          posts: 132,
        },
      ];

      setFeedPosts(posts);
      setTrendingTopics(topics);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Function to add a new post to the feed
  const addPost = (newPost: Post) => {
    // Add the new post at the top of the feed
    setFeedPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return {
    feedPosts,
    trendingTopics,
    loading,
    addPost
  };
};
