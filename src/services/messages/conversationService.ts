
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from './types';
import { formatUserFromProfile, handleError } from './utils';

export async function getConversations(): Promise<Conversation[]> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("You must be logged in to view conversations");
    }
    
    // Get conversations using the get_conversations function
    const { data: conversationUsers, error: convError } = await supabase
      .rpc('get_conversations', { user_id: userData.user.id });
      
    if (convError) {
      throw convError;
    }
    
    if (!conversationUsers || conversationUsers.length === 0) {
      return [];
    }
    
    // For each conversation partner, get their profile details and conversation info
    const conversationPromises = conversationUsers.map(async (convUser) => {
      // Get user profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', convUser.other_user_id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }
      
      // Get latest message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('content, is_read, created_at')
        .or(`and(sender_id.eq.${userData.user.id},receiver_id.eq.${convUser.other_user_id}),and(sender_id.eq.${convUser.other_user_id},receiver_id.eq.${userData.user.id})`)
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
        .eq('sender_id', convUser.other_user_id)
        .eq('receiver_id', userData.user.id)
        .eq('is_read', false);
        
      if (countError) {
        console.error("Error counting unread messages:", countError);
        return null;
      }
      
      return {
        user: formatUserFromProfile(profileData),
        lastMessage: messageData?.content || 'No messages yet',
        unreadCount: count || 0
      };
    });
    
    const conversations = await Promise.all(conversationPromises);
    return conversations.filter(Boolean) as Conversation[];
  } catch (error) {
    handleError(error, "Failed to load conversations");
    return [];
  }
}
