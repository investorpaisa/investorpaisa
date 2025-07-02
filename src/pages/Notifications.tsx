
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, Heart, MessageCircle, Share2, Users, TrendingUp, 
  Settings, CheckCheck, Trash2, Filter, Search, Star,
  UserPlus, Award, AlertCircle, DollarSign, Briefcase
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'market' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'Rajesh Kumar liked your post',
      message: 'Your post about "Market Analysis: Nifty50 crosses 22,000" received a like',
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      avatar: '/placeholder.svg',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'follow',
      title: 'Priya Sharma started following you',
      message: 'Wealth Manager at Kotak Wealth is now following your investment insights',
      time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
      avatar: '/placeholder.svg',
      priority: 'high'
    },
    {
      id: '3',
      type: 'comment',
      title: 'New comment on your post',
      message: 'Amit Singh commented: "Great analysis! What are your thoughts on banking stocks?"',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      avatar: '/placeholder.svg',
      priority: 'high'
    },
    {
      id: '4',
      type: 'market',
      title: 'Market Alert: NIFTY 50',
      message: 'NIFTY 50 has crossed your watchlist target of 22,000. Current price: 22,326.90 (+0.71%)',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'high'
    },
    {
      id: '5',
      type: 'mention',
      title: 'You were mentioned in a post',
      message: 'Vikash Sharma mentioned you in a discussion about "Best Investment Strategies for 2024"',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      avatar: '/placeholder.svg',
      priority: 'medium'
    },
    {
      id: '6',
      type: 'system',
      title: 'Profile verification complete',
      message: 'Your financial advisor profile has been verified. You now have access to premium features.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'medium'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return UserPlus;
      case 'mention': return Share2;
      case 'market': return TrendingUp;
      case 'system': return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'from-red-500 to-pink-500';
      case 'comment': return 'from-blue-500 to-cyan-500';
      case 'follow': return 'from-green-500 to-emerald-500';
      case 'mention': return 'from-purple-500 to-violet-500';
      case 'market': return 'from-orange-500 to-yellow-500';
      case 'system': return 'from-slate-500 to-gray-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filterNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === activeTab);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-600">Stay updated with your investment community</p>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white rounded-full h-6 w-6 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="rounded-2xl"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" className="rounded-2xl">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-7 h-auto mb-4 bg-slate-100 rounded-2xl p-1">
                <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span>Unread</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white rounded-full h-4 w-4 p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="like" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Likes
                </TabsTrigger>
                <TabsTrigger value="comment" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Comments
                </TabsTrigger>
                <TabsTrigger value="follow" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="h-4 w-4 mr-1" />
                  Follows
                </TabsTrigger>
                <TabsTrigger value="market" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Markets
                </TabsTrigger>
                <TabsTrigger value="system" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  System
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filterNotifications().map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group ${
                  !notification.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${colorClass} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    
                    {/* Avatar (if available) */}
                    {notification.avatar && (
                      <Avatar className="h-12 w-12 ring-2 ring-slate-100 flex-shrink-0">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                          {notification.title.split(' ')[0]?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          {notification.priority === 'high' && (
                            <Badge className="bg-red-100 text-red-700 rounded-full px-2 py-1 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              High
                            </Badge>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-3 line-height-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                          {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                        </p>
                        
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="rounded-2xl text-blue-600 hover:bg-blue-50"
                            >
                              <CheckCheck className="h-4 w-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="rounded-2xl text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filterNotifications().length === 0 && (
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No notifications</h3>
                <p className="text-slate-600">
                  {activeTab === 'unread' 
                    ? "You're all caught up! No unread notifications." 
                    : "No notifications in this category yet."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
