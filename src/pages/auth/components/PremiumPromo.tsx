
import React from 'react';
import { Sparkles } from 'lucide-react';

export const PremiumPromo: React.FC = () => {
  return (
    <div className="bg-premium-dark-800/60 rounded-xl p-4 border border-premium-dark-700/30 flex items-center gap-3">
      <div className="shrink-0">
        <Sparkles className="h-5 w-5 text-premium-gold" />
      </div>
      <div className="text-xs text-muted-foreground">
        <p>Join Investor Paisa Premium for exclusive finance insights and expert advice.</p>
      </div>
    </div>
  );
};
