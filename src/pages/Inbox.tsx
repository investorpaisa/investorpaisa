
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';

const Inbox = () => {
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
                {conversations.map((conversation, index) => (
                  <ConversationItem 
                    key={index} 
                    name={conversation.name} 
                    message={conversation.lastMessage} 
                    time={conversation.time} 
                    unread={conversation.unread}
                    active={index === 0}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col h-full">
            <div className="border-b pb-3 mb-3 flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Rahul Kumar</h3>
                <p className="text-xs text-muted-foreground">Financial Advisor • Online</p>
              </div>
            </div>
            
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.isMe ? 'bg-ip-teal text-white' : 'bg-muted'
                    }`}>
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t pt-3 flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
}

const ConversationItem: React.FC<ConversationItemProps> = ({ name, message, time, unread, active }) => {
  return (
    <div className={`flex items-start space-x-3 p-2 rounded-md cursor-pointer ${
      active ? 'bg-muted' : 'hover:bg-muted/50'
    }`}>
      <Avatar>
        <AvatarImage src="/placeholder.svg" />
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

// Sample data
const conversations = [
  { name: "Rahul Kumar", lastMessage: "I'd recommend considering ELSS funds for tax saving", time: "10:45 AM", unread: true },
  { name: "Priya Sharma", lastMessage: "Thanks for your advice on my portfolio", time: "Yesterday", unread: false },
  { name: "Amit Singh", lastMessage: "When can we schedule the next consultation?", time: "Yesterday", unread: true },
  { name: "Neha Patel", lastMessage: "I've shared my financial goals document", time: "Tuesday", unread: false },
  { name: "Vikram Mehta", lastMessage: "What do you think about the new budget updates?", time: "Monday", unread: false },
];

const messages = [
  { text: "Hello! I'm looking for advice on tax-saving investments for this financial year.", isMe: true, time: "10:30 AM" },
  { text: "Hi there! I'd be happy to help. What's your current income bracket and what are your existing investments?", isMe: false, time: "10:32 AM" },
  { text: "I'm in the 30% tax bracket. I already have a PPF account and some fixed deposits.", isMe: true, time: "10:35 AM" },
  { text: "That's a good start. Have you considered ELSS mutual funds? They offer tax benefits under Section 80C with a lock-in period of just 3 years.", isMe: false, time: "10:40 AM" },
  { text: "I've heard about ELSS but wasn't sure if they're right for me. What kind of returns can I expect?", isMe: true, time: "10:42 AM" },
  { text: "I'd recommend considering ELSS funds for tax saving. While past performance doesn't guarantee future returns, quality ELSS funds have historically delivered around 12-15% over long term.", isMe: false, time: "10:45 AM" },
];

export default Inbox;
