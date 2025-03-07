
// Re-export all services

// Auth services
export * from './auth';

// Profile services
export * from './profiles';

// Export from posts module using import/export to avoid conflicts
import { postService as postsModuleService } from './posts';
export { postsModuleService };

// Circle services
export * from './circles';

// Engagement services
export * from './engagement';

// Message services - avoid type conflicts
import { messageService as messagesModuleService } from './messages';
export { messagesModuleService };

// Market services
export * from './market';

// News services
export * from './news';

// API services - avoid conflicts with types
import { 
  apiService,
  authService as apiAuthService,
  userService,
  postService as apiPostService,
  categoryService as apiCategoryService,
  messageService as apiMessageService
} from './api';

export {
  apiService,
  apiAuthService,
  userService,
  apiPostService,
  apiCategoryService,
  apiMessageService
};

// Analytics services
export * from './analytics/metricsService';

// Standalone services
export * from './categoryService';
export * from './postService';
export * from './authService';

// Backward compatibility exports
import { authService } from './auth';
import { profileService } from './profiles';
import { circleService } from './circles';
import { engagement } from './engagement';
import { marketService } from './market';
import { newsService } from './news';

// Legacy service object
export const services = {
  auth: authService,
  profile: profileService,
  post: postsModuleService,
  circle: circleService,
  engagement,
  message: messagesModuleService,
  market: marketService,
  news: newsService
};
