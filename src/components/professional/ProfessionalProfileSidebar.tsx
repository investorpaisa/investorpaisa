
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Star, BookOpen } from 'lucide-react';

interface ProfessionalProfile {
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
}

interface ProfessionalProfileSidebarProps {
  profile: ProfessionalProfile;
}

export const ProfessionalProfileSidebar: React.FC<ProfessionalProfileSidebarProps> = ({ profile }) => {
  return (
    <div className="space-y-4">
      {/* Main Profile Card */}
      <Card className="bg-white border border-gray-200">
        <div 
          className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg"
          style={{ backgroundImage: `url(${profile.banner})`, backgroundSize: 'cover' }}
        />
        <CardContent className="relative pt-0 pb-4">
          <div className="flex flex-col items-center -mt-8">
            <Avatar className="h-16 w-16 border-4 border-white">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="text-center mt-3">
              <h3 className="font-semibold text-gray-900 flex items-center justify-center space-x-2">
                <span>{profile.name}</span>
                {profile.premium && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{profile.title}</p>
              <p className="text-xs text-gray-500">{profile.company}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{profile.profileViews} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{profile.connections} connections</span>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            View Profile
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Analytics</h4>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Post impressions</span>
              <span className="text-sm font-medium text-gray-900">{profile.postImpressions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile views</span>
              <span className="text-sm font-medium text-gray-900">{profile.profileViews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Search appearances</span>
              <span className="text-sm font-medium text-gray-900">42</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Top Skills</h4>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {profile.skills.slice(0, 5).map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{skill}</span>
                <Button variant="outline" size="sm" className="text-xs h-6">
                  +
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-3 text-sm text-blue-600">
            Show all skills
          </Button>
        </CardContent>
      </Card>

      {/* Learning Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-gray-900">Learning</h4>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3">
            Continue learning to advance your career
          </p>
          <Button variant="outline" className="w-full text-sm">
            See recommendations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
