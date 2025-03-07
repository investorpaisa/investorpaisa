
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileData } from '@/types/profile';

export const useProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we're using mock data based on the current user
    setLoading(true);
    
    // Mock profile data
    const mockProfile: ProfileData = {
      name: user?.name || "Jai Sharma",
      username: user?.username || "@jaisharma",
      avatar: user?.avatar || "/placeholder.svg",
      bio: "SEBI Registered Investment Advisor with 8+ years of experience. Specializing in equity investments, retirement planning, and tax optimization strategies for young professionals.",
      location: "Mumbai, India",
      career: "Financial Advisor at XYZ Investments (2018-Present), Associate at ABC Financial Services (2015-2018)",
      education: "MBA Finance, IIM Ahmedabad (2016), B.Com, Delhi University (2013)",
      certifications: "Certified Financial Planner (CFP), SEBI Registered Investment Advisor",
      achievements: "Top 100 Financial Advisors in India (2022), Published author of 'Personal Finance Simplified'",
      interests: ["Equity", "Tax Planning", "Mutual Funds", "Retirement", "Insurance"],
      posts: [
        {
          id: "1",
          title: "5 Tax-saving strategies you're probably missing out on",
          content: "Tax planning is an essential aspect of financial planning...",
          likes: 245,
          comments: 43,
          date: "2 days ago",
          isShared: false
        },
        {
          id: "2",
          title: "How to build a recession-proof investment portfolio",
          content: "Market volatility is inevitable, but your portfolio can be resilient...",
          likes: 192,
          comments: 27,
          date: "1 week ago",
          isShared: false
        }
      ],
      interactions: [
        {
          id: "3",
          type: "like",
          post: {
            id: "101",
            title: "Understanding SIP investment strategies",
            author: "Priya Mehta",
            date: "3 days ago"
          }
        },
        {
          id: "4",
          type: "comment",
          content: "This is really helpful for beginners. Thanks for sharing!",
          post: {
            id: "102",
            title: "Beginner's guide to equity investment",
            author: "Rajesh Kumar",
            date: "5 days ago"
          }
        }
      ]
    };
    
    setProfileData(mockProfile);
    setLoading(false);
  }, [user]);

  return { profileData, loading };
};
