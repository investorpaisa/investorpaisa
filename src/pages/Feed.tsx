
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

// Dummy data for posts
const feedPosts = [
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

// Dummy data for trending topics
const trendingTopics = [
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

// Dummy data for experts to follow
const expertsToFollow = [
  {
    id: 1,
    name: 'Anand Kumar',
    role: 'SEBI Registered Advisor',
    avatar: '/placeholder.svg',
    followers: 12000,
  },
  {
    id: 2,
    name: 'Neha Gupta',
    role: 'Chartered Accountant',
    avatar: '/placeholder.svg',
    followers: 8500,
  },
  {
    id: 3,
    name: 'Ravi Desai',
    role: 'Investment Strategist',
    avatar: '/placeholder.svg',
    followers: 15600,
  },
];

const Feed = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({
    2: true, // Initialize post 2 as saved
  });

  const handleLike = (postId: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSave = (postId: number) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleProfile = (username: string) => {
    navigate(`/app/profile/${username}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Content Categories */}
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="grid grid-cols-4 h-auto mb-4">
            <TabsTrigger value="for-you" className="py-2">For You</TabsTrigger>
            <TabsTrigger value="following" className="py-2">Following</TabsTrigger>
            <TabsTrigger value="trending" className="py-2">Trending</TabsTrigger>
            <TabsTrigger value="latest" className="py-2">Latest</TabsTrigger>
          </TabsList>
          
          <TabsContent value="for-you" className="mt-0 p-0">
            <div className="space-y-6">
              {/* Create post card */}
              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-start font-normal text-muted-foreground h-10"
                    >
                      Share your financial knowledge or ask a question...
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Feed posts */}
              {feedPosts.map((post) => (
                <Card key={post.id} className="border shadow-sm animate-hover-rise">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          className="cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleProfile(post.author.username)}
                        >
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}{post.author.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 
                              className="font-medium hover:underline cursor-pointer"
                              onClick={() => handleProfile(post.author.username)}
                            >
                              {post.author.name}
                            </h4>
                            {post.author.verified && (
                              <span className="text-ip-teal">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-2">@{post.author.username}</span>
                            <span className="mr-2">•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-800 mr-2 hover:bg-ip-blue-100 transition-colors">
                          {post.category}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report content</DropdownMenuItem>
                            <DropdownMenuItem>Hide posts from this user</DropdownMenuItem>
                            <DropdownMenuItem>Copy link</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm">{post.content}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-1 ${likedPosts[post.id] ? 'text-ip-teal' : ''}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className="h-4 w-4" fill={likedPosts[post.id] ? "currentColor" : "none"} />
                        <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={savedPosts[post.id] ? 'text-ip-teal' : ''}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark className="h-4 w-4" fill={savedPosts[post.id] ? "currentColor" : "none"} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="following" className="mt-0 p-0">
            <div className="flex flex-col items-center justify-center py-10">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground text-center mb-4">Follow more users and experts to see their posts here</p>
              <Button>Discover People to Follow</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0 p-0">
            <div className="space-y-6">
              {feedPosts.sort((a, b) => b.likes - a.likes).map((post) => (
                <Card key={post.id} className="border shadow-sm animate-hover-rise">
                  <CardHeader className="p-4 pb-2">
                    {/* Same header as in for-you tab */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          className="cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleProfile(post.author.username)}
                        >
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}{post.author.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 
                              className="font-medium hover:underline cursor-pointer"
                              onClick={() => handleProfile(post.author.username)}
                            >
                              {post.author.name}
                            </h4>
                            {post.author.verified && (
                              <span className="text-ip-teal">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-2">@{post.author.username}</span>
                            <span className="mr-2">•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-800 mr-2 hover:bg-ip-blue-100 transition-colors">
                          {post.category}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report content</DropdownMenuItem>
                            <DropdownMenuItem>Hide posts from this user</DropdownMenuItem>
                            <DropdownMenuItem>Copy link</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm">{post.content}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-1 ${likedPosts[post.id] ? 'text-ip-teal' : ''}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className="h-4 w-4" fill={likedPosts[post.id] ? "currentColor" : "none"} />
                        <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={savedPosts[post.id] ? 'text-ip-teal' : ''}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark className="h-4 w-4" fill={savedPosts[post.id] ? "currentColor" : "none"} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="latest" className="mt-0 p-0">
            <div className="space-y-6">
              {feedPosts.reverse().map((post) => (
                <Card key={post.id} className="border shadow-sm animate-hover-rise">
                  {/* Same content as in for-you tab */}
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          className="cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleProfile(post.author.username)}
                        >
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}{post.author.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 
                              className="font-medium hover:underline cursor-pointer"
                              onClick={() => handleProfile(post.author.username)}
                            >
                              {post.author.name}
                            </h4>
                            {post.author.verified && (
                              <span className="text-ip-teal">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-2">@{post.author.username}</span>
                            <span className="mr-2">•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-800 mr-2 hover:bg-ip-blue-100 transition-colors">
                          {post.category}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report content</DropdownMenuItem>
                            <DropdownMenuItem>Hide posts from this user</DropdownMenuItem>
                            <DropdownMenuItem>Copy link</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm">{post.content}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-1 ${likedPosts[post.id] ? 'text-ip-teal' : ''}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className="h-4 w-4" fill={likedPosts[post.id] ? "currentColor" : "none"} />
                        <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={savedPosts[post.id] ? 'text-ip-teal' : ''}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark className="h-4 w-4" fill={savedPosts[post.id] ? "currentColor" : "none"} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Sidebar */}
      {!isMobile && (
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Trending Topics</CardTitle>
              <CardDescription>What people are discussing now</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between py-2 hover:bg-muted/30 px-2 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-ip-teal" />
                      <span className="font-medium text-sm">{topic.topic}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full text-ip-teal">
                View all trending topics
              </Button>
            </CardFooter>
          </Card>
          
          {/* Experts to Follow */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Experts to Follow</CardTitle>
              <CardDescription>Financial experts you might like</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {expertsToFollow.map((expert) => (
                  <div key={expert.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{expert.name}</h4>
                        <p className="text-xs text-muted-foreground">{expert.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Plus className="h-3 w-3" />
                      <span>Follow</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full text-ip-teal">
                View all experts
              </Button>
            </CardFooter>
          </Card>
          
          {/* Tips & Updates */}
          <Card className="border shadow-sm bg-ip-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Financial Tip of the Day</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-ip-blue-800">
                Did you know you can save up to ₹1.5 lakhs in taxes under Section 80C? Make sure you're maximizing your tax deductions before the financial year ends.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-ip-blue">
                More tips
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Feed;
