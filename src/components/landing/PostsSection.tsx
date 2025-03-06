
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, MessageCircle, Share, Bookmark } from 'lucide-react';
import { PremiumButton } from '../ui/premium/button';

// Sample post data
const posts = [
  {
    id: 1,
    community: 'StockMarket',
    author: 'investor123',
    timePosted: '3 hours ago',
    title: "Understanding P/E Ratios: A Beginner's Guide",
    content: 'Price-to-earnings ratio (P/E) is one of the most widely used metrics for investors...',
    upvotes: 245,
    comments: 32
  },
  {
    id: 2,
    community: 'PersonalFinance',
    author: 'savingspro',
    timePosted: '6 hours ago',
    title: 'How I reduced my expenses by 30% this year',
    content: 'I wanted to share some practical tips that helped me cut down my monthly expenses...',
    upvotes: 189,
    comments: 47
  },
  {
    id: 3,
    community: 'InvestorAdvice',
    author: 'wealthbuilder',
    timePosted: '12 hours ago',
    title: 'Tax-saving strategies everyone should know',
    content: 'Here are some legitimate ways to minimize your tax burden while staying compliant...',
    upvotes: 312,
    comments: 53
  },
];

const PostCard = ({ post }: { post: typeof posts[0] }) => {
  return (
    <Card className="mb-4 border-none bg-premium-dark-800/60 hover:bg-premium-dark-800/80 transition-colors">
      <div className="flex">
        {/* Voting sidebar */}
        <div className="flex flex-col items-center p-2 bg-premium-dark-800/80 rounded-l-lg">
          <button className="text-muted-foreground hover:text-premium-gold">
            <ArrowUp className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium my-1">{post.upvotes}</span>
          <button className="text-muted-foreground hover:text-foreground">
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
        
        {/* Post content */}
        <CardContent className="p-3 w-full">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <span className="font-medium text-premium-gold">p/{post.community}</span>
            <span className="mx-1">•</span>
            <span>Posted by u/{post.author}</span>
            <span className="mx-1">•</span>
            <span>{post.timePosted}</span>
          </div>
          
          <h3 className="text-base font-medium mb-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="flex items-center gap-1 hover:bg-premium-dark-700/50 px-2 py-1 rounded">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments} Comments</span>
            </button>
            <button className="flex items-center gap-1 hover:bg-premium-dark-700/50 px-2 py-1 rounded">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 hover:bg-premium-dark-700/50 px-2 py-1 rounded">
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const PostsSection = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center bg-premium-dark-800/60 backdrop-blur-sm rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm font-medium border-b-2 border-premium-gold px-2 py-1">
          <span>Popular Posts</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-2 py-1 ml-4">
          <span>New</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-2 py-1 ml-4">
          <span>Top</span>
        </div>
      </div>
      
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      <div className="flex justify-center py-4">
        <PremiumButton variant="outline" size="sm">
          See More Posts
        </PremiumButton>
      </div>
    </section>
  );
};

export default PostsSection;
