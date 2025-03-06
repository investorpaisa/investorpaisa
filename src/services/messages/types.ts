
import { User } from '@/services/api';

export interface Conversation {
  user: User;
  lastMessage: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  receiver: User;
  isRead: boolean;
  createdAt: string;
}
