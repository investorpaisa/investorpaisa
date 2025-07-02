
import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SessionContextType {
  sessionId: string;
  lastActivity: Date;
  updateActivity: () => void;
  isSessionValid: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    // Get or create session ID
    let storedSessionId = localStorage.getItem('session_id');
    const storedActivity = localStorage.getItem('last_activity');
    
    if (!storedSessionId || isSessionExpired(storedActivity)) {
      storedSessionId = uuidv4();
      localStorage.setItem('session_id', storedSessionId);
      updateActivity();
    } else {
      setLastActivity(new Date(storedActivity || new Date()));
    }
    
    setSessionId(storedSessionId);

    // Set up activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => updateActivity();

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup listeners
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  const isSessionExpired = (activityTime: string | null): boolean => {
    if (!activityTime) return true;
    const lastTime = new Date(activityTime);
    const now = new Date();
    const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
    return diffHours > 24; // Session expires after 24 hours
  };

  const updateActivity = () => {
    const now = new Date();
    setLastActivity(now);
    localStorage.setItem('last_activity', now.toISOString());
  };

  const isSessionValid = (): boolean => {
    return !isSessionExpired(lastActivity.toISOString());
  };

  const value = {
    sessionId,
    lastActivity,
    updateActivity,
    isSessionValid
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
