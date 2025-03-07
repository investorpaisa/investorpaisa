
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CircleHeader } from '@/components/circles/CircleHeader';
import { CirclePosts } from '@/components/circles/CirclePosts';
import { CircleMembers } from '@/components/circles/CircleMembers';
import { CircleAbout } from '@/components/circles/CircleAbout';
import { getCircleById, getCircleMembers, getCirclePosts, joinCircle, leaveCircle } from '@/services/circles/circleService';

export default function Circle() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [circle, setCircle] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState(null);
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
        
        const sortedPosts = [...postsData].sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setPosts(sortedPosts);
        
        if (user) {
          const userMembership = membersData.find(m => m.user_id === user.id);
          setIsMember(!!userMembership);
          setMemberRole(userMembership ? userMembership.role : null);
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
        description: 'You have joined the circle.'
      });
      
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
        description: 'You have left the circle.'
      });
      
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

      <CircleHeader
        circle={circle}
        isMember={isMember}
        onJoin={handleJoinCircle}
        onLeave={handleLeaveCircle}
        onCreatePost={handleCreatePost}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <CirclePosts
            posts={posts}
            isMember={isMember}
            onCreatePost={handleCreatePost}
            onPostClick={(post) => navigate(`/post/${post.id}`)}
          />
        </TabsContent>

        <TabsContent value="members">
          <CircleMembers members={members} />
        </TabsContent>

        <TabsContent value="about">
          <CircleAbout circle={circle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
