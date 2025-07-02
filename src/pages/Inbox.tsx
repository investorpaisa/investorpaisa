
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Phone, VideoIcon, MoreVertical, PlusCircle, ArrowLeft } from 'lucide-react';
import { messageService } from '@/services/messages';
import { Message, User } from '@/services/api';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const Inbox = () => {
  const [conversations, setConversations] = useState<{user: User, lastMessage: string, unreadCount: number}[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConversationList, setShowConversationList] = useState(true);
  const isMobile = useIsMobile();

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

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversationList(true);
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6 h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Connect with other investors and financial advisors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
          {/* Conversations List */}
          <div className={`lg:col-span-1 ${isMobile && !showConversationList ? 'hidden' : ''}`}>
            <Card className="h-full rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Conversations</h2>
                  <Button size="sm" className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-colors" 
                  />
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {loading ? (
                      <div className="text-center py-4 text-slate-500">Loading conversations...</div>
                    ) : conversations.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                          <PlusCircle className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">No conversations yet</h3>
                        <p className="text-slate-500 text-sm">Start connecting with other investors</p>
                      </div>
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
                          onClick={() => handleSelectUser(conversation.user)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-2 ${isMobile && showConversationList ? 'hidden' : ''}`}>
            <Card className="h-full rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col h-full">
                {selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isMobile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToConversations}
                            className="mr-2 rounded-2xl"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        )}
                        <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                          <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                            {selectedUser.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900">{selectedUser.name}</h3>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-slate-600">
                              {selectedUser.role === 'expert' ? 'Financial Advisor' : 'Investor'}
                            </p>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="rounded-2xl">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-2xl">
                          <VideoIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-2xl">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <ScrollArea className="flex-1 pr-4 mb-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                              <Send className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Start the conversation</h3>
                            <p className="text-slate-500 text-sm">Send your first message to connect</p>
                          </div>
                        ) : (
                          messages.map((message, index) => (
                            <div key={message.id || index} className={`flex ${message.sender.id === selectedUser.id ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-[80%] px-4 py-3 rounded-3xl ${
                                message.sender.id === selectedUser.id 
                                  ? 'bg-slate-100 text-slate-900' 
                                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p className="text-xs mt-2 opacity-70">{formatMessageTime(message.createdAt)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                    
                    {/* Message Input */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-end space-x-3">
                        <div className="flex-1 relative">
                          <Input 
                            placeholder="Type your message..." 
                            className="pr-12 rounded-3xl border-slate-200 bg-slate-50 focus:bg-white transition-colors min-h-[48px] resize-none" 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                        </div>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="rounded-full h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Send className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a conversation</h3>
                      <p className="text-slate-600">Choose from your existing conversations or start a new one</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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
      className={`flex items-start space-x-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
          : 'hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 ring-2 ring-transparent">
        <AvatarImage src={avatar || '/placeholder.svg'} />
        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
          {name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold text-slate-900 truncate">{name}</h4>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
        <p className={`text-sm truncate ${unread ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
          {message}
        </p>
      </div>
      {unread && (
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
          1
        </Badge>
      )}
    </div>
  );
};

export default Inbox;
