
import { CircleMember } from '../types';
import { Profile } from '@/types';

// Mock data for demonstration - circles functionality has been deprecated
const mockMembers: CircleMember[] = [
  {
    id: '1',
    circle_id: '1',
    user_id: 'user1',
    role: 'admin',
    created_at: new Date().toISOString(),
    profile: {
      id: 'user1',
      username: 'john_doe',
      full_name: 'John Doe',
      avatar_url: '/placeholder.svg',
      bio: 'Financial advisor',
      followers: 500,
      following: 200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'expert'
    } as Profile
  }
];

/**
 * Get members of a circle
 */
const getCircleMembers = async (circleId: string): Promise<CircleMember[]> => {
  // Note: Circles functionality has been deprecated
  console.warn('Circles functionality has been deprecated in favor of professional networking connections');
  return Promise.resolve(mockMembers.filter(m => m.circle_id === circleId));
};

/**
 * Get user's role in a circle
 */
const getUserCircleRole = async (circleId: string, userId: string): Promise<CircleMember['role'] | null> => {
  // Note: Circles functionality has been deprecated
  console.warn('Circles functionality has been deprecated in favor of professional networking connections');
  const member = mockMembers.find(m => m.circle_id === circleId && m.user_id === userId);
  return Promise.resolve(member ? member.role : null);
};

export { getCircleMembers, getUserCircleRole };
