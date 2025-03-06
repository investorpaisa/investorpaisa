
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';
import { formatUserFromProfile, handleError } from './utils';

export async function getMessages(userId: string): Promise<Message[]> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("You must be logged in to view messages");
    }
    
    // Get all messages between the current user and the specified user
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id, content, is_read, created_at,
        sender:profiles!sender_id(id, full_name, username, avatar_url, role, followers, following),
        receiver:profiles!receiver_id(id, full_name, username, avatar_url, role, followers, following)
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
      sender: formatUserFromProfile(message.sender),
      receiver: formatUserFromProfile(message.receiver),
      isRead: message.is_read,
      createdAt: message.created_at
    }));
  } catch (error) {
    handleError(error, "Failed to load messages");
    return [];
  }
}

export async function sendMessage(receiverId: string, content: string): Promise<Message | null> {
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
        id, content, is_read, created_at,
        sender:profiles!sender_id(id, full_name, username, avatar_url, role, followers, following),
        receiver:profiles!receiver_id(id, full_name, username, avatar_url, role, followers, following)
      `)
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      content: data.content,
      sender: formatUserFromProfile(data.sender),
      receiver: formatUserFromProfile(data.receiver),
      isRead: data.is_read,
      createdAt: data.created_at
    };
  } catch (error) {
    handleError(error, "Failed to send message");
    return null;
  }
}
