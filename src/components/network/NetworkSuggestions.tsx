
import React from 'react';
import { SystemCard, SystemButton, Typography } from '@/components/ui/design-system';
import { UserPlus } from 'lucide-react';

const suggestions = [
  {
    id: '1',
    name: 'Priya Sharma',
    title: 'Portfolio Manager at HDFC AMC',
    avatar: '/placeholder.svg',
    mutualConnections: 12
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    title: 'Investment Advisor at Zerodha',
    avatar: '/placeholder.svg',
    mutualConnections: 8
  },
  {
    id: '3',
    name: 'Anita Desai',
    title: 'Research Analyst at Motilal Oswal',
    avatar: '/placeholder.svg',
    mutualConnections: 15
  }
];

export const NetworkSuggestions: React.FC = () => {
  return (
    <SystemCard className="p-4">
      <Typography.H3 className="font-semibold text-black mb-4">
        People you may know
      </Typography.H3>
      
      <div className="space-y-4">
        {suggestions.map((person) => (
          <div key={person.id} className="flex items-start space-x-3">
            <img
              src={person.avatar}
              alt={person.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <Typography.Body className="font-medium text-black truncate">
                {person.name}
              </Typography.Body>
              <Typography.Small className="text-gray-600 line-clamp-2">
                {person.title}
              </Typography.Small>
              <Typography.Small className="text-gray-500 mt-1">
                {person.mutualConnections} mutual connections
              </Typography.Small>
              <SystemButton
                variant="outline"
                size="sm"
                className="mt-2 w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </SystemButton>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-black font-medium hover:bg-gray-50 p-2 rounded">
        View all suggestions
      </button>
    </SystemCard>
  );
};
