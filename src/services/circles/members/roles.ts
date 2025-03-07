
import { supabase } from '@/integrations/supabase/client';
import { CircleMember, CircleRole } from '../types';

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

  // If trying to remove yourself, use leaveCircle from the joinLeave module
  if (currentUserId === userId) {
    const { leaveCircle } = require('./joinLeave');
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

export { updateMemberRole, removeMember };
