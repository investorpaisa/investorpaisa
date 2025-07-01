
import React, { useState } from 'react';
import { Plus, Image, Video, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SystemCard, SystemButton, Typography } from '@/components/ui/design-system';

export const CreatePostWidget: React.FC = () => {
  const { profile } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleCreatePost = () => {
    setShowModal(true);
  };

  return (
    <SystemCard className="p-4">
      <div className="flex items-start space-x-3">
        <img
          src={profile?.avatar_url || '/placeholder.svg'}
          alt={profile?.full_name || 'Profile'}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <button
            onClick={handleCreatePost}
            className="w-full text-left p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Typography.Body className="text-gray-500">
              Share an insight about the markets...
            </Typography.Body>
          </button>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-50">
                <Image className="w-5 h-5" />
                <span className="text-sm">Photo</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-50">
                <Video className="w-5 h-5" />
                <span className="text-sm">Video</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-50">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SystemCard>
  );
};
