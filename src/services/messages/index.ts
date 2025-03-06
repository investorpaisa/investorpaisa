
import { getConversations } from './conversationService';
import { getMessages, sendMessage } from './messageService';
import type { Conversation, Message } from './types';

export const messageService = {
  getConversations,
  getMessages,
  sendMessage
};

export type { Conversation, Message };
