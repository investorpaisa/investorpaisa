
// Export everything from each service file
export * from './circlesService';
export * from './circleMembersService';
export * from './circlePostsService';
export * from './types';

// For backward compatibility with existing code
export const circleService = {
  ...require('./circlesService'),
  ...require('./circleMembersService'),
  ...require('./circlePostsService')
};
