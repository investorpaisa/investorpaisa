
import { useState } from 'react';
import { NewsArticle } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Share2, Bookmark, Clock, Heart, MessageSquare, Repeat2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useCommentsDialog } from '@/hooks/useCommentsDialog';
import { toast } from 'sonner';
import { RepostDialog } from '@/components/engagement/RepostDialog';

interface NewsCardProps {
  article: NewsArticle;
  onBookmark?: (articleId: string) => void;
  onShare?: (articleId: string) => void;
  isBookmarked?: boolean;
}

const NewsCard = ({ article, onBookmark, onShare, isBookmarked = false }: NewsCardProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20));
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 10));
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const { openComments } = useCommentsDialog();

  // Convert NewsArticle to Post format for reposting
  const articleAsPost = {
    id: parseInt(article.id),
    author: {
      name: article.source || 'News Source',
      username: (article.source || 'news').toLowerCase().replace(/\s/g, ''),
      avatar: article.thumbnail_url || '/placeholder.svg',
      role: 'publisher',
      verified: true,
    },
    category: article.category,
    title: article.title,
    content: article.summary || '',
    timestamp: article.published_at || 'Recently',
    likes: likeCount,
    comments: commentCount,
    shares: Math.floor(Math.random() * 15),
    saved: bookmarked
  };

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

  const handleRepost = () => {
    setRepostDialogOpen(true);
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
    <Card className="w-full border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="w-fit bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
              {article.category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{getPublishedTime()}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {article.source}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-3">
        <CardTitle 
          className="text-base font-medium leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2" 
          onClick={handleOpenArticle}
        >
          {article.title}
        </CardTitle>
        
        {article.summary && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {article.summary}
          </CardDescription>
        )}
        
        {article.thumbnail_url && (
          <div className="w-full h-32 overflow-hidden rounded-md bg-gray-100">
            <img 
              src={article.thumbnail_url} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" onClick={handleLike}>
              <Heart className="h-3 w-3" fill={liked ? "currentColor" : "none"} color={liked ? "#10b981" : "currentColor"} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" onClick={handleComment}>
              <MessageSquare className="h-3 w-3" />
              <span className="text-xs">{commentCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" onClick={handleRepost}>
              <Repeat2 className="h-3 w-3" />
              <span className="text-xs hidden sm:inline">Repost</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-8 px-3 gap-1" onClick={handleOpenArticle}>
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs hidden sm:inline">Read</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleShare}>
              <Share2 className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 ${bookmarked ? 'text-blue-600' : ''}`}
              onClick={handleBookmark}
            >
              <Bookmark className="h-3 w-3" fill={bookmarked ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardFooter>
      
      <RepostDialog 
        open={repostDialogOpen} 
        onOpenChange={setRepostDialogOpen} 
        post={articleAsPost} 
      />
    </Card>
  );
};

export default NewsCard;
