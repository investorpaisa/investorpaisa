
import { CircleMember, CircleRole } from '../types';

/**
 * Update a member's role in a circle
 */
const updateMemberRole = async (circleId: string, memberId: string, role: CircleRole): Promise<CircleMember> => {
  // Note: Circles functionality has been deprecated
  console.warn('Circles functionality has been deprecated in favor of professional networking connections');
  
  // Return mock data for backwards compatibility
  const mockMember: CircleMember = {
    id: memberId,
    circle_id: circleId,
    user_id: 'current-user-id',
    role: role,
    created_at: new Date().toISOString()
  };

  return Promise.resolve(mockMember);
};

/**
 * Remove a member from a circle
 */
const removeMember = async (circleId: string, userId: string): Promise<boolean> => {
  // Note: Circles functionality has been deprecated
  console.warn('Circles functionality has been deprecated in favor of professional networking connections');
  return Promise.resolve(true);
};

export { updateMemberRole, removeMember };
