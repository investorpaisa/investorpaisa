import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Trash2, Edit } from 'lucide-react';
import { Comment, CommentInsert } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { createComment, updateComment, deleteComment, getPostComments } from '@/services/engagement/commentService';

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const fetchedComments = await getPostComments(postId);
        setComments(fetchedComments);
      } catch (error: any) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load comments. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, toast]);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !user) return;
    
    const commentData: CommentInsert = {
      content: newComment,
      post_id: postId,
      user_id: user.id,
      parent_id: replyingTo // This could be undefined which is fine for root comments
    };

    try {
      const createdComment = await createComment(commentData);
      setComments(prevComments => [...prevComments, createdComment]);
      setNewComment('');
      setReplyingTo(null);
    } catch (error: any) {
      console.error('Error creating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || editedCommentContent.trim() === '') return;

    try {
      await updateComment(editingCommentId, { content: editedCommentContent });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === editingCommentId ? { ...comment, content: editedCommentContent, edited: true } : comment
        )
      );
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderComment = (comment: Comment, level = 0) => {
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingTo === comment.id;
    const marginLeft = level * 20;

    return (
      <div key={comment.id} style={{ marginLeft: `${marginLeft}px` }} className="mb-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.avatar_url || ''} alt={comment.author?.full_name || 'User'} />
            <AvatarFallback>{comment.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{comment.author?.full_name || 'Unknown User'}</p>
                <div className="flex space-x-2">
                  {user?.id === comment.user_id && !isEditing && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditedCommentContent(comment.content);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteComment(comment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleUpdateComment}>
                    Update
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {comment.content}
                  {comment.edited && <span className="italic text-xs ml-1">(edited)</span>}
                </p>
              )}
              <div className="text-xs text-gray-500">
                {new Date(comment.updated_at).toLocaleDateString()}
                <button className="ml-2 hover:underline" onClick={() => setReplyingTo(comment.id)}>
                  Reply
                </button>
              </div>
            </div>
            {isReplying && (
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add your reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={handleAddComment}>
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            )}
            {comment.replies && comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center">Loading comments...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleAddComment} disabled={!user}>
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
        {!user && <p className="text-sm text-gray-500 mt-1">You must be logged in to comment.</p>}
      </div>
      {comments.map(comment => renderComment(comment))}
    </div>
  );
};

export default Comments;
