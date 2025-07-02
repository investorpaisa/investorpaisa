
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, MessageCircle, Search, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MyNetwork = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'invitations' | 'suggestions' | 'connections'>('invitations');
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNetworkData();
    }
  }, [user]);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      
      // Load connection requests
      const { data: requests } = await supabase
        .from('connections')
        .select(`
          *,
          requester:profiles!connections_requester_id_fkey(*)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      // Load suggestions (other users not connected)
      const { data: suggestedUsers } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(10);

      // Load existing connections
      const { data: userConnections } = await supabase
        .from('connections')
        .select(`
          *,
          requester:profiles!connections_requester_id_fkey(*),
          receiver:profiles!connections_receiver_id_fkey(*)
        `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted');

      setConnectionRequests(requests || []);
      setSuggestions(suggestedUsers || []);
      setConnections(userConnections || []);
    } catch (error) {
      console.error('Error loading network data:', error);
      toast.error('Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async (connectionId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await supabase
          .from('connections')
          .update({ 
            status: 'accepted',
            connected_at: new Date().toISOString()
          })
          .eq('id', connectionId);
        
        toast.success('Connection accepted!');
      } else {
        await supabase
          .from('connections')
          .delete()
          .eq('id', connectionId);
        
        toast.success('Connection request declined');
      }
      
      loadNetworkData();
    } catch (error) {
      console.error('Error handling connection:', error);
      toast.error('Failed to update connection');
    }
  };

  const sendConnectionRequest = async (receiverId: string) => {
    try {
      await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          receiver_id: receiverId,
          status: 'pending'
        });
      
      toast.success('Connection request sent!');
      loadNetworkData();
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
          <p className="text-slate-600">Loading your network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Network</h1>
          <p className="text-slate-600">Manage your professional connections</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/50 backdrop-blur-sm rounded-3xl p-2 border border-slate-200/50">
          {[
            { key: 'invitations', label: 'Invitations', count: connectionRequests.length },
            { key: 'suggestions', label: 'People you may know', count: suggestions.length },
            { key: 'connections', label: 'My Connections', count: connections.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'invitations' && (
            <div className="space-y-4">
              {connectionRequests.length === 0 ? (
                <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No pending invitations</h3>
                    <p className="text-slate-600">Check back later for new connection requests</p>
                  </CardContent>
                </Card>
              ) : (
                connectionRequests.map((request) => (
                  <Card key={request.id} className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16 ring-2 ring-blue-100">
                          <AvatarImage src={request.requester?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                            {request.requester?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-lg">{request.requester?.full_name}</h3>
                          <p className="text-slate-600 mb-2">{request.requester?.headline || 'Professional'}</p>
                          {request.message && (
                            <p className="text-slate-700 mb-3 p-3 bg-slate-50 rounded-2xl italic">
                              "{request.message}"
                            </p>
                          )}
                          <div className="flex items-center text-slate-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => handleConnectionAction(request.id, 'reject')}
                            className="rounded-2xl"
                          >
                            Decline
                          </Button>
                          <Button
                            onClick={() => handleConnectionAction(request.id, 'accept')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((person) => (
                <Card key={person.id} className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-blue-100">
                      <AvatarImage src={person.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg">
                        {person.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-slate-900 mb-1">{person.full_name}</h3>
                    <p className="text-slate-600 mb-2 text-sm">{person.headline || 'Professional'}</p>
                    <p className="text-slate-500 text-xs mb-4">{person.followers || 0} connections</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-2xl"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => sendConnectionRequest(person.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => {
                const connectedUser = connection.requester_id === user.id ? connection.receiver : connection.requester;
                return (
                  <Card key={connection.id} className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-green-100">
                        <AvatarImage src={connectedUser?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg">
                          {connectedUser?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-slate-900 mb-1">{connectedUser?.full_name}</h3>
                      <p className="text-slate-600 mb-2 text-sm">{connectedUser?.headline || 'Professional'}</p>
                      <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 rounded-full">
                        Connected
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-2xl"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-2xl"
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { MyNetwork };
