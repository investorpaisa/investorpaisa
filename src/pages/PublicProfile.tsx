
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, Calendar, Building, Globe, Mail, Phone,
  UserPlus, MessageCircle, MoreHorizontal, ArrowLeft,
  Briefcase, GraduationCap, Award, Users, Heart,
  MessageSquare, Share, Bookmark
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  headline: string;
  location: string;
  industry: string;
  current_company: string;
  followers: number;
  following: number;
  connection_count: number;
  is_verified: boolean;
  banner_image: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comment_count: number;
  created_at: string;
  image_url: string;
}

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load experiences
      const { data: experienceData } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (experienceData) {
        setExperiences(experienceData);
      }

      // Load education
      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('start_year', { ascending: false });

      if (educationData) {
        setEducation(educationData);
      }

      // Load posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (postsData) {
        setPosts(postsData);
      }

      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('skill_name')
        .eq('user_id', userId);

      if (skillsData) {
        setSkills(skillsData.map(s => s.skill_name));
      }

      // Check connection status
      if (user && user.id !== userId) {
        const { data: connectionData } = await supabase
          .from('connections')
          .select('status')
          .or(`and(requester_id.eq.${user.id},receiver_id.eq.${userId}),and(requester_id.eq.${userId},receiver_id.eq.${user.id})`)
          .single();

        if (connectionData) {
          setConnectionStatus(connectionData.status);
        }
      }

    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user || !profile) return;

    try {
      await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          receiver_id: profile.id,
          status: 'pending'
        });

      setConnectionStatus('pending');
      toast.success('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h2>
          <p className="text-slate-600 mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)} className="rounded-2xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        {profile.banner_image && (
          <img 
            src={profile.banner_image} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="absolute top-6 left-6 text-white hover:bg-white/20 rounded-2xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Profile Card */}
            <Card className="rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-white shadow-xl">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold">
                      {profile.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900">{profile.full_name}</h1>
                    {profile.is_verified && (
                      <Badge className="bg-blue-100 text-blue-800 rounded-full">Verified</Badge>
                    )}
                  </div>
                  
                  <p className="text-slate-600 mb-1">@{profile.username}</p>
                  <p className="text-lg font-medium text-slate-800 mb-4">{profile.headline}</p>
                  
                  {user && user.id !== profile.id && (
                    <div className="flex space-x-2 mb-4">
                      {connectionStatus === 'none' && (
                        <Button
                          onClick={handleConnect}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      {connectionStatus === 'pending' && (
                        <Button variant="outline" disabled className="flex-1 rounded-2xl">
                          Request Sent
                        </Button>
                      )}
                      {connectionStatus === 'connected' && (
                        <Button variant="outline" className="flex-1 rounded-2xl">
                          <Users className="h-4 w-4 mr-2" />
                          Connected
                        </Button>
                      )}
                      <Button variant="outline" className="rounded-2xl">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="rounded-2xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Contact Info */}
                <div className="space-y-3">
                  {profile.location && (
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.current_company && (
                    <div className="flex items-center text-slate-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{profile.current_company}</span>
                    </div>
                  )}
                  {profile.industry && (
                    <div className="flex items-center text-slate-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{profile.industry}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-lg text-slate-900">{profile.connection_count || 0}</div>
                    <div className="text-sm text-slate-600">Connections</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">{profile.followers || 0}</div>
                    <div className="text-sm text-slate-600">Followers</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">{profile.following || 0}</div>
                    <div className="text-sm text-slate-600">Following</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {skills.length > 0 && (
              <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Experience, Education, Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {profile.bio && (
              <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                      <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-slate-600 text-sm">{exp.location}</p>
                      <p className="text-slate-500 text-sm">
                        {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                      </p>
                      {exp.description && (
                        <p className="text-slate-700 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
              <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-purple-200 pl-4">
                      <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                      <p className="text-purple-600 font-medium">{edu.degree}</p>
                      <p className="text-slate-600">{edu.field_of_study}</p>
                      <p className="text-slate-500 text-sm">
                        {edu.start_year} - {edu.end_year}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {posts.length > 0 && (
              <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 bg-slate-50 rounded-2xl">
                      <h3 className="font-semibold text-slate-900 mb-2">{post.title}</h3>
                      <p className="text-slate-700 mb-3 line-clamp-3">{post.content}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {post.comment_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
