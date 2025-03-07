
// Re-export post services
import { postService as postsModuleService } from '../posts';

// Named export
export { postsModuleService };

// For backward compatibility
export const post = postsModuleService;
