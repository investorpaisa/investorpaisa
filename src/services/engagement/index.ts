
import { likeService } from './likeService';
import { bookmarkService } from './bookmarkService';
import { commentService } from './commentService';
import { shareService } from './shareService';

// Export all services
export { likeService, bookmarkService, commentService, shareService };

// Export individual function groups from each service
export * from './likeService';
export * from './bookmarkService';
export * from './commentService';
export * from './shareService';

// Export utility functions
export * from './utils';

// For backward compatibility
export const engagement = {
  ...likeService,
  ...bookmarkService,
  ...commentService,
  ...shareService
};
