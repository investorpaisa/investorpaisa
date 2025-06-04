
import React from 'react';
import { PortfolioDashboard } from '@/components/portfolio/PortfolioDashboard';

const Portfolio: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
          Portfolio Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your investments and monitor your financial progress
        </p>
      </div>
      
      <PortfolioDashboard />
    </div>
  );
};

export default Portfolio;
