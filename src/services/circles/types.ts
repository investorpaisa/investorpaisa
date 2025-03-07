
// Circle roles
export enum CircleRole {
  ADMIN = 'admin',
  CO_ADMIN = 'co-admin',
  MEMBER = 'member'
}

// Re-export types from main types file
export type { 
  Circle, 
  CircleInsert, 
  CircleUpdate, 
  CircleMember, 
  CirclePost,
  EnhancedPost
} from '@/types';
