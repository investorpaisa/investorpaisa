
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, PlusCircle, ChevronLeft, Flag, Pin, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import PostCard from '@/components/posts/PostCard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedPost, Circle as CircleType, CircleMember } from '@/types';

import { getCircleById, getCircleMembers, getCirclePosts, joinCircle, leaveCircle } from '@/services/circles/circleService';

export default function Circle() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [circle, setCircle] = useState<CircleType | null>(null);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<'admin' | 'co-admin' | 'member' | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  
  useEffect(() => {
    const fetchCircleData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const circleData = await getCircleById(id);
        const membersData = await getCircleMembers(id);
        const postsData = await getCirclePosts(id);
        
        setCircle(circleData);
        setMembers(membersData);
        
        // Sort posts - pinned first, then by date
        const sortedPosts = [...postsData].sort((a, b) => {
          // First sort by pin status
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          
          // Then sort by date
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setPosts(sortedPosts);
        
        // Check if the current user is a member
        if (user) {
          const userMembership = membersData.find(m => m.user_id === user.id);
          setIsMember(!!userMembership);
          setMemberRole(userMembership ? userMembership.role as any : null);
        }
      } catch (error) {
        console.error('Error fetching circle data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load circle data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCircleData();
  }, [id, user, toast]);
  
  const handleJoinCircle = async () => {
    if (!id || !user) return;
    
    try {
      await joinCircle(id);
      setIsMember(true);
      setMemberRole('member');
      toast({
        title: 'Success',
        description: 'You have joined the circle.',
      });
      
      // Refresh members list
      const membersData = await getCircleMembers(id);
      setMembers(membersData);
    } catch (error) {
      console.error('Error joining circle:', error);
      toast({
        title: 'Error',
        description: 'Failed to join circle. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const handleLeaveCircle = async () => {
    if (!id || !user) return;
    
    try {
      await leaveCircle(id);
      setIsMember(false);
      setMemberRole(null);
      toast({
        title: 'Success',
        description: 'You have left the circle.',
      });
      
      // Refresh members list
      const membersData = await getCircleMembers(id);
      setMembers(membersData);
    } catch (error) {
      console.error('Error leaving circle:', error);
      toast({
        title: 'Error', 
        description: 'Failed to leave circle. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCreatePost = () => {
    // Navigate to create post page
    navigate('/create-post', { state: { circleId: id } });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!circle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <h2 className="text-xl font-semibold">Circle not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl py-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{circle.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {circle.type === 'public' ? 'Public Circle' : 'Private Circle'} • {circle.member_count || 0} members • {circle.post_count || 0} posts
              </p>
            </div>
            
            <div className="flex space-x-2">
              {!isMember ? (
                <Button onClick={handleJoinCircle}>Join Circle</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleLeaveCircle}>Leave Circle</Button>
                  <Button onClick={handleCreatePost}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Post
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">{circle.description || 'No description available'}</p>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {posts.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No posts yet</h3>
              <p className="text-muted-foreground mt-1">Be the first to post in this circle!</p>
              {isMember && (
                <Button className="mt-4" onClick={handleCreatePost}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="relative">
                  {post.is_pinned && (
                    <div className="absolute top-2 right-2 z-10 bg-secondary text-xs px-2 py-1 rounded-full flex items-center">
                      <Pin className="h-3 w-3 mr-1" /> Pinned
                    </div>
                  )}
                  <PostCard 
                    post={post}
                    isClickable
                    onClick={(post) => navigate(`/post/${post.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="members">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Members ({members.length})</h3>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(member => (
                <Card key={member.id} className="flex items-center p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profile?.avatar_url || ""} alt={member.profile?.full_name || ""} />
                    <AvatarFallback>
                      {member.profile?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-1">
                    <p className="font-medium">{member.profile?.full_name || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground">
                      @{member.profile?.username || "username"} • {member.role}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">About this Circle</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-muted-foreground">{circle.description || "No description available"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-muted-foreground capitalize">{circle.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-muted-foreground">{new Date(circle.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Members</p>
                  <p className="text-muted-foreground">{circle.member_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Posts</p>
                  <p className="text-muted-foreground">{circle.post_count || 0}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="text-destructive">
                  <Flag className="h-4 w-4 mr-2" /> Report Circle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
