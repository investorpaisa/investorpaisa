
// API Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  role: 'user' | 'expert';
  followers: number;
  following: number;
  joined: string;
}

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

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  isRead: boolean;
}
