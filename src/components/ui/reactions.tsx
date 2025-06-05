
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsUp, Smile, Angry, Frown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReactionType {
  id: string;
  emoji: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}

const reactions: ReactionType[] = [
  { id: 'like', emoji: '👍', icon: ThumbsUp, label: 'Like', color: 'text-gold' },
  { id: 'love', emoji: '❤️', icon: Heart, label: 'Love', color: 'text-red-500' },
  { id: 'laugh', emoji: '😂', icon: Smile, label: 'Laugh', color: 'text-yellow-500' },
  { id: 'wow', emoji: '😮', icon: Star, label: 'Wow', color: 'text-blue-500' },
  { id: 'sad', emoji: '😢', icon: Frown, label: 'Sad', color: 'text-gray-500' },
  { id: 'angry', emoji: '😠', icon: Angry, label: 'Angry', color: 'text-red-600' },
];

interface ReactionsProps {
  contentId: string;
  onReaction?: (reactionId: string) => void;
  userReaction?: string | null;
  reactionCounts?: Record<string, number>;
  compact?: boolean;
}

export const Reactions: React.FC<ReactionsProps> = ({
  contentId,
  onReaction,
  userReaction,
  reactionCounts = {},
  compact = false
}) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reactionId: string) => {
    onReaction?.(reactionId);
    setShowReactions(false);
  };

  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="relative">
      {/* Main reaction button */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReactions(!showReactions)}
          className={`
            flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200
            ${userReaction 
              ? 'bg-gold/20 text-gold border border-gold/30' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }
          `}
        >
          {userReaction ? (
            <>
              <span className="text-sm">
                {reactions.find(r => r.id === userReaction)?.emoji}
              </span>
              {!compact && (
                <span className="text-xs font-medium">
                  {reactions.find(r => r.id === userReaction)?.label}
                </span>
              )}
            </>
          ) : (
            <>
              <ThumbsUp className="w-4 h-4" />
              {!compact && <span className="text-xs">React</span>}
            </>
          )}
          {getTotalReactions() > 0 && (
            <span className="text-xs text-white/60">
              {getTotalReactions()}
            </span>
          )}
        </Button>
      </div>

      {/* Reaction picker */}
      {showReactions && (
        <motion.div
          className="absolute bottom-full left-0 mb-2 flex items-center space-x-1 bg-black/95 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1 shadow-lg z-50"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {reactions.map((reaction) => (
            <motion.button
              key={reaction.id}
              onClick={() => handleReaction(reaction.id)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              title={reaction.label}
            >
              <span className="text-lg">{reaction.emoji}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Reaction counts display */}
      {!compact && getTotalReactions() > 0 && (
        <div className="flex items-center space-x-1 mt-1">
          {Object.entries(reactionCounts)
            .filter(([_, count]) => count > 0)
            .slice(0, 3)
            .map(([reactionId, count]) => {
              const reaction = reactions.find(r => r.id === reactionId);
              return (
                <div
                  key={reactionId}
                  className="flex items-center space-x-1 text-xs text-white/60"
                >
                  <span>{reaction?.emoji}</span>
                  <span>{count}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
