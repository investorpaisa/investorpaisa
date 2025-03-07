
import { supabase } from '@/integrations/supabase/client';
import { CircleMember, CircleRole, Profile } from './types';

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
    role: member.role as CircleRole,
    created_at: member.created_at,
    profile: member.profile as unknown as Profile
  }));

  return members;
};

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

/**
 * Get user's role in a circle
 */
const getUserCircleRole = async (circleId: string, userId: string): Promise<CircleRole | null> => {
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

  return data ? data.role as CircleRole : null;
};

/**
 * Update a member's role in a circle
 */
const updateMemberRole = async (circleId: string, memberId: string, role: CircleRole): Promise<CircleMember> => {
  // Check if the current user has admin rights
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const currentUserId = userData.user.id;

  const { data: currentUserRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', currentUserId)
    .single();

  if (!currentUserRole || (currentUserRole.role !== CircleRole.ADMIN && currentUserRole.role !== CircleRole.CO_ADMIN)) {
    throw new Error('You do not have permission to update member roles');
  }
  
  // If updating a co-admin, only admin can do it
  if (role === CircleRole.CO_ADMIN && currentUserRole.role !== CircleRole.ADMIN) {
    throw new Error('Only the admin can assign co-admin roles');
  }

  const { data, error } = await supabase
    .from('circle_members')
    .update({ role })
    .eq('id', memberId)
    .eq('circle_id', circleId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating member role:', error);
    throw new Error(`Failed to update member role: ${error.message}`);
  }

  return data as CircleMember;
};

/**
 * Remove a member from a circle
 */
const removeMember = async (circleId: string, userId: string): Promise<boolean> => {
  // Check if the current user has admin/co-admin rights
  const { data: currentUserData } = await supabase.auth.getUser();
  if (!currentUserData.user) {
    throw new Error('User not authenticated');
  }

  const currentUserId = currentUserData.user.id;

  // If trying to remove yourself, use leaveCircle method
  if (currentUserId === userId) {
    return leaveCircle(circleId);
  }

  const { data: currentUserRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', currentUserId)
    .single();

  if (!currentUserRole || (currentUserRole.role !== CircleRole.ADMIN && currentUserRole.role !== CircleRole.CO_ADMIN)) {
    throw new Error('You do not have permission to remove members');
  }

  // Get the role of the user being removed
  const { data: targetUserRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .single();

  // Co-admins can't remove other co-admins or the admin
  if (currentUserRole.role === CircleRole.CO_ADMIN && 
      targetUserRole && 
      (targetUserRole.role === CircleRole.CO_ADMIN || targetUserRole.role === CircleRole.ADMIN)) {
    throw new Error('Co-admins cannot remove other co-admins or the admin');
  }

  const { error } = await supabase
    .from('circle_members')
    .delete()
    .eq('circle_id', circleId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing member:', error);
    throw new Error(`Failed to remove member: ${error.message}`);
  }

  return true;
};

// Export as a group of functions
export const circleMembers = {
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getUserCircleRole,
  updateMemberRole,
  removeMember
};
