
import { supabase } from '@/integrations/supabase/client';
import { CircleMember } from '../types';
import { Profile } from '@/types';

/**
 * Get members of a circle
 */
const getCircleMembers = async (circleId: string): Promise<CircleMember[]> => {
  const { data, error } = await supabase
    .from('circle_members')
    .select('*, profile:profiles(*)')
    .eq('circle_id', circleId);

  if (error) {
    console.error('Error fetching circle members:', error);
    throw new Error(`Failed to fetch circle members: ${error.message}`);
  }

  // Map to CircleMember type with profile data
  const members = data.map(member => ({
    id: member.id,
    circle_id: member.circle_id,
    user_id: member.user_id,
    role: member.role as CircleMember['role'],
    created_at: member.created_at,
    profile: member.profile as unknown as Profile
  }));

  return members;
};

/**
 * Get user's role in a circle
 */
const getUserCircleRole = async (circleId: string, userId: string): Promise<CircleMember['role'] | null> => {
  const { data, error } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user role:', error);
    throw new Error(`Failed to fetch user role: ${error.message}`);
  }

  return data ? data.role as CircleMember['role'] : null;
};

export { getCircleMembers, getUserCircleRole };
