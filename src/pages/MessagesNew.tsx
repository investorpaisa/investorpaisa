
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  headline?: string;
}

const MessagesNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline')
        .neq('id', user?.id) // Exclude current user
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const debounceTimer = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  };

  const startConversation = async (targetUserId: string) => {
    try {
      // Check if conversation already exists
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('id')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user?.id})`)
        .limit(1);

      if (existingMessages && existingMessages.length > 0) {
        // Navigate to existing conversation
        navigate(`/messages/${targetUserId}`);
      } else {
        // Create new conversation by navigating to messages with the user
        navigate(`/messages/${targetUserId}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/messages')}
            className="rounded-2xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">New Message</h1>
            <p className="text-slate-600">Search for people to start a conversation</p>
          </div>
        </div>

        {/* Search */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-emerald-600" />
              Search People
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-2xl"
            />
          </CardContent>
        </Card>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Searching...</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchResults.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                        {profile.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{profile.full_name}</h3>
                      <p className="text-slate-600 text-sm">@{profile.username}</p>
                      {profile.headline && (
                        <p className="text-slate-500 text-sm">{profile.headline}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => startConversation(profile.id)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {searchQuery && !loading && searchResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-600">No users found matching "{searchQuery}"</p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Start a New Conversation</h3>
            <p className="text-slate-600">Search for people you'd like to message</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesNew;
