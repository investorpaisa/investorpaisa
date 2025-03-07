
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Users, Circle, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { JoinCircleModal } from '@/components/circles/JoinCircleModal';
import { CreateCircleModal } from '@/components/circles/CreateCircleModal';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useTrendingCircles } from '@/hooks/useCircles';

const Circles = () => {
  const navigate = useNavigate();
  const { data: circles = [] } = useTrendingCircles(10);
  
  const [isJoinCircleModalOpen, setIsJoinCircleModalOpen] = useState(false);
  const [isCreateCircleModalOpen, setIsCreateCircleModalOpen] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  // Mock contacts data
  const contacts = [
    {
      id: '1',
      name: 'Rahul Sharma',
      username: 'rahul_s',
      avatar: '/placeholder.svg',
      hasNewMessage: true,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Priya Patel',
      username: 'priya_finance',
      avatar: '/placeholder.svg',
      hasNewMessage: false,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Amit Verma',
      username: 'amit_v',
      avatar: '/placeholder.svg',
      hasNewMessage: true,
      lastActive: '5 minutes ago'
    }
  ];

  const filteredContacts = contactSearchQuery
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
        contact.username.toLowerCase().includes(contactSearchQuery.toLowerCase())
      )
    : contacts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Circle</h1>
        <p className="text-muted-foreground">Connect with your circles and contacts.</p>
      </div>

      <Tabs defaultValue="circles" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="circles">Circles</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="circles" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => setIsCreateCircleModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Circle
            </Button>
            <Button variant="outline" onClick={() => setIsJoinCircleModalOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              Join Circle
            </Button>
          </div>

          {circles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Circle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No circles yet</h3>
                <p className="text-muted-foreground mb-4">Create or join a circle to connect with like-minded investors.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => setIsCreateCircleModalOpen(true)}>
                    Create Circle
                  </Button>
                  <Button variant="outline" onClick={() => setIsJoinCircleModalOpen(true)}>
                    Join Circle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {circles.map(circle => (
                <Card key={circle.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/app/circles/${circle.id}`)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{circle.name}</CardTitle>
                      {circle.hasNewPost && (
                        <div className="w-2 h-2 rounded-full bg-gold"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {circle.type === 'public' ? 'Public Circle' : 'Private Circle'} • {circle.member_count || 0} members
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {circle.description || 'No description available'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-9"
              value={contactSearchQuery}
              onChange={(e) => setContactSearchQuery(e.target.value)}
            />
          </div>

          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No contacts found</h3>
                <p className="text-muted-foreground">Try searching with a different term.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map(contact => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/inbox?contact=${contact.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">@{contact.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground mr-2">{contact.lastActive}</p>
                        {contact.hasNewMessage && (
                          <div className="w-2 h-2 rounded-full bg-gold"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <JoinCircleModal 
        isOpen={isJoinCircleModalOpen} 
        onClose={() => setIsJoinCircleModalOpen(false)} 
      />
      
      <CreateCircleModal 
        isOpen={isCreateCircleModalOpen} 
        onClose={() => setIsCreateCircleModalOpen(false)} 
      />
    </div>
  );
};

export default Circles;
