
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, MessageCircle, Share2, Send, MoreHorizontal, 
  ThumbsUp, Lightbulb, TrendingUp, Star, Bookmark
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ProfessionalPost } from '@/types/professional';

interface ProfessionalFeedCardProps {
  post: ProfessionalPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
}

export const ProfessionalFeedCard: React.FC<ProfessionalFeedCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onSave 
}) => {
  const [showAllContent, setShowAllContent] = useState(false);
  const [reaction, setReaction] = useState<'like' | 'love' | 'insight' | 'celebrate' | null>(
    post.is_liked ? 'like' : null
  );

  const contentPreview = post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content;
  const shouldShowReadMore = post.content.length > 300;

  const reactions = [
    { type: 'like', icon: ThumbsUp, color: 'text-blue-600', bgColor: 'hover:bg-blue-50' },
    { type: 'love', icon: Heart, color: 'text-red-600', bgColor: 'hover:bg-red-50' },
    { type: 'insight', icon: Lightbulb, color: 'text-yellow-600', bgColor: 'hover:bg-yellow-50' },
    { type: 'celebrate', icon: TrendingUp, color: 'text-green-600', bgColor: 'hover:bg-green-50' },
  ];

  const handleReaction = (reactionType: typeof reaction) => {
    setReaction(reaction === reactionType ? null : reactionType);
    onLike(post.id);
  };

  const getReactionIcon = () => {
    if (!reaction) return ThumbsUp;
    return reactions.find(r => r.type === reaction)?.icon || ThumbsUp;
  };

  const getReactionColor = () => {
    if (!reaction) return 'text-gray-600';
    return reactions.find(r => r.type === reaction)?.color || 'text-gray-600';
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
              <AvatarImage src={post.author.avatar_url} alt={post.author.full_name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {post.author.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                  {post.author.full_name}
                </h3>
                {post.author.is_verified && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    <Star className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {post.author.premium_member && (
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{post.author.headline}</p>
              <p className="text-sm text-gray-600">{post.author.current_company}</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
                <span className="text-xs text-gray-400">•</span>
                <Badge variant="outline" className="text-xs">
                  {post.visibility === 'public' ? 'Public' : post.visibility === 'connections' ? 'Connections' : 'Private'}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSave(post.id)}>
                <Bookmark className="mr-2 h-4 w-4" />
                Save post
              </DropdownMenuItem>
              <DropdownMenuItem>Copy link to post</DropdownMenuItem>
              <DropdownMenuItem>Follow {post.author.full_name}</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {showAllContent ? post.content : contentPreview}
          </p>
          
          {shouldShowReadMore && (
            <button
              onClick={() => setShowAllContent(!showAllContent)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              {showAllContent ? 'Show less' : 'Read more'}
            </button>
          )}
          
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.hashtags.map((tag, index) => (
                <span key={index} className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {post.image_url && (
          <div className="mb-4">
            <img 
              src={post.image_url} 
              alt="Post content" 
              className="w-full rounded-lg max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
          </div>
        )}
        
        {/* Engagement Stats */}
        {(post.likes > 0 || post.comments > 0) && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-3">
            <div className="flex items-center space-x-4">
              {post.likes > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <ThumbsUp className="w-2 h-2 text-white" />
                    </div>
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <Heart className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{post.likes}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {post.comments > 0 && (
                <span>{post.comments} comments</span>
              )}
              {post.reposts > 0 && (
                <span>{post.reposts} reposts</span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Reaction Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-2 px-4 py-2 ${getReactionColor()} hover:bg-blue-50 transition-colors`}
                >
                  {React.createElement(getReactionIcon(), { className: "h-5 w-5" })}
                  <span className="font-medium">
                    {reaction ? reaction.charAt(0).toUpperCase() + reaction.slice(1) : 'Like'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="p-2">
                <div className="flex space-x-1">
                  {reactions.map((r) => (
                    <Button
                      key={r.type}
                      variant="ghost"
                      size="sm"
                      className={`p-2 ${r.bgColor} ${r.color}`}
                      onClick={() => handleReaction(r.type as typeof reaction)}
                    >
                      <r.icon className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => onComment(post.id)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Comment</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Repost</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Send className="h-5 w-5" />
            <span className="font-medium">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
