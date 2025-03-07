
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Settings, Plus, Lock, Unlock } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';
import { Circle as CircleType, CircleRole, CircleMember, EnhancedPost } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCircleById, getCircleMembers, getCirclePosts, joinCircle, leaveCircle } from '@/services/circles/circleService';

const Circle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [circle, setCircle] = useState<CircleType | null>(null);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [pinnedPosts, setPinnedPosts] = useState<EnhancedPost[]>([]);
  const [userRole, setUserRole] = useState<CircleRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch circle data
  useEffect(() => {
    const fetchCircleData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Get circle details
        const circleData = await getCircleById(id);
        setCircle(circleData);
        
        // Get members
        const membersData = await getCircleMembers(id);
        setMembers(membersData);
        
        // Check user's role in the circle
        const currentUser = membersData.find(member => member.profile?.id === 'current-user-id');
        if (currentUser) {
          setUserRole(currentUser.role as CircleRole);
        }
        
        // Get posts
        const postsData = await getCirclePosts(id);
        const pinned = postsData.filter(post => post.is_pinned);
        const regular = postsData.filter(post => !post.is_pinned);
        
        setPinnedPosts(pinned);
        setPosts(regular);
      } catch (error) {
        console.error("Error fetching circle data:", error);
        toast({
          title: "Error",
          description: "Failed to load circle information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCircleData();
  }, [id, toast]);
  
  // Handle joining circle
  const handleJoin = async () => {
    if (!circle || !id) return;
    
    try {
      const result = await joinCircle(id);
      if (result.success) {
        setUserRole(CircleRole.MEMBER);
        toast({
          title: "Success",
          description: `You have joined ${circle.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join circle",
        variant: "destructive"
      });
    }
  };
  
  // Handle leaving circle
  const handleLeave = async () => {
    if (!circle || !id) return;
    
    try {
      const result = await leaveCircle(id);
      if (result.success) {
        setUserRole(null);
        toast({
          title: "Success",
          description: `You have left ${circle.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave circle",
        variant: "destructive"
      });
    }
  };
  
  // Navigate to settings page
  const handleSettings = () => {
    if (id) {
      navigate(`/app/circles/${id}/settings`);
    }
  };
  
  // Create new post
  const handleCreatePost = () => {
    if (id) {
      navigate(`/app/create-post?circle=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse text-ip-teal">Loading circle...</div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <h2 className="text-2xl font-semibold">Circle not found</h2>
        <p className="text-muted-foreground">This circle doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/app/discover')}>Discover Circles</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Circle Header */}
      <Card className="border shadow-sm bg-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-ip-blue-400 to-ip-teal/80"></div>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border-4 border-card mt-[-3rem] shadow-md">
                <AvatarImage src={`https://avatar.vercel.sh/${circle.name}.png`} alt={circle.name} />
                <AvatarFallback>{circle.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{circle.name}</CardTitle>
                  {circle.type === 'private' ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{members.length} members</span>
                  <span>•</span>
                  <span>{posts.length + pinnedPosts.length} posts</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!userRole && (
                <Button onClick={handleJoin} className="gap-1">
                  <Users className="h-4 w-4" />
                  <span>Join Circle</span>
                </Button>
              )}
              
              {userRole && (
                <>
                  {(userRole === CircleRole.ADMIN || userRole === CircleRole.CO_ADMIN) && (
                    <Button variant="outline" onClick={handleSettings} className="gap-1">
                      <Settings className="h-4 w-4" />
                      <span>{!isMobile ? 'Manage Circle' : ''}</span>
                    </Button>
                  )}
                  
                  <Button variant={userRole ? 'default' : 'outline'} onClick={handleCreatePost} className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>{!isMobile ? 'Create Post' : ''}</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleLeave} className="gap-1">
                    {!isMobile ? 'Leave' : ''}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-muted-foreground">
            {circle.description || 'No description available for this circle.'}
          </CardDescription>
        </CardContent>
      </Card>
      
      {/* Circle Content */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-3 h-auto mb-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-0 space-y-4">
          {userRole && (
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    className="flex-1 justify-start font-normal text-muted-foreground h-10"
                    onClick={handleCreatePost}
                  >
                    Share something with this circle...
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-700">Pinned</Badge>
                <Separator className="flex-1" />
              </div>
              {pinnedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          
          {/* Regular Posts */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <Card className="border shadow-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No posts yet in this circle.</p>
                  {userRole && (
                    <Button onClick={handleCreatePost}>Create the first post</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Members ({members.length})</CardTitle>
              <CardDescription>People who are part of this circle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile?.avatar_url || '/placeholder.svg'} alt={member.profile?.username || 'Member'} />
                      <AvatarFallback>{member.profile?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.profile?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">@{member.profile?.username || 'username'}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {member.role === CircleRole.ADMIN 
                      ? 'Admin'
                      : member.role === CircleRole.CO_ADMIN
                        ? 'Co-Admin'
                        : 'Member'
                    }
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">About {circle.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Description</h3>
                <p className="text-muted-foreground">
                  {circle.description || 'No description available for this circle.'}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-sm mb-1">Type</h3>
                <div className="flex items-center gap-2">
                  {circle.type === 'private' ? (
                    <>
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Private Circle</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Public Circle</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {circle.type === 'private'
                    ? 'This is a private circle. Only members can see the content.'
                    : 'This is a public circle. Anyone can see the content and join.'}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-sm mb-1">Created</h3>
                <p className="text-muted-foreground">
                  {new Date(circle.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Circle;
