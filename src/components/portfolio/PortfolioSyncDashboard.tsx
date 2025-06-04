
import React from 'react';
import { EmailTransactionSync } from './EmailTransactionSync';
import { MarketDataSync } from './MarketDataSync';

export const PortfolioSyncDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MarketDataSync />
      <EmailTransactionSync />
    </div>
  );
};
