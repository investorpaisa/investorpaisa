
// Circle roles
export enum CircleRole {
  ADMIN = 'admin',
  CO_ADMIN = 'co-admin',
  MEMBER = 'member'
}

// Circle types
export enum CircleType {
  PUBLIC = 'public',
  PRIVATE = 'private'
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
