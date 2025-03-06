
import { User } from '@/services/api';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface PostWithCategoryObject {
  id: string;
  title: string;
  content: string;
  author: User;
  category: {
    id: string;
    name: string;
    description: string;
    icon: string;
    postCount: number;
  };
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}
