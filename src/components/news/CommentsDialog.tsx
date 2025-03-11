
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommentsDialogStore } from "@/hooks/useCommentsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { X, Heart, Reply, MoreHorizontal, Edit, Trash2, Flag, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock comments data
const generateMockComments = (count: number, entityId: string) => {
  return Array(count).fill(0).map((_, i) => ({
    id: `comment-${entityId}-${i}`,
    content: `This is a sample comment ${i + 1} about this article. It contains some thoughts and analysis.`,
    user_id: `user-${i % 5}`,
    post_id: entityId,
    parent_id: i % 7 === 0 ? null : `comment-${entityId}-${i % 3}`,
    created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    author: {
      id: `user-${i % 5}`,
      username: `user${i % 5}`,
      full_name: `User ${i % 5}`,
      avatar_url: `https://i.pravatar.cc/150?u=user-${i % 5}`,
      bio: `Bio for user ${i % 5}`,
      followers: Math.floor(Math.random() * 100),
      following: Math.floor(Math.random() * 50),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: i % 8 === 0,
      role: i % 10 === 0 ? 'expert' : 'user',
    },
    edited: i % 9 === 0,
    replies: [],
  }));
};

const organizeComments = (comments: any[]) => {
  const parentComments = comments.filter(c => !c.parent_id);
  const childComments = comments.filter(c => c.parent_id);
  
  parentComments.forEach(parent => {
    parent.replies = childComments.filter(child => child.parent_id === parent.id);
  });
  
  return parentComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const Comment = ({ comment, onReply, currentUser }: any) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 10));
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const isOwnComment = currentUser?.id === comment.user_id;

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleDelete = () => {
    toast.success('Comment deleted successfully');
    // In a real app, this would call an API to delete the comment
  };

  const handleReport = () => {
    toast.success('Comment reported successfully');
    // In a real app, this would call an API to report the comment
  };

  return (
    <div className="border rounded-md p-3 my-2 bg-white">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar_url} />
            <AvatarFallback>{comment.author.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium text-sm">{comment.author.full_name}</p>
              {comment.author.is_verified && (
                <span className="text-blue-500 text-xs">(Verified)</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
              {comment.edited && <span className="ml-1">(edited)</span>}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwnComment ? (
              <>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={handleReport}>
                <Flag className="mr-2 h-4 w-4" /> Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-2 text-sm">{comment.content}</div>
      
      <div className="mt-2 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleLike} className="h-8 px-2 text-xs">
          <Heart className="mr-1 h-3 w-3" fill={liked ? "currentColor" : "none"} /> {likeCount}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsReplying(prev => !prev)} className="h-8 px-2 text-xs">
          <Reply className="mr-1 h-3 w-3" /> Reply
        </Button>
      </div>
      
      {isReplying && (
        <div className="mt-2">
          <Textarea 
            value={replyContent} 
            onChange={(e) => setReplyContent(e.target.value)} 
            placeholder="Write a reply..."
            className="min-h-[80px] text-sm"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmitReply}>Reply</Button>
          </div>
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-2 border-l-2 border-gray-100 pl-4">
          {comment.replies.map((reply: any) => (
            <div key={reply.id} className="border rounded-md p-3 my-2 bg-white">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.author.avatar_url} />
                    <AvatarFallback>{reply.author.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm">{reply.author.full_name}</p>
                      {reply.author.is_verified && (
                        <span className="text-blue-500 text-xs">(Verified)</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(reply.created_at), 'MMM d, yyyy • h:mm a')}
                      {reply.edited && <span className="ml-1">(edited)</span>}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {currentUser?.id === reply.user_id ? (
                      <>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={handleReport}>
                        <Flag className="mr-2 h-4 w-4" /> Report
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-2 text-sm">{reply.content}</div>
              
              <div className="mt-2 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleLike} className="h-8 px-2 text-xs">
                  <Heart className="mr-1 h-3 w-3" fill={liked ? "currentColor" : "none"} /> {Math.floor(Math.random() * 5)}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentsDialog = () => {
  const { isOpen, entity, closeComments } = useCommentsDialogStore();
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && entity) {
      setLoading(true);
      // In a real app, this would be an API call to fetch comments
      setTimeout(() => {
        const mockComments = generateMockComments(entity.commentsCount || 5, entity.id);
        setComments(organizeComments(mockComments));
        setLoading(false);
      }, 500);
    }
  }, [isOpen, entity]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: `comment-${Date.now()}`,
      content: newComment,
      user_id: user?.id || 'anonymous',
      post_id: entity?.id || '',
      parent_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: user?.id || 'anonymous',
        username: user?.username || 'anonymous',
        full_name: user?.name || 'Anonymous User',
        avatar_url: user?.avatar || '',
        bio: '',
        followers: 0,
        following: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_verified: false,
        role: 'user',
      },
      edited: false,
      replies: [],
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
    
    if (entity?.onCommentAdded) {
      entity.onCommentAdded();
    }
    
    toast.success('Comment added successfully');
  };

  const handleAddReply = (parentId: string, content: string) => {
    const replyComment = {
      id: `reply-${Date.now()}`,
      content: content,
      user_id: user?.id || 'anonymous',
      post_id: entity?.id || '',
      parent_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: user?.id || 'anonymous',
        username: user?.username || 'anonymous',
        full_name: user?.name || 'Anonymous User',
        avatar_url: user?.avatar || '',
        bio: '',
        followers: 0,
        following: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_verified: false,
        role: 'user',
      },
      edited: false,
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), replyComment]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    
    if (entity?.onCommentAdded) {
      entity.onCommentAdded();
    }
    
    toast.success('Reply added successfully');
  };

  if (!entity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeComments()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments {comments.length > 0 && `(${comments.length})`}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={closeComments}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border-b">
          <h3 className="font-medium text-sm mb-1">{entity.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{entity.content}</p>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Write a comment..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <p>Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                onReply={handleAddReply}
                currentUser={user}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-xs text-muted-foreground">Be the first to comment on this article</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
