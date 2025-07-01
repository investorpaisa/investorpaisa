
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageCircle, X } from 'lucide-react';

interface NetworkingSuggestion {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  mutualConnections: number;
  reason: string;
  location: string;
  verified: boolean;
}

interface NetworkingSuggestionsProps {
  suggestions: NetworkingSuggestion[];
}

export const NetworkingSuggestions: React.FC<NetworkingSuggestionsProps> = ({ suggestions }) => {
  const handleConnect = (userId: string) => {
    console.log('Connect with user:', userId);
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };

  const handleDismiss = (userId: string) => {
    console.log('Dismiss suggestion:', userId);
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">People you may know</h3>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <Avatar className="h-12 w-12">
                <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                <AvatarFallback>{suggestion.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{suggestion.name}</h4>
                    {suggestion.verified && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    onClick={() => handleDismiss(suggestion.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-xs text-gray-600 mt-1 truncate">{suggestion.title}</p>
                <p className="text-xs text-gray-500 truncate">{suggestion.company}</p>
                <p className="text-xs text-gray-500 mt-1">{suggestion.location}</p>
                
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-gray-500">
                    {suggestion.mutualConnections} mutual connections
                  </span>
                </div>
                
                <p className="text-xs text-blue-600 mt-1">{suggestion.reason}</p>
                
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleConnect(suggestion.id)}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleMessage(suggestion.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-sm text-blue-600">
          See all recommendations
        </Button>
      </CardContent>
    </Card>
  );
};
