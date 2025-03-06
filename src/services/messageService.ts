
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Message, User } from '@/services/api';

export const messageService = {
  async getConversations(): Promise<{user: User, lastMessage: string, unreadCount: number}[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to view conversations");
      }
      
      // Get list of users the current user has exchanged messages with
      const { data, error } = await supabase
        .rpc('get_conversations', { user_id: userData.user.id });
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // For each conversation, get the latest message and unread count
      const conversations = await Promise.all(data.map(async (conversation) => {
        const userId = conversation.other_user_id;
        
        // Get user profile details
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return null;
        }
        
        // Get latest message
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select('content, is_read')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (messageError) {
          console.error("Error fetching latest message:", messageError);
          return null;
        }
        
        // Get unread count
        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', userId)
          .eq('receiver_id', userData.user.id)
          .eq('is_read', false);
          
        if (countError) {
          console.error("Error counting unread messages:", countError);
          return null;
        }
        
        return {
          user: {
            id: profileData.id,
            name: profileData.full_name || profileData.username || 'User',
            email: '',
            avatar: profileData.avatar_url,
            role: (profileData.role as 'user' | 'expert') || 'user',
            followers: profileData.followers || 0,
            following: profileData.following || 0,
            joined: ''
          },
          lastMessage: messageData?.content || 'No messages yet',
          unreadCount: count || 0
        };
      }));
      
      return conversations.filter(Boolean) as {user: User, lastMessage: string, unreadCount: number}[];
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Failed to load conversations",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async getMessages(userId: string): Promise<Message[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to view messages");
      }
      
      // Get all messages between the current user and the specified user
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, full_name, username, avatar_url, role, followers, following),
          receiver:receiver_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .or(`and(sender_id.eq.${userData.user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${userData.user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Mark received messages as read
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', userId)
        .eq('receiver_id', userData.user.id)
        .eq('is_read', false);
        
      if (updateError) {
        console.error("Error marking messages as read:", updateError);
      }
      
      return data.map(message => ({
        id: message.id,
        content: message.content,
        sender: {
          id: message.sender.id,
          name: message.sender.full_name || message.sender.username || 'User',
          email: '',
          avatar: message.sender.avatar_url,
          role: (message.sender.role as 'user' | 'expert') || 'user',
          followers: message.sender.followers || 0,
          following: message.sender.following || 0,
          joined: ''
        },
        receiver: {
          id: message.receiver.id,
          name: message.receiver.full_name || message.receiver.username || 'User',
          email: '',
          avatar: message.receiver.avatar_url,
          role: (message.receiver.role as 'user' | 'expert') || 'user',
          followers: message.receiver.followers || 0,
          following: message.receiver.following || 0,
          joined: ''
        },
        isRead: message.is_read,
        createdAt: message.created_at
      }));
    } catch (error) {
      console.error(`Error fetching messages with user ${userId}:`, error);
      toast({
        title: "Failed to load messages",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async sendMessage(receiverId: string, content: string): Promise<Message | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to send messages");
      }
      
      // Create new message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userData.user.id,
          receiver_id: receiverId,
          content,
          is_read: false
        })
        .select(`
          *,
          sender:sender_id(id, full_name, username, avatar_url, role, followers, following),
          receiver:receiver_id(id, full_name, username, avatar_url, role, followers, following)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        content: data.content,
        sender: {
          id: data.sender.id,
          name: data.sender.full_name || data.sender.username || 'User',
          email: '',
          avatar: data.sender.avatar_url,
          role: (data.sender.role as 'user' | 'expert') || 'user',
          followers: data.sender.followers || 0,
          following: data.sender.following || 0,
          joined: ''
        },
        receiver: {
          id: data.receiver.id,
          name: data.receiver.full_name || data.receiver.username || 'User',
          email: '',
          avatar: data.receiver.avatar_url,
          role: (data.receiver.role as 'user' | 'expert') || 'user',
          followers: data.receiver.followers || 0,
          following: data.receiver.following || 0,
          joined: ''
        },
        isRead: data.is_read,
        createdAt: data.created_at
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
};
