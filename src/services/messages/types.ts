
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

// New interfaces for market data
export interface StockQuote {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  pChange: number;
  open: number;
  high: number;
  low: number;
  close: number;
  previousClose: number;
  volume: number;
  timestamp: string;
}

export interface MarketStatus {
  status: 'open' | 'closed' | 'pre-open' | 'post-close';
  message: string;
  timestamp: string;
}

export interface MarketIndex {
  name: string;
  lastPrice: number;
  change: number;
  pChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: string;
}
