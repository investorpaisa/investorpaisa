
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, MapPin, Building, Users, 
  TrendingUp, Award, DollarSign
} from 'lucide-react';

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

export const NetworkingSuggestions: React.FC<NetworkingSuggestionsProps> = ({
  suggestions
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Financial professionals you may know
          </h4>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
            See all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Avatar className="h-12 w-12 ring-2 ring-transparent hover:ring-blue-200 transition-all">
                <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                <AvatarFallback className="bg-blue-600 text-white font-medium">
                  {suggestion.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="font-medium text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors">
                    {suggestion.name}
                  </h5>
                  {suggestion.verified && (
                    <DollarSign className="h-3 w-3 text-green-600" />
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                  {suggestion.title}
                </p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{suggestion.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{suggestion.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {suggestion.mutualConnections > 0 && (
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{suggestion.mutualConnections} mutual connections</span>
                      </span>
                    )}
                    <div className="mt-1 text-xs text-blue-600">
                      {suggestion.reason}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-3 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:bg-blue-50">
          View more financial professionals
        </Button>
      </CardContent>
    </Card>
  );
};
