
// Re-export API services with more specific naming to avoid conflicts
import { 
  apiService,
  authService as apiAuthService,
  userService,
  postService as apiPostService,
  categoryService as apiCategoryService,
  messageService as apiMessageService
} from '../api';

// Export with specific names to avoid conflicts
export {
  apiService,
  apiAuthService,
  userService,
  apiPostService,
  apiCategoryService,
  apiMessageService
};
