
export interface ProfessionalUser {
  id: string;
  username: string;
  full_name: string;
  headline: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  industry?: string;
  current_company?: string;
  about?: string;
  followers: number;
  following: number;
  connections: number;
  is_verified: boolean;
  premium_member: boolean;
  experience_years: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  industry?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_year?: number;
  end_year?: number;
  activities?: string;
  description?: string;
}

export interface ProfessionalPost {
  id: string;
  author: ProfessionalUser;
  content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  likes: number;
  comments: number;
  reposts: number;
  is_liked: boolean;
  is_saved: boolean;
  visibility: 'public' | 'connections' | 'private';
  hashtags?: string[];
}

export interface Connection {
  id: string;
  requester: ProfessionalUser;
  receiver: ProfessionalUser;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  created_at: string;
  connected_at?: string;
}

export interface Message {
  id: string;
  sender: ProfessionalUser;
  receiver: ProfessionalUser;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  company_size?: string;
  location?: string;
  description?: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  follower_count: number;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship';
  experience_level: 'entry' | 'associate' | 'mid_senior' | 'director' | 'executive';
  description: string;
  requirements: string[];
  benefits?: string[];
  salary_range?: string;
  posted_at: string;
  expires_at?: string;
  is_remote: boolean;
  applicants_count: number;
}
