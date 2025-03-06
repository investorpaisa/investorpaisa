
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Message, User } from "./api";

class MessageService {
  async getConversations(): Promise<{user: User, lastMessage: string, unreadCount: number}[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to view conversations");
      }
      
      // Get all unique users the current user has exchanged messages with
      const { data: sentToUsers, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', userData.user.id)
        .order('created_at', { ascending: false });
        
      const { data: receivedFromUsers, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', userData.user.id)
        .order('created_at', { ascending: false });
        
      if (sentError || receivedError) {
        throw sentError || receivedError;
      }
      
      // Combine unique user IDs from both sent and received messages
      const userIds = new Set([
        ...sentToUsers.map(m => m.receiver_id),
        ...receivedFromUsers.map(m => m.sender_id)
      ]);
      
      // Get conversations with last message and unread count
      const conversations = await Promise.all(Array.from(userIds).map(async (userId) => {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error(`Error fetching profile for user ${userId}:`, profileError);
          return null;
        }
        
        // Get last message
        const { data: lastMessageData, error: lastMessageError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .or(`sender_id.eq.${userData.user.id},receiver_id.eq.${userData.user.id}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (lastMessageError) {
          console.error(`Error fetching last message with user ${userId}:`, lastMessageError);
          return null;
        }
        
        // Count unread messages
        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', userId)
          .eq('receiver_id', userData.user.id)
          .eq('is_read', false);
          
        if (countError) {
          console.error(`Error counting unread messages from user ${userId}:`, countError);
          return null;
        }
        
        return {
          user: {
            id: profile.id,
            name: profile.full_name || profile.username || 'User',
            email: '', // Not exposing email
            avatar: profile.avatar_url,
            role: (profile.role as 'user' | 'expert') || 'user',
            followers: profile.followers || 0,
            following: profile.following || 0,
            joined: ''
          },
          lastMessage: lastMessageData.content,
          unreadCount: count || 0
        };
      }));
      
      // Filter out null values and sort by unread messages first, then by last message time
      return conversations.filter(Boolean).sort((a, b) => {
        if (a.unreadCount !== b.unreadCount) {
          return b.unreadCount - a.unreadCount; // Most unread first
        }
        return 0; // Keep original order (which is already sorted by timestamp)
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Failed to fetch conversations",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }

  async getMessages(otherUserId: string): Promise<Message[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to view messages");
      }
      
      // Get messages between users, using specific column naming to avoid ambiguity
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_read,
          sender_id,
          receiver_id,
          sender:sender_id(id, full_name, username, avatar_url, role, followers, following),
          receiver:receiver_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .or(`and(sender_id.eq.${userData.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userData.user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Mark received messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', userData.user.id)
        .eq('is_read', false);
      
      return data.map(message => {
        const senderProfile = message.sender;
        const receiverProfile = message.receiver;
        
        const sender: User = {
          id: senderProfile.id,
          name: senderProfile.full_name || senderProfile.username || 'User',
          email: '', // Not exposing email
          avatar: senderProfile.avatar_url,
          role: (senderProfile.role as 'user' | 'expert') || 'user',
          followers: senderProfile.followers || 0,
          following: senderProfile.following || 0,
          joined: ''
        };
        
        const receiver: User = {
          id: receiverProfile.id,
          name: receiverProfile.full_name || receiverProfile.username || 'User',
          email: '', // Not exposing email
          avatar: receiverProfile.avatar_url,
          role: (receiverProfile.role as 'user' | 'expert') || 'user',
          followers: receiverProfile.followers || 0,
          following: receiverProfile.following || 0,
          joined: ''
        };
        
        return {
          id: message.id,
          content: message.content,
          sender,
          receiver,
          createdAt: new Date(message.created_at).toISOString(),
          isRead: message.is_read
        };
      });
    } catch (error) {
      console.error(`Error fetching messages with user ${otherUserId}:`, error);
      toast({
        title: "Failed to fetch messages",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }

  async sendMessage(receiverId: string, content: string): Promise<Message | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to send messages");
      }
      
      // Insert message, using specific column naming for relationships
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: userData.user.id,
          receiver_id: receiverId,
          is_read: false
        })
        .select(`
          id,
          content,
          created_at,
          is_read,
          sender_id,
          receiver_id,
          sender:sender_id(id, full_name, username, avatar_url, role, followers, following),
          receiver:receiver_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      const senderProfile = data.sender;
      const receiverProfile = data.receiver;
      
      const sender: User = {
        id: senderProfile.id,
        name: senderProfile.full_name || senderProfile.username || 'User',
        email: '', // Not exposing email
        avatar: senderProfile.avatar_url,
        role: (senderProfile.role as 'user' | 'expert') || 'user',
        followers: senderProfile.followers || 0,
        following: senderProfile.following || 0,
        joined: ''
      };
      
      const receiver: User = {
        id: receiverProfile.id,
        name: receiverProfile.full_name || receiverProfile.username || 'User',
        email: '', // Not exposing email
        avatar: receiverProfile.avatar_url,
        role: (receiverProfile.role as 'user' | 'expert') || 'user',
        followers: receiverProfile.followers || 0,
        following: receiverProfile.following || 0,
        joined: ''
      };
      
      return {
        id: data.id,
        content: data.content,
        sender,
        receiver,
        createdAt: new Date(data.created_at).toISOString(),
        isRead: data.is_read
      };
    } catch (error) {
      console.error(`Error sending message to user ${receiverId}:`, error);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  }
}

export const messageService = new MessageService();
