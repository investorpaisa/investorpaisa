
import React, { useState } from 'react';
import { InvestorPaisaHeader } from '@/components/layout/InvestorPaisaHeader';
import { SystemCard, SystemButton, Typography } from '@/components/ui/design-system';
import { Users, UserPlus, MessageCircle } from 'lucide-react';

const connectionRequests = [
  {
    id: '1',
    name: 'Vikram Singh',
    title: 'Senior Fund Manager at SBI Mutual Fund',
    avatar: '/placeholder.svg',
    message: 'I would like to connect with you to discuss investment strategies.',
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    name: 'Kavitha Nair',
    title: 'Financial Planner at ICICI Prudential',
    avatar: '/placeholder.svg',
    message: null,
    timeAgo: '1 day ago'
  }
];

const suggestions = [
  {
    id: '1',
    name: 'Arjun Mehta',
    title: 'Investment Banking Analyst at Kotak',
    avatar: '/placeholder.svg',
    mutualConnections: 25,
    company: 'Kotak Mahindra Bank'
  },
  // Add more suggestions...
];

export const MyNetwork: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invitations' | 'suggestions'>('invitations');

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorPaisaHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Typography.H1 className="text-2xl font-bold text-black">
            My Network
          </Typography.H1>
          <Typography.Body className="text-gray-600 mt-1">
            Manage your professional network
          </Typography.Body>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invitations'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Invitations ({connectionRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suggestions'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            People you may know
          </button>
        </div>

        {/* Content */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            {connectionRequests.map((request) => (
              <SystemCard key={request.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <Typography.H3 className="font-semibold text-black">
                      {request.name}
                    </Typography.H3>
                    <Typography.Body className="text-gray-600 mb-2">
                      {request.title}
                    </Typography.Body>
                    {request.message && (
                      <Typography.Small className="text-gray-700 mb-3 p-3 bg-gray-50 rounded-lg">
                        "{request.message}"
                      </Typography.Small>
                    )}
                    <Typography.Small className="text-gray-500">
                      {request.timeAgo}
                    </Typography.Small>
                  </div>
                  <div className="flex space-x-2">
                    <SystemButton variant="outline" size="sm">
                      Ignore
                    </SystemButton>
                    <SystemButton size="sm">
                      Accept
                    </SystemButton>
                  </div>
                </div>
              </SystemCard>
            ))}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((person) => (
              <SystemCard key={person.id} className="p-6">
                <div className="text-center">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <Typography.H3 className="font-semibold text-black mb-1">
                    {person.name}
                  </Typography.H3>
                  <Typography.Body className="text-gray-600 mb-2">
                    {person.title}
                  </Typography.Body>
                  <Typography.Small className="text-gray-500 mb-4">
                    {person.mutualConnections} mutual connections
                  </Typography.Small>
                  <div className="flex space-x-2">
                    <SystemButton variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </SystemButton>
                    <SystemButton size="sm" className="flex-1">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </SystemButton>
                  </div>
                </div>
              </SystemCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
