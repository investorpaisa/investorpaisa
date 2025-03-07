
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, MapPin, Briefcase, GraduationCap, Award, Heart, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfileNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock profile data
  const profile = {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">{profile.username}</p>
                </div>
                
                <Button onClick={() => navigate('/edit-profile')}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
              
              <div className="mt-4">
                <p>{profile.bio}</p>
                
                {profile.location && (
                  <div className="flex items-center mt-2 text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" /> {profile.location}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.career && (
            <div className="flex items-start">
              <Briefcase className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Career</h3>
                <p className="text-muted-foreground">{profile.career}</p>
              </div>
            </div>
          )}
          
          {profile.education && (
            <div className="flex items-start">
              <GraduationCap className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Education</h3>
                <p className="text-muted-foreground">{profile.education}</p>
              </div>
            </div>
          )}
          
          {profile.certifications && (
            <div className="flex items-start">
              <Award className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Certifications</h3>
                <p className="text-muted-foreground">{profile.certifications}</p>
              </div>
            </div>
          )}
          
          {profile.achievements && (
            <div className="flex items-start">
              <Award className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Achievements</h3>
                <p className="text-muted-foreground">{profile.achievements}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger 
            value="posts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ip-teal data-[state=active]:shadow-none py-3"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="interactions" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ip-teal data-[state=active]:shadow-none py-3"
          >
            Interactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="pt-6 space-y-6">
          {profile.posts.length > 0 ? (
            profile.posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="mr-1 h-4 w-4" />
                        {post.likes} likes
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        {post.comments} comments
                      </span>
                    </div>
                    <div>{post.date}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No posts yet.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="interactions" className="pt-6">
          {profile.interactions.length > 0 ? (
            <div className="space-y-6">
              {profile.interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      {interaction.type === 'like' ? (
                        <Heart className="h-4 w-4 mr-2 text-ip-teal" />
                      ) : (
                        <MessageCircle className="h-4 w-4 mr-2 text-ip-teal" />
                      )}
                      <span>
                        You {interaction.type === 'like' ? 'liked' : 'commented on'} a post by {interaction.post.author}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{interaction.post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {interaction.type === 'comment' && interaction.content && (
                      <div className="bg-muted p-3 rounded-md mb-3">
                        <p className="text-sm italic">"{interaction.content}"</p>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground text-right">
                      {interaction.post.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No interactions yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileNew;
