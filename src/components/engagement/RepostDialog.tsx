
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Repeat2, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

interface RepostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

export function RepostDialog({ open, onOpenChange, post }: RepostDialogProps) {
  const [caption, setCaption] = useState('');
  const [audienceType, setAudienceType] = useState('public');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleRepost = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Increment shares count would happen here
      
      toast.success('Post shared successfully');
      setCaption('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to share post');
      console.error('Error sharing post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Repeat2 className="h-5 w-5" />
            <span>Repost</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || '/placeholder.svg'} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'IP'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">@{user?.username || 'username'}</span>
          </div>
          
          <Textarea
            placeholder="Add a comment (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-24 resize-none"
          />
          
          <Card className="p-3 bg-muted/50 border">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">@{post.author.username}</span>
            </div>
            <h4 className="text-sm font-medium mb-1">{post.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
          </Card>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Share with</h4>
            <RadioGroup
              defaultValue="public"
              value={audienceType}
              onValueChange={setAudienceType}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Repeat2 className="h-4 w-4" />
                  <span>Everyone (Public)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="circle" id="circle" />
                <Label htmlFor="circle" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  <span>My Circles</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  <span>Direct Message</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleRepost} disabled={loading}>
            {loading ? 'Sharing...' : 'Share now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
