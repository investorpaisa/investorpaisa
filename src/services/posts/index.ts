
// Import and re-export everything from each service file
import { getPosts, getCategoryPosts, getComments, createPost, addComment } from './postService';

// Export individual functions
export {
  getPosts,
  getCategoryPosts,
  getComments,
  createPost,
  addComment
};

// Export type definitions 
export * from './types';

// Import services
import * as categoryServices from './categoryService';
import * as likeServices from './likeService';
import * as utilServices from './utils';

// Individual named exports from postService
const posts = {
  getPosts,
  getCategoryPosts,
  getComments,
  createPost,
  addComment
};

// Export as a service object for backward compatibility
export const postService = {
  ...posts,
  ...categoryServices,
  ...likeServices
};
