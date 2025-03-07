
import { circleMembers } from './circleMembersService';
import { circlePosts } from './circlePostsService';
import { circles } from './circlesService';
import { CircleRole } from './types';

// Export everything from each service file
export { circleMembers, circlePosts, circles, CircleRole };

// For backward compatibility with existing code
export const circleService = {
  ...circles,
  ...circleMembers,
  ...circlePosts
};

// Export specific functions to maintain backward compatibility
export const { 
  createCircle, 
  updateCircle, 
  getCircleById, 
  getCircles, 
  getUserCircles, 
  getPublicCircles, 
  getTrendingCircles, 
  searchCircles 
} = circles;

export const {
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getUserCircleRole,
  updateMemberRole,
  removeMember
} = circleMembers;

export const {
  addPostToCircle,
  getCirclePosts,
  togglePostPin,
  removePostFromCircle
} = circlePosts;
