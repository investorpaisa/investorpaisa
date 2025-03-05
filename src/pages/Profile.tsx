
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, Mail, Users, MessageCircle, Calendar, Briefcase, 
  MapPin, FileText, Award, TrendingUp, Shield, BookOpen
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  
  // Determine if we're viewing own profile or someone else's
  const isOwnProfile = !id;
  
  // Mock profile data - in a real app, this would be fetched based on the ID
  const profile = {
    name: "Jai Sharma",
    username: "@jaisharma",
    avatar: "/placeholder.svg",
    role: "Financial Advisor",
    location: "Mumbai, India",
    joinDate: "June 2023",
    bio: "SEBI Registered Investment Advisor with 8+ years of experience. Specializing in equity investments, retirement planning, and tax optimization strategies for young professionals.",
    followers: 1240,
    following: 356,
    posts: 89,
    expertise: ["Equity", "Tax Planning", "Retirement", "Mutual Funds"],
    credentials: [
      { name: "Certified Financial Planner (CFP)", year: "2018" },
      { name: "SEBI Registered Investment Advisor", year: "2019" },
      { name: "MBA Finance, IIM Ahmedabad", year: "2016" }
    ],
    recentPosts: [
      { 
        title: "5 Tax-saving strategies you're probably missing out on",
        engagement: "245 likes • 43 comments",
        date: "2 days ago"
      },
      { 
        title: "How to build a recession-proof investment portfolio",
        engagement: "192 likes • 27 comments",
        date: "1 week ago"
      },
      { 
        title: "The beginner's guide to SIP investing in 2024",
        engagement: "318 likes • 56 comments",
        date: "2 weeks ago"
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                    <p>{profile.username}</p>
                    <p className="hidden sm:block">•</p>
                    <p className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {profile.role}
                    </p>
                  </div>
                </div>
                
                {isOwnProfile ? (
                  <Button variant="outline" className="md:self-start">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button>
                      <Users className="mr-2 h-4 w-4" /> Follow
                    </Button>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" /> Message
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-3">
                <p>{profile.bio}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" /> {profile.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" /> Joined {profile.joinDate}
                  </span>
                </div>
                
                <div className="flex gap-6 pt-2">
                  <div>
                    <span className="font-bold">{profile.followers}</span>
                    <span className="text-muted-foreground ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{profile.following}</span>
                    <span className="text-muted-foreground ml-1">Following</span>
                  </div>
                  <div>
                    <span className="font-bold">{profile.posts}</span>
                    <span className="text-muted-foreground ml-1">Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            value="expertise" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ip-teal data-[state=active]:shadow-none py-3"
          >
            Expertise
          </TabsTrigger>
          <TabsTrigger 
            value="credentials" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ip-teal data-[state=active]:shadow-none py-3"
          >
            Credentials
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="pt-6 space-y-6">
          {profile.recentPosts.map((post, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    <span>{post.engagement}</span>
                  </div>
                  <div>{post.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="expertise" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-ip-teal" />
                Areas of Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-muted px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <TrendingUp className="mr-1 h-4 w-4 text-ip-teal" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="credentials" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-ip-teal" />
                Certifications & Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.credentials.map((credential, index) => (
                  <div key={index} className="flex items-start">
                    <BookOpen className="mr-2 h-5 w-5 text-ip-teal mt-0.5" />
                    <div>
                      <h3 className="font-medium">{credential.name}</h3>
                      <p className="text-sm text-muted-foreground">{credential.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
