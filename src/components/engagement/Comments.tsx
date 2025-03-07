
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { commentService } from '@/services/engagement';
import { toast } from '@/hooks/use-toast';
import { Comment } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, MessageCircle, Edit, Trash2 } from 'lucide-react';

interface CommentsProps {
  postId: string;
  onCommentCountChange?: (count: number) => void;
}

export const Comments: React.FC<CommentsProps> = ({ postId, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await commentService.getPostComments(postId);
      setComments(fetchedComments);
      if (onCommentCountChange) {
        onCommentCountChange(countTotalComments(fetchedComments));
      }
    } finally {
      setLoading(false);
    }
  };

  const countTotalComments = (commentList: Comment[]): number => {
    let count = commentList.length;
    for (const comment of commentList) {
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length;
      }
    }
    return count;
  };

  const handleAddComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some text for your comment",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (replyTo) {
        await commentService.addComment(postId, newComment, replyTo.id);
        setReplyTo(null);
      } else {
        await commentService.addComment(postId, newComment);
      }
      
      setNewComment('');
      await fetchComments();
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some text for your comment",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await commentService.updateComment(commentId, editContent);
      setEditingComment(null);
      await fetchComments();
      
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setLoading(true);
    try {
      await commentService.deleteComment(commentId, postId);
      await fetchComments();
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully"
      });
    } finally {
      setLoading(false);
    }
  };

  const startReply = (comment: Comment) => {
    setReplyTo(comment);
    setNewComment('');
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const cancelAction = () => {
    setReplyTo(null);
    setEditingComment(null);
    setNewComment('');
    setEditContent('');
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isEditing = editingComment && editingComment.id === comment.id;
    
    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mt-4'}`}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.avatar_url || ''} />
            <AvatarFallback>
              {comment.author?.full_name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="bg-gray-50 p-3 rounded-md shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">
                    {comment.author?.full_name || 'Unknown User'}
                  </span>
                  {comment.author?.role === 'expert' && (
                    <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">Expert</span>
                  )}
                  <span className="text-gray-500 text-xs ml-2">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    {comment.edited && <span className="ml-1">(edited)</span>}
                  </span>
                </div>
                
                {user && user.id === comment.user_id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEdit(comment)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {isEditing ? (
                <div className="mt-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={cancelAction}>
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleEditComment(comment.id)}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm">{comment.content}</p>
              )}
            </div>
            
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs mt-1" 
                onClick={() => startReply(comment)}
              >
                <MessageCircle className="mr-1 h-3 w-3" /> Reply
              </Button>
            )}
            
            {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-4">
      <h3 className="font-medium text-lg">Comments ({countTotalComments(comments)})</h3>
      
      {/* Comment input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || ''} />
              <AvatarFallback>
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {replyTo && (
                <div className="text-xs text-gray-500 mb-1">
                  Replying to {replyTo.author?.full_name || 'Unknown User'}
                  <Button variant="link" size="sm" className="p-0 h-auto" onClick={cancelAction}>
                    Cancel
                  </Button>
                </div>
              )}
              
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                className="min-h-[100px]"
              />
              
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                >
                  {replyTo ? 'Reply' : 'Comment'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comments list */}
      <div className="space-y-2">
        {loading && comments.length === 0 ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};
