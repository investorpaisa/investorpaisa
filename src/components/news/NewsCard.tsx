
import { useState } from 'react';
import { NewsArticle } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Share2, Bookmark, Clock, Heart, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useCommentsDialog } from '@/hooks/useCommentsDialog';
import { toast } from 'sonner';

interface NewsCardProps {
  article: NewsArticle;
  onBookmark?: (articleId: string) => void;
  onShare?: (articleId: string) => void;
  isBookmarked?: boolean;
}

const NewsCard = ({ article, onBookmark, onShare, isBookmarked = false }: NewsCardProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20)); // Mock like count
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 10)); // Mock comment count
  const { openComments } = useCommentsDialog();

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) {
      onBookmark(article.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(article.id);
    }
  };

  const handleOpenArticle = () => {
    window.open(article.url, '_blank');
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
    toast.success(liked ? 'Removed like' : 'Added like');
  };

  const handleComment = () => {
    openComments({
      id: article.id,
      title: article.title,
      content: article.summary || '',
      entityType: 'news',
      commentsCount: commentCount,
      onCommentAdded: () => setCommentCount(prev => prev + 1)
    });
  };

  const getPublishedTime = () => {
    if (!article.published_at) return 'Recently';
    try {
      return formatDistanceToNow(new Date(article.published_at), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Card className="border shadow-sm animate-hover-rise h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Badge variant="outline" className="bg-ip-blue-50 text-ip-blue-800 mb-2 hover:bg-ip-blue-100 transition-colors">
              {article.category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3 mr-1" />
              <span>{getPublishedTime()}</span>
              <span className="mx-2">•</span>
              <span>{article.source}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <CardTitle className="text-lg font-medium mb-2 line-clamp-2 hover:text-ip-teal cursor-pointer" onClick={handleOpenArticle}>
          {article.title}
        </CardTitle>
        {article.summary && (
          <CardDescription className="text-muted-foreground text-sm line-clamp-3">
            {article.summary}
          </CardDescription>
        )}
        {article.thumbnail_url && (
          <div className="mt-3 w-full h-32 overflow-hidden rounded-md">
            <img 
              src={article.thumbnail_url} 
              alt={article.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="gap-1" onClick={handleLike}>
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} color={liked ? "#10b981" : "currentColor"} />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1" onClick={handleComment}>
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount}</span>
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleOpenArticle}>
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Read Article</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${bookmarked ? 'text-ip-teal' : ''}`}
            onClick={handleBookmark}
          >
            <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
