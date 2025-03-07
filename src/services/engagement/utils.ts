
import { Comment } from '@/types';

/**
 * Builds a comment tree from a flat array of comments
 */
export const buildCommentTree = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create a map of comments by ID
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build the tree structure
  comments.forEach(comment => {
    const thisComment = commentMap.get(comment.id);
    if (!thisComment) return;

    if (comment.parent_id) {
      const parentComment = commentMap.get(comment.parent_id);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(thisComment);
      } else {
        rootComments.push(thisComment);
      }
    } else {
      rootComments.push(thisComment);
    }
  });

  return rootComments;
};

// Add any additional utility functions here
