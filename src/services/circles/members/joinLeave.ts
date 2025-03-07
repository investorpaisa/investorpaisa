
import { supabase } from '@/integrations/supabase/client';
import { CircleMember, CircleRole } from '../types';

/**
 * Join a circle
 */
const joinCircle = async (circleId: string): Promise<CircleMember> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('circle_members')
    .select('*')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingMember) {
    return existingMember as CircleMember;
  }

  // Join the circle
  const { data, error } = await supabase
    .from('circle_members')
    .insert({
      circle_id: circleId,
      user_id: userId,
      role: CircleRole.MEMBER
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error joining circle:', error);
    throw new Error(`Failed to join circle: ${error.message}`);
  }

  return data as CircleMember;
};

/**
 * Leave a circle
 */
const leaveCircle = async (circleId: string): Promise<boolean> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  // Check if user is the only admin
  const { data: memberData } = await supabase
    .from('circle_members')
    .select('*')
    .eq('circle_id', circleId);

  const admins = memberData?.filter(m => m.role === CircleRole.ADMIN || m.role === CircleRole.CO_ADMIN);
  
  // If user is the only admin, they can't leave
  if (admins?.length === 1 && admins[0].user_id === userId && admins[0].role === CircleRole.ADMIN) {
    throw new Error('You are the only admin. Please assign another admin before leaving the circle.');
  }

  const { error } = await supabase
    .from('circle_members')
    .delete()
    .eq('circle_id', circleId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error leaving circle:', error);
    throw new Error(`Failed to leave circle: ${error.message}`);
  }

  return true;
};

export { joinCircle, leaveCircle };
