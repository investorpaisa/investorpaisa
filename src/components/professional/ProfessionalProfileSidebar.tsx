
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, Users, TrendingUp, Award, 
  MapPin, Building, Star, Crown
} from 'lucide-react';

interface ProfessionalProfileSidebarProps {
  profile: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
    banner: string;
    connections: number;
    profileViews: number;
    postImpressions: number;
    skills: string[];
    premium: boolean;
  };
}

export const ProfessionalProfileSidebar: React.FC<ProfessionalProfileSidebarProps> = ({
  profile
}) => {
  return (
    <div className="space-y-4">
      {/* Main Profile Card */}
      <Card className="bg-white border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          {profile.premium && (
            <Crown className="absolute top-2 right-2 h-5 w-5 text-yellow-300 fill-current" />
          )}
        </div>
        
        <CardContent className="relative px-4 pt-0 pb-4">
          {/* Avatar */}
          <div className="flex justify-center -mt-8 mb-4">
            <Avatar className="h-16 w-16 ring-4 ring-white">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="text-center space-y-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{profile.name}</h3>
              <p className="text-sm text-gray-600 font-medium">{profile.title}</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Building className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">{profile.company}</span>
              </div>
            </div>

            {/* Connection Count */}
            <div className="flex items-center justify-center space-x-1 text-blue-600">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{profile.connections} connections</span>
            </div>

            {/* CTA */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-3"
              size="sm"
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            Analytics
          </h4>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Profile views</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">{profile.profileViews}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Post impressions</span>
              </div>
              <span className="text-sm font-semibold text-green-600">{profile.postImpressions}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Award className="h-4 w-4 mr-2 text-purple-600" />
            Top Skills
          </h4>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {profile.skills.slice(0, 3).map((skill, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700">{skill}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
              </div>
            ))}
            
            <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 hover:bg-blue-50">
              Show all skills
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
