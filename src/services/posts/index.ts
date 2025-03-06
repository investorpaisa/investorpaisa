
import { getPosts, getCategoryPosts, getComments, createPost, addComment } from './postService';
import { likePost, unlikePost } from './likeService';
import { getCategories } from './categoryService';
import type { Post, Category, Comment, PostWithCategoryObject } from './types';

export const postService = {
  getPosts,
  getCategoryPosts,
  getCategories,
  getComments,
  createPost,
  addComment,
  likePost,
  unlikePost
};

export type { Post, Category, Comment, PostWithCategoryObject };
