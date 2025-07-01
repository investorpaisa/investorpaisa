
import React from 'react';
import { InvestorPaisaHeader } from '@/components/layout/InvestorPaisaHeader';
import PostFeed from '@/components/feed/PostFeed';
import { CreatePostWidget } from '@/components/posts/CreatePostWidget';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { MarketWidget } from '@/components/market/MarketWidget';
import { NetworkSuggestions } from '@/components/network/NetworkSuggestions';

export const InvestorPaisaHome: React.FC = () => {
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
              <PostFeed />
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
