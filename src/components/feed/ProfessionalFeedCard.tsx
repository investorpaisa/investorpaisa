
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, MessageCircle, Share2, Bookmark, 
  MoreHorizontal, MapPin, Building, 
  Users, TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfessionalPost } from '@/types/professional';
import { LikesModal } from '@/components/engagement/LikesModal';
import { formatDistanceToNow } from 'date-fns';

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
  const [showLikesModal, setShowLikesModal] = useState(false);

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('•') || line.startsWith('✅') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
        return <div key={index} className="ml-4 my-1">{line}</div>;
      }
      if (line.includes('#')) {
        const parts = line.split(' ');
        return (
          <div key={index} className="my-2">
            {parts.map((part, i) => 
              part.startsWith('#') ? (
                <span key={i} className="text-blue-600 font-medium hover:underline cursor-pointer">
                  {part}{' '}
                </span>
              ) : (
                <span key={i}>{part}{' '}</span>
              )
            )}
          </div>
        );
      }
      return <div key={index} className="my-2">{line}</div>;
    });
  };

  return (
    <>
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-transparent hover:ring-blue-200 transition-all cursor-pointer">
                <AvatarImage src={post.author.avatar_url || ''} alt={post.author.full_name} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {post.author.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                    {post.author.full_name}
                  </h3>
                  {post.author.is_verified && (
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  )}
                  {post.author.premium_member && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">{post.author.headline}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                  {post.author.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{post.author.location}</span>
                    </div>
                  )}
                  {post.author.current_company && (
                    <div className="flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{post.author.current_company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save post</DropdownMenuItem>
                <DropdownMenuItem>Copy link to post</DropdownMenuItem>
                <DropdownMenuItem>Report post</DropdownMenuItem>
                <DropdownMenuItem>Hide posts from {post.author.full_name}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <CardContent className="px-4 py-0">
          <div className="text-gray-800 leading-relaxed">
            {formatContent(post.content)}
          </div>
          
          {post.image_url && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img 
                src={post.image_url} 
                alt="Post content" 
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
          
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.hashtags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        {/* Engagement Stats */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {post.likes > 0 && (
                <button 
                  onClick={() => setShowLikesModal(true)}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Heart className="h-3 w-3 text-white fill-current" />
                    </div>
                    <span>{post.likes}</span>
                  </div>
                </button>
              )}
              {post.comments > 0 && (
                <span>{post.comments} comments</span>
              )}
              {post.reposts > 0 && (
                <span>{post.reposts} reposts</span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Users className="h-3 w-3" />
              <span>{post.author.followers.toLocaleString()} followers</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <CardFooter className="px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 transition-colors ${
                post.is_liked 
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
              <span className="font-medium">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => onComment(post.id)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Repost</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 transition-colors ${
                post.is_saved 
                  ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => onSave(post.id)}
            >
              <Bookmark className={`h-5 w-5 ${post.is_saved ? 'fill-current' : ''}`} />
              <span className="font-medium">Save</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <LikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        postId={post.id}
        totalLikes={post.likes}
      />
    </>
  );
};
