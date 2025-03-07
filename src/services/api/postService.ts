
import { Post, User } from './types';

export const postService = {
  // Feed
  async getFeedPosts(): Promise<Post[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock feed posts
    return Array(10).fill(0).map((_, index) => ({
      id: `post-${index}`,
      title: `Financial insight #${index + 1}`,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: {
        id: `user-${index % 5}`,
        name: `User ${index % 5}`,
        email: `user${index % 5}@example.com`,
        avatar: `https://i.pravatar.cc/150?u=user-${index % 5}`,
        role: index % 7 === 0 ? 'expert' : 'user',
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 100),
        joined: "January 2023"
      },
      category: ['Taxation', 'Investments', 'Personal Finance', 'Debt Management'][index % 4],
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: Math.random() > 0.5
    }));
  }
};
