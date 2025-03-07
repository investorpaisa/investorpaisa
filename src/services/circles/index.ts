
// Export everything from each service file
export * from './circlesService';
export * from './circleMembersService';
export * from './circlePostsService';
export * from './types';

// Import all service modules
import { circles } from './circlesService';
import { circleMembers } from './circleMembersService';
import { circlePosts } from './circlePostsService';

// Individual named functions from circlesService
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

// Individual named functions from circleMembersService
export const {
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getUserCircleRole,
  updateMemberRole,
  removeMember
} = circleMembers;

// Individual named functions from circlePostsService
export const {
  addPostToCircle,
  getCirclePosts,
  togglePostPin,
  removePostFromCircle
} = circlePosts;

// For backward compatibility with existing code
export const circleService = {
  ...circles,
  ...circleMembers,
  ...circlePosts
};
