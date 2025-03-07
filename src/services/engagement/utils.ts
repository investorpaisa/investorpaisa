
import { Comment } from '@/types';

/**
 * Build a comment tree from flat comments array
 */
export const buildCommentTree = (comments: any[]): Comment[] => {
  // First, create a map of all comments
  const commentMap = new Map();
  
  // Convert response format to match our Comment type
  const processedComments = comments.map(comment => {
    // Create a new object that matches the Comment type
    const processedComment: Comment = {
      ...comment,
      edited: false, // Set default value
      parent_id: comment.parent_id || undefined,
      author: comment.author ? comment.author : undefined,
      replies: []
    };
    
    // Add to map
    commentMap.set(comment.id, processedComment);
    return processedComment;
  });
  
  // Build the tree
  const rootComments: Comment[] = [];
  
  processedComments.forEach(comment => {
    if (comment.parent_id) {
      // This is a reply
      const parentComment = commentMap.get(comment.parent_id);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(comment);
      }
    } else {
      // This is a root comment
      rootComments.push(comment);
    }
  });
  
  return rootComments;
};
