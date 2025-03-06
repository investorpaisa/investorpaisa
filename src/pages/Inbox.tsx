
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';
import { messageService } from '@/services/messages';
import { Message, User } from '@/services/api';
import { format } from 'date-fns';

const Inbox = () => {
  const [conversations, setConversations] = useState<{user: User, lastMessage: string, unreadCount: number}[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch conversations when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const conversations = await messageService.getConversations();
      setConversations(conversations);
      setLoading(false);
    };

    fetchConversations();
  }, []);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const messages = await messageService.getMessages(selectedUser.id);
        setMessages(messages);
      };

      fetchMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    const message = await messageService.sendMessage(selectedUser.id, newMessage);
    if (message) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Update the conversation list with new message
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.user.id === selectedUser.id);
        
        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            lastMessage: newMessage,
            unreadCount: 0
          };
          
          // Move this conversation to the top
          const [conversation] = updated.splice(index, 1);
          updated.unshift(conversation);
        } else {
          // This is a new conversation
          updated.unshift({
            user: selectedUser,
            lastMessage: newMessage,
            unreadCount: 0
          });
        }
        
        return updated;
      });
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  // Select the first conversation by default if none is selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedUser) {
      setSelectedUser(conversations[0].user);
    }
  }, [conversations, selectedUser]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inbox</h1>
        <p className="text-muted-foreground">Connect with other investors and financial advisors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No conversations yet.</div>
                ) : (
                  conversations.map((conversation, index) => (
                    <ConversationItem 
                      key={conversation.user.id} 
                      name={conversation.user.name} 
                      message={conversation.lastMessage} 
                      time={format(new Date(), 'h:mm a')} 
                      unread={conversation.unreadCount > 0}
                      active={selectedUser?.id === conversation.user.id}
                      avatar={conversation.user.avatar}
                      onClick={() => setSelectedUser(conversation.user)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col h-full">
            {selectedUser ? (
              <>
                <div className="border-b pb-3 mb-3 flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedUser.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.role === 'expert' ? 'Financial Advisor' : 'Investor'} • Online
                    </p>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div key={message.id || index} className={`flex ${message.sender.id === selectedUser.id ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            message.sender.id === selectedUser.id ? 'bg-muted' : 'bg-ip-teal text-white'
                          }`}>
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">{formatMessageTime(message.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                
                <div className="border-t pt-3 flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation or start a new one.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ConversationItemProps {
  name: string;
  message: string;
  time: string;
  unread: boolean;
  active: boolean;
  avatar?: string;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ name, message, time, unread, active, avatar, onClick }) => {
  return (
    <div 
      className={`flex items-start space-x-3 p-2 rounded-md cursor-pointer ${
        active ? 'bg-muted' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={avatar || '/placeholder.svg'} />
        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-medium truncate">{name}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className={`text-sm truncate ${unread ? 'font-medium' : 'text-muted-foreground'}`}>
          {message}
        </p>
      </div>
      {unread && <div className="w-2 h-2 rounded-full bg-ip-teal flex-shrink-0 mt-2"></div>}
    </div>
  );
};

export default Inbox;
