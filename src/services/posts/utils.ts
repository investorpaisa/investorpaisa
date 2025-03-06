
import { toast } from '@/components/ui/use-toast';
import { User } from '@/services/api';
import { Category, Post, PostWithCategoryObject, Comment } from './types';

export function handleError(error: unknown, title: string): void {
  console.error(`Error: ${title}:`, error);
  toast({
    title,
    description: error instanceof Error ? error.message : "An unexpected error occurred",
    variant: "destructive"
  });
}

export function formatUserFromProfile(profile: any): User {
  return {
    id: profile.id,
    name: profile.full_name || profile.username || 'User',
    email: '',
    avatar: profile.avatar_url,
    role: (profile.role as 'user' | 'expert') || 'user',
    followers: profile.followers || 0,
    following: profile.following || 0,
    joined: ''
  };
}

export function formatPostFromSupabase(post: any): Post {
  const formattedPost: Post = {
    id: post.id,
    title: post.title,
    content: post.content,
    likes: post.likes || 0,
    comments: post.comment_count || 0,
    createdAt: post.created_at,
    author: formatUserFromProfile(post.user),
    category: post.category ? post.category.name : '',
  };
  
  return formattedPost;
}

export function formatPostWithCategoryObject(post: any): PostWithCategoryObject {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    likes: post.likes || 0,
    comments: post.comment_count || 0,
    createdAt: post.created_at,
    author: formatUserFromProfile(post.user),
    category: post.category ? {
      id: post.category.id,
      name: post.category.name,
      description: post.category.description || '',
      icon: post.category.icon || '',
      postCount: post.category.post_count || 0
    } : {
      id: '',
      name: 'Uncategorized',
      description: '',
      icon: '',
      postCount: 0
    }
  };
}

export function formatCategoryFromSupabase(category: any): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description || '',
    icon: category.icon || '',
    postCount: category.post_count || 0
  };
}

export function formatCommentFromSupabase(comment: any): Comment {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.created_at,
    author: {
      id: comment.user.id,
      name: comment.user.full_name || comment.user.username || 'User',
      email: '',
      avatar: comment.user.avatar_url,
      role: (comment.user.role as 'user' | 'expert') || 'user',
      followers: 0,
      following: 0,
      joined: ''
    }
  };
}
