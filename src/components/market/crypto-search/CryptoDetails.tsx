
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoData } from './types';

interface CryptoDetailsProps {
  cryptoData: CryptoData | null;
  chartData: any[];
  isLoading: boolean;
  isError: boolean;
}

export const CryptoDetails: React.FC<CryptoDetailsProps> = ({ 
  cryptoData, 
  chartData, 
  isLoading, 
  isError 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Failed to load crypto data. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!cryptoData) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{cryptoData.name} ({cryptoData.symbol})</h2>
            <div className="flex items-center mt-1">
              <span className="text-xl">${cryptoData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`ml-2 ${cryptoData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last 7 Days</p>
          </div>
        </div>
        
        {/* Price chart */}
        <div className="h-48 my-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={false}
                  label={{ value: 'Time (days)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  width={60}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Day ${Math.floor(label / 24)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No historical data available
            </div>
          )}
        </div>
        
        {/* Market stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="font-medium">${cryptoData.marketCap.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-medium">${cryptoData.volume24h.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
