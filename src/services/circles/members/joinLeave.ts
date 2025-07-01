
import { CircleMember, CircleRole } from '../types';

/**
 * Join a circle
 */
const joinCircle = async (circleId: string): Promise<CircleMember> => {
  // Note: Circles functionality has been deprecated
  console.warn('Circles functionality has been deprecated in favor of professional networking connections');
  
  // Return mock data for backwards compatibility
  const mockMember: CircleMember = {
    id: 'mock-member-id',
    circle_id: circleId,
    user_id: 'current-user-id',
    role: CircleRole.MEMBER,
    created_at: new Date().toISOString()
  };

  return Promise.resolve(mockMember);
};

/**
 * Leave a circle
 */
const leaveCircle = async (circleId: string): Promise<boolean> => {
  // Note: Circles functionality has been deprecated
  console.warn('Circles functionality has been deprecated in favor of professional networking connections');
  return Promise.resolve(true);
};

export { joinCircle, leaveCircle };
