
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Reply, Edit, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Comment, CommentInsert, CommentUpdate } from '@/types';
import { createComment, updateComment, deleteComment, getPostComments } from '@/services/engagement/commentService';

interface CommentsProps {
  postId: string;
  onCommentCountChange?: (count: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ postId, onCommentCountChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsData = await getPostComments(postId);
        setComments(commentsData);
        if (onCommentCountChange) {
          onCommentCountChange(commentsData.length);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load comments',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, toast, onCommentCountChange]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to comment',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const comment: CommentInsert = {
        content: newComment,
        post_id: postId,
        user_id: user.id,
      };

      const createdComment = await createComment(comment);
      if (createdComment) {
        setComments(prev => [createdComment, ...prev]);
        setNewComment('');
        if (onCommentCountChange) {
          onCommentCountChange(comments.length + 1);
        }
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to reply',
        variant: 'destructive',
      });
      return;
    }

    if (!replyContent.trim()) return;

    try {
      const reply: CommentInsert = {
        content: replyContent,
        post_id: postId,
        user_id: user.id,
        parent_id: parentId,
      };

      const createdReply = await createComment(reply);
      if (createdReply) {
        // Update the comments state - add reply to the parent comment
        setComments(prev => 
          prev.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), createdReply],
              };
            }
            return comment;
          })
        );
        setReplyingTo(null);
        setReplyContent('');
        if (onCommentCountChange) {
          onCommentCountChange(comments.length + 1);
        }
      }
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!user) return;
    if (!editContent.trim()) return;

    try {
      const commentUpdate: CommentUpdate = {
        content: editContent,
        updated_at: new Date().toISOString(),
      };

      const updated = await updateComment(commentId, commentUpdate);
      if (updated) {
        setComments(prev => 
          prev.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, content: editContent, edited: true, updated_at: new Date().toISOString() };
            }

            // Check if comment has replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply => 
                  reply.id === commentId 
                    ? { ...reply, content: editContent, edited: true, updated_at: new Date().toISOString() } 
                    : reply
                )
              };
            }

            return comment;
          })
        );
        setEditingComment(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: string, isReply = false, parentId?: string) => {
    try {
      const deleted = await deleteComment(commentId);
      if (deleted) {
        if (isReply && parentId) {
          // Remove reply from parent comment
          setComments(prev => 
            prev.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: comment.replies?.filter(reply => reply.id !== commentId) || [],
                };
              }
              return comment;
            })
          );
        } else {
          // Remove top-level comment
          setComments(prev => prev.filter(comment => comment.id !== commentId));
        }
        
        if (onCommentCountChange) {
          onCommentCountChange(comments.length - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  const renderComment = (comment: Comment, isReply = false, parentId?: string) => {
    const isEditing = editingComment === comment.id;
    const isAuthor = user?.id === comment.user_id;
    const formattedDate = new Date(comment.created_at).toLocaleDateString();
    
    return (
      <div key={comment.id} className={`py-4 ${isReply ? 'ml-12 border-l-2 pl-4 border-gray-100 dark:border-gray-800' : 'border-b border-gray-100 dark:border-gray-800'}`}>
        <div className="flex">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author?.avatar_url} alt={comment.author?.full_name || ''} />
            <AvatarFallback>
              {comment.author?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{comment.author?.full_name || 'Unknown User'}</span>
                <span className="ml-2 text-xs text-muted-foreground">@{comment.author?.username}</span>
                {comment.edited && <span className="ml-2 text-xs text-muted-foreground">(edited)</span>}
              </div>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            
            {isEditing ? (
              <div className="mt-2">
                <Textarea 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateComment(comment.id)}
                  >
                    <Check className="mr-1 h-4 w-4" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm">{comment.content}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {!isReply && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setReplyingTo(comment.id);
                        setReplyContent('');
                      }}
                    >
                      <Reply className="mr-1 h-4 w-4" /> Reply
                    </Button>
                  )}
                  
                  {isAuthor && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteComment(comment.id, isReply, parentId)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </>
            )}
            
            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-4">
                <Textarea 
                  placeholder="Write a reply..." 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => setReplyingTo(null)}
                  >
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleSubmitReply(comment.id)}
                  >
                    <Reply className="mr-1 h-4 w-4" /> Reply
                  </Button>
                </div>
              </div>
            )}
            
            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => renderComment(reply, true, comment.id))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments {comments.length > 0 && `(${comments.length})`}</h3>
      
      {/* Comment form */}
      <div className="mb-6">
        <Textarea 
          placeholder="Write a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
          disabled={!user}
        />
        <div className="mt-2 flex justify-between items-center">
          {!user && (
            <div className="text-sm text-muted-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Please sign in to comment
            </div>
          )}
          <div className={`${user ? 'ml-auto' : ''}`}>
            <Button 
              onClick={handleSubmitComment}
              disabled={!user || !newComment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div>
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default Comments;
