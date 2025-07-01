
import { supabase } from '@/integrations/supabase/client';

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  connected_at?: string;
  message?: string;
  created_at: string;
}

export const connectionsService = {
  // Send a connection request
  sendConnectionRequest: async (receiverId: string, message?: string): Promise<Connection> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: userData.user.id,
        receiver_id: receiverId,
        status: 'pending',
        message
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to send connection request: ${error.message}`);
    }

    return data as Connection;
  },

  // Accept a connection request
  acceptConnectionRequest: async (connectionId: string): Promise<Connection> => {
    const { data, error } = await supabase
      .from('connections')
      .update({
        status: 'accepted',
        connected_at: new Date().toISOString()
      })
      .eq('id', connectionId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to accept connection request: ${error.message}`);
    }

    return data as Connection;
  },

  // Get connection requests for current user
  getConnectionRequests: async (): Promise<Connection[]> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('receiver_id', userData.user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch connection requests: ${error.message}`);
    }

    return data as Connection[];
  },

  // Get user's connections
  getUserConnections: async (): Promise<Connection[]> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${userData.user.id},receiver_id.eq.${userData.user.id}`)
      .eq('status', 'accepted')
      .order('connected_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch connections: ${error.message}`);
    }

    return data as Connection[];
  }
};
