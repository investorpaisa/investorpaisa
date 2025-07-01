
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SystemCard, Typography } from '@/components/ui/design-system';
import { MapPin, Building, Users } from 'lucide-react';

export const ProfileSidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <SystemCard className="p-0 overflow-hidden">
      {/* Banner */}
      <div className="h-16 bg-gradient-to-r from-gray-800 to-black"></div>
      
      {/* Profile Info */}
      <div className="p-4 -mt-8">
        <div className="relative">
          <img
            src={user?.avatar_url || '/placeholder.svg'}
            alt={user?.full_name || 'Profile'}
            className="w-16 h-16 rounded-full border-4 border-white mx-auto"
          />
        </div>
        
        <div className="text-center mt-3">
          <Typography.H3 className="font-semibold text-black">
            {user?.full_name || 'Professional Name'}
          </Typography.H3>
          <Typography.Small className="text-gray-600 mt-1">
            Financial Analyst at InvestCorp
          </Typography.Small>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            Mumbai, India
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Building className="w-4 h-4 mr-2" />
            Financial Services
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            500+ connections
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Profile views</span>
            <span className="text-black font-semibold">42</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-600">Post impressions</span>
            <span className="text-black font-semibold">1,234</span>
          </div>
        </div>
      </div>
    </SystemCard>
  );
};
