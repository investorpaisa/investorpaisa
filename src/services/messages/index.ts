
import { getConversations } from './conversationService';
import { getMessages, sendMessage } from './messageService';
import type { Conversation, Message, StockQuote, MarketStatus, MarketIndex } from './types';

export const messageService = {
  getConversations,
  getMessages,
  sendMessage
};

export type { Conversation, Message, StockQuote, MarketStatus, MarketIndex };
