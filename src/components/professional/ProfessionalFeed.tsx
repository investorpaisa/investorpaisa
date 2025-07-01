
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfessionalPost {
  id: string;
  author: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  tags?: string[];
}

interface ProfessionalFeedProps {
  posts: ProfessionalPost[];
}

export const ProfessionalFeed: React.FC<ProfessionalFeedProps> = ({ posts }) => {
  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleRepost = (postId: string) => {
    console.log('Repost:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    {post.author.verified && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{post.author.title} at {post.author.company}</p>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
            
            {post.image && (
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full rounded-lg mb-3 max-h-96 object-cover"
              />
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-2 ${post.isLiked ? 'text-blue-600' : 'text-gray-600'}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className="h-4 w-4" fill={post.isLiked ? "currentColor" : "none"} />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600"
                  onClick={() => handleComment(post.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600"
                  onClick={() => handleRepost(post.id)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">{post.reposts}</span>
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600"
                onClick={() => handleShare(post.id)}
              >
                <Send className="h-4 w-4" />
                <span className="text-xs">Send</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
