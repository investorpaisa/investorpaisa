
// Export everything from each service file
export * from './circlesService';
export * from './circleMembersService';
export * from './circlePostsService';
export * from './types';

// Individual named functions from circlesService for backward compatibility
export const {
  createCircle,
  updateCircle,
  getCircleById,
  getCircles,
  getUserCircles,
  getPublicCircles,
  getTrendingCircles,
  searchCircles
} = require('./circlesService').circles;

// Individual named functions from circleMembersService for backward compatibility
export const {
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getUserCircleRole,
  updateMemberRole,
  removeMember
} = require('./circleMembersService').circleMembers;

// Individual named functions from circlePostsService for backward compatibility
export const {
  addPostToCircle,
  getCirclePosts,
  togglePostPin,
  removePostFromCircle
} = require('./circlePostsService').circlePosts;

// For backward compatibility with existing code
export const circleService = {
  ...require('./circlesService').circles,
  ...require('./circleMembersService').circleMembers,
  ...require('./circlePostsService').circlePosts
};
