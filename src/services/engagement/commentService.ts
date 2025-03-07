
// Re-export all comment-related functions from their respective files
import { 
  createComment, 
  updateComment, 
  deleteComment, 
  getPostComments 
} from './comments';

// Export individual functions
export {
  createComment,
  updateComment,
  deleteComment,
  getPostComments
};

// Export as a service object for backward compatibility
export const commentService = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments
};
