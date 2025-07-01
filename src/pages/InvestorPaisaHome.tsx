
import React from 'react';
import { InvestorPaisaHeader } from '@/components/layout/InvestorPaisaHeader';
import PostFeed from '@/components/feed/PostFeed';
import { CreatePostWidget } from '@/components/posts/CreatePostWidget';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { MarketWidget } from '@/components/market/MarketWidget';
import { NetworkSuggestions } from '@/components/network/NetworkSuggestions';
import { useFeedData } from '@/hooks/useFeedData';

export const InvestorPaisaHome: React.FC = () => {
  const { posts, loading } = useFeedData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <InvestorPaisaHeader />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading feed...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorPaisaHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            <div className="space-y-6">
              <CreatePostWidget />
              <PostFeed feedPosts={posts} />
            </div>
          </div>

          {/* Right Sidebar - Market & Network */}
          <div className="col-span-3">
            <div className="space-y-6">
              <MarketWidget />
              <NetworkSuggestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
