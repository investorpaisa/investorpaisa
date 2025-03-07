import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Comment } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Reply, Edit, Trash } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (text: string, parentId?: string) => void;
  parentId?: string;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, parentId, onCancel }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, parentId);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm">
        Post
      </Button>
      {onCancel && (
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </form>
  );
};

interface CommentHeaderProps {
  comment: Comment;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ comment }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} alt={comment.author?.full_name || "Avatar"} />
          <AvatarFallback>{comment.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{comment.author?.full_name || "Unknown User"}</div>
          <div className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

interface CommentBodyProps {
  comment: Comment;
}

const CommentBody: React.FC<CommentBodyProps> = ({ comment }) => {
  return (
    <div>
      <p className="text-sm text-gray-800">{comment.content}</p>
      {comment.edited && <div className="text-xs text-gray-500">Edited</div>}
    </div>
  );
};

interface CommentActionsProps {
  comment: Comment;
  onReply: (commentId: string) => void;
}

const CommentActions: React.FC<CommentActionsProps> = ({ comment, onReply }) => {
  return (
    <div className="flex items-center space-x-4 text-xs text-gray-600">
      <button className="hover:text-gray-800" onClick={() => onReply(comment.id)}>
        <Reply className="mr-1 h-4 w-4 inline-block" />
        Reply
      </button>
    </div>
  );
};

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};


interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const [replying, setReplying] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);

  const handleReply = (commentId: string) => {
    setReplying(true);
  };

  const handleSubmitReply = (text: string, parentId?: string) => {
    if (parentId) {
      const newReply = {
        id: Math.random().toString(), // Generate a unique ID
        content: text,
        created_at: new Date().toISOString(),
        author: {
          id: 'current-user-id', // Replace with actual user ID
          full_name: 'Current User', // Replace with actual user name
          username: 'current_user', // Replace with actual username
          avatar_url: '/placeholder.svg', // Replace with actual avatar URL
        },
        edited: false,
        post_id: comment.post_id, // Ensure post_id is correctly passed
        user_id: 'current-user-id', // Ensure user_id is correctly passed
        parent_id: parentId,
      };
      setReplies([...replies, newReply]);
      setReplying(false);
    }
  };

  const handleCancelReply = () => {
    setReplying(false);
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-md shadow-sm p-4">
        <CommentHeader comment={comment} />
        <CommentBody comment={comment} />
        <CommentActions comment={comment} onReply={handleReply} />
        {replying && (
          <div className="mt-4">
            <CommentForm onSubmit={handleSubmitReply} parentId={comment.id} onCancel={handleCancelReply} />
          </div>
        )}
      </div>
      {replies.length > 0 && (
        <div className="ml-6">
          <CommentList comments={replies} />
        </div>
      )}
    </div>
  );
};

interface CommentsProps {
  comments: Comment[];
  onSubmit: (text: string, parentId?: string) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, onSubmit }) => {
  return (
    <div className="space-y-4">
      <CommentForm onSubmit={onSubmit} />
      {comments.length > 0 ? (
        <CommentList comments={comments} />
      ) : (
        <div className="text-gray-500">No comments yet. Be the first to comment!</div>
      )}
    </div>
  );
};

export default Comments;
