
import { getCircleMembers, getUserCircleRole } from './members/getMembers';
import { joinCircle, leaveCircle } from './members/joinLeave';
import { updateMemberRole, removeMember } from './members/roles';

// Export as a group of functions
export const circleMembers = {
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getUserCircleRole,
  updateMemberRole,
  removeMember
};
