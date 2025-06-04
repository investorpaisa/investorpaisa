
import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { ProfileData } from '@/types/profile';

export const useProfileData = () => {
  const userData = useUserData();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to load profile data
  const loadProfileData = useCallback(() => {
    setLoading(true);
    
    // In a real app, we would fetch this data from an API
    // For now, we're using mock data based on the current user
    const mockProfile: ProfileData = {
      name: userData?.name || "Jai Sharma",
      username: userData?.username || "@jaisharma",
      avatar: userData?.avatar || "/placeholder.svg",
      bio: userData?.bio || "SEBI Registered Investment Advisor with 8+ years of experience. Specializing in equity investments, retirement planning, and tax optimization strategies for young professionals.",
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
  }, [userData]);

  // Load profile data when user changes
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Function to refresh profile data with updates
  const refreshProfile = useCallback((updatedData: Partial<ProfileData>) => {
    setProfileData(prevData => {
      if (!prevData) return null;
      return { ...prevData, ...updatedData };
    });
  }, []);

  // Function to add a post to the profile
  const addPostToProfile = useCallback((newPost: any) => {
    setProfileData(prevData => {
      if (!prevData) return null;
      
      // Create a post object in the expected format
      const profilePost = {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        likes: newPost.likes || 0,
        comments: newPost.comments || 0,
        date: newPost.timestamp || "Just now",
        isShared: false
      };
      
      return {
        ...prevData,
        posts: [profilePost, ...(prevData.posts || [])]
      };
    });
  }, []);

  // Function to add an interaction to the profile
  const addInteractionToProfile = useCallback((interaction: any) => {
    setProfileData(prevData => {
      if (!prevData) return null;
      
      return {
        ...prevData,
        interactions: [interaction, ...(prevData.interactions || [])]
      };
    });
  }, []);

  return { 
    profileData, 
    loading, 
    refreshProfile, 
    addPostToProfile, 
    addInteractionToProfile 
  };
};
