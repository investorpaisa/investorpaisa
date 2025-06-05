
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { SystemCard, Typography, SystemIconButton } from './design-system';

interface ErrorToastProps {
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  isVisible,
  onClose,
  type = 'error',
  title,
  message
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return AlertCircle;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-red-500/30 bg-red-500/10';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-red-400';
    }
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <SystemCard 
            variant="glass" 
            className={`p-4 ${getColors()} backdrop-blur-xl`}
          >
            <div className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 mt-0.5 ${getIconColor()}`} />
              <div className="flex-1 min-w-0">
                <Typography.H3 className="text-sm font-medium text-white mb-1">
                  {title}
                </Typography.H3>
                <Typography.Small className="text-white/70">
                  {message}
                </Typography.Small>
              </div>
              <SystemIconButton
                icon={X}
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex-shrink-0"
              />
            </div>
          </SystemCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
