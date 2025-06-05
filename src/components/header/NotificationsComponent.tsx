
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, TrendingUp } from 'lucide-react';
import { SystemCard, Typography, SystemIconButton } from '@/components/ui/design-system';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'market';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'Moksha Sharma liked your post',
    message: 'Your market analysis was insightful!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: '2',
    type: 'follow',
    title: 'Investment Expert started following you',
    message: 'You have a new follower interested in your content.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: '3',
    type: 'market',
    title: 'Market Alert',
    message: 'NIFTY 50 up 2.5% - your watchlist stocks are performing well.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true
  },
  {
    id: '4',
    type: 'comment',
    title: 'New comment on your post',
    message: 'Great analysis! What do you think about the upcoming earnings?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  }
];

export const NotificationsComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return UserPlus;
      case 'market': return TrendingUp;
      default: return Bell;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <div className="relative" ref={notificationRef}>
      <div className="relative">
        <SystemIconButton
          icon={Bell}
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-black">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 z-50"
            >
              <SystemCard variant="glass" className="p-0 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <Typography.H3 className="text-lg">Notifications</Typography.H3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-gold hover:text-gold/80 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-y-auto max-h-80">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-gold/5' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              notification.type === 'like' ? 'bg-red-500/20' :
                              notification.type === 'follow' ? 'bg-blue-500/20' :
                              notification.type === 'market' ? 'bg-green-500/20' :
                              'bg-gold/20'
                            }`}>
                              <Icon className={`w-4 h-4 ${
                                notification.type === 'like' ? 'text-red-400' :
                                notification.type === 'follow' ? 'text-blue-400' :
                                notification.type === 'market' ? 'text-green-400' :
                                'text-gold'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <Typography.Body className="text-sm font-medium truncate">
                                  {notification.title}
                                </Typography.Body>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <Typography.Small className="mt-1 line-clamp-2">
                                {notification.message}
                              </Typography.Small>
                              <Typography.Small className="mt-1 text-white/40">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </Typography.Small>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <Typography.Body className="text-white/60">
                        No notifications yet
                      </Typography.Body>
                    </div>
                  )}
                </div>
              </SystemCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
