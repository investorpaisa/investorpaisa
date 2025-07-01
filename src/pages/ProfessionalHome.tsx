
import React, { useState } from 'react';
import { InvestorPaisaHeader } from '@/components/layout/InvestorPaisaHeader';
import { ProfessionalFeed } from '@/components/professional/ProfessionalFeed';
import { ProfessionalProfileSidebar } from '@/components/professional/ProfessionalProfileSidebar';
import { NetworkingSuggestions } from '@/components/professional/NetworkingSuggestions';
import { CreatePostModal } from '@/components/professional/CreatePostModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Image, Video, Calendar } from 'lucide-react';

export const ProfessionalHome: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Mock data - in a real app, this would come from API
  const userProfile = {
    id: '1',
    name: 'Rahul Sharma',
    title: 'Senior Financial Advisor',
    company: 'HDFC Bank',
    avatar: '/placeholder.svg',
    banner: '/placeholder.svg',
    connections: 1247,
    profileViews: 89,
    postImpressions: 2341,
    skills: ['Financial Planning', 'Investment Advisory', 'Risk Management', 'Portfolio Analysis', 'Tax Planning'],
    premium: true
  };

  const mockPosts = [
    {
      id: '1',
      author: {
        id: '2',
        name: 'Priya Patel',
        title: 'Investment Banking Analyst',
        company: 'Goldman Sachs',
        avatar: '/placeholder.svg',
        verified: true
      },
      content: 'Excited to share that our team just closed a $50M Series B funding round for a fintech startup! The future of digital banking looks incredibly promising. What are your thoughts on the evolving fintech landscape? #fintech #investment #banking',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      reposts: 12,
      isLiked: false,
      tags: ['fintech', 'investment', 'banking']
    },
    {
      id: '2',
      author: {
        id: '3',
        name: 'Amit Verma',
        title: 'Portfolio Manager',
        company: 'Mutual Fund Corp',
        avatar: '/placeholder.svg',
        verified: false
      },
      content: 'Market volatility presents both challenges and opportunities. In times like these, diversification and a long-term perspective become even more crucial. Here are my top 3 strategies for navigating uncertain markets...',
      image: '/placeholder.svg',
      timestamp: '4 hours ago',
      likes: 156,
      comments: 28,
      reposts: 8,
      isLiked: true,
      tags: ['investing', 'portfolio', 'strategy']
    }
  ];

  const networkingSuggestions = [
    {
      id: '1',
      name: 'Kavitha Nair',
      title: 'Financial Planner',
      company: 'ICICI Prudential',
      avatar: '/placeholder.svg',
      mutualConnections: 15,
      reason: 'You both work in financial services',
      location: 'Mumbai, India',
      verified: true
    },
    {
      id: '2',
      name: 'Vikram Singh',
      title: 'Fund Manager',
      company: 'SBI Mutual Fund',
      avatar: '/placeholder.svg',
      mutualConnections: 8,
      reason: 'You have 8 mutual connections',
      location: 'Delhi, India',
      verified: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorPaisaHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="col-span-3">
            <ProfessionalProfileSidebar profile={userProfile} />
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            <div className="space-y-6">
              {/* Create Post Widget */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="flex-1 text-left p-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Start a post...
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      <Image className="h-5 w-5 text-blue-600" />
                      <span>Photo</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      <Video className="h-5 w-5 text-green-600" />
                      <span>Video</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <span>Event</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      <Edit className="h-5 w-5 text-red-600" />
                      <span>Article</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Feed */}
              <ProfessionalFeed posts={mockPosts} />
            </div>
          </div>

          {/* Right Sidebar - Networking */}
          <div className="col-span-3">
            <div className="space-y-6">
              <NetworkingSuggestions suggestions={networkingSuggestions} />
              
              {/* Industry News or Professional Updates could go here */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Today's highlights</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">Markets update</p>
                      <p className="text-gray-600 text-xs">Sensex gains 2.3% amid positive global cues</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">Industry insight</p>
                      <p className="text-gray-600 text-xs">Fintech funding hits new high in Q4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        userProfile={userProfile}
      />
    </div>
  );
};
