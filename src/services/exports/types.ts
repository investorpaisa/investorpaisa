
// This file re-exports types that are needed across the application
// Import with aliases to avoid conflicts
import { User as APIUser, Post as APIPost, Comment as APIComment, Category as APICategory, Message as APIMessage } from '../api/types';
import { Circle, CircleMember, CirclePost } from '../circles/types';
import { Conversation, Message as ChatMessage, StockQuote, MarketStatus, MarketIndex } from '../messages/types';

// Export types with specific names to avoid conflicts
export type {
  // API types with prefixes
  APIUser,
  APIPost,
  APIComment,
  APICategory,
  APIMessage,
  
  // Circle types
  Circle,
  CircleMember,
  CirclePost,
  
  // Message types
  Conversation,
  ChatMessage,
  
  // Market types
  StockQuote,
  MarketStatus,
  MarketIndex
};
