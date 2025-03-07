
export interface ProfileData {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location?: string;
  career?: string;
  education?: string;
  certifications?: string;
  achievements?: string;
  interests: string[];
  posts: Post[];
  interactions: Interaction[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  isShared: boolean;
}

export interface Interaction {
  id: string;
  type: 'like' | 'comment';
  content?: string;
  post: {
    id: string;
    title: string;
    author: string;
    date: string;
  };
}
