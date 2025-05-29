
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getMarketStatus, 
  getIndexData, 
  getTopGainers, 
  getTopLosers,
  MarketStatus as MarketStatusType,
  MarketIndex
} from '@/services/market';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketInsights = () => {
  const [status, setStatus] = useState<MarketStatusType | null>(null);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('indices');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching market data...');
      
      // Fetch market status
      const marketStatus = await getMarketStatus();
      console.log("Market status:", marketStatus);
      setStatus(marketStatus);

      // Fetch indices data
      const indices = [];
      try {
        // Fetch Nifty 50 data
        const niftyData = await getIndexData('NIFTY 50');
        console.log("Nifty 50 data:", niftyData);
        indices.push(niftyData);
        
        // Try to fetch Bank Nifty data
        try {
          const bankNiftyData = await getIndexData('NIFTY BANK');
          console.log("Bank Nifty data:", bankNiftyData);
          indices.push(bankNiftyData);
          
          // Try to fetch IT Nifty if both previous worked
          try {
            const itNiftyData = await getIndexData('NIFTY IT');
            console.log("IT Nifty data:", itNiftyData);
            indices.push(itNiftyData);
          } catch (itError) {
            console.error("Failed to fetch IT Nifty:", itError);
          }
        } catch (bankError) {
          console.error("Failed to fetch Bank Nifty:", bankError);
        }
        
        // If we have at least Nifty 50 data, set it
        if (indices.length > 0) {
          setIndices(indices);
        } else {
          throw new Error("Could not fetch any index data");
        }
      } catch (indexError) {
        console.error("Failed to fetch index data:", indexError);
        toast.error("Failed to fetch index data. Using fallback data.");
        setError("Could not fetch live index data. Showing fallback data.");
      }

      // Fetch top gainers and losers
      try {
        const [topGainers, topLosers] = await Promise.all([
          getTopGainers(),
          getTopLosers()
        ]);
        
        console.log("Top gainers:", topGainers);
        console.log("Top losers:", topLosers);
        
        setGainers(topGainers);
        setLosers(topLosers);
      } catch (performersError) {
        console.error("Failed to fetch market performers:", performersError);
      }
      
      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      setError("Failed to load market data. Please try again later.");
      toast.error("Failed to fetch market data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Fetch data every 5 minutes when the market is open
    const intervalId = setInterval(() => {
      if (status?.status === 'open') {
        fetchData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [status?.status, fetchData]);

  const handleRefresh = () => {
    fetchData();
    toast.success("Refreshing market data...");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Real-time market status and insights.</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh data</span>
        </Button>
      </CardHeader>
      <CardContent className="pl-4 pb-4">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span>Loading market data...</span>
          </div>
        ) : error ? (
          <>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            {indices.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2">Showing available data:</p>
              </div>
            )}
          </>
        ) : null}
        
        <>
          {status && (
            <div className="mb-4">
              Market Status:{" "}
              <Badge
                variant={status.status === 'open' ? "default" : "outline"}
                className={status.status === 'open' ? "bg-green-500" : ""}
              >
                {status.status === 'open' ? "Open" : "Closed"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {status.message}
              </p>
              <p className="text-xs text-muted-foreground">
                Last Updated: {formatTime(status.timestamp)}
              </p>
            </div>
          )}
          <Tabs defaultValue="indices" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="indices">Indices</TabsTrigger>
              <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
              <TabsTrigger value="losers">Top Losers</TabsTrigger>
            </TabsList>
            <TabsContent value="indices" className="space-y-2">
              <ScrollArea className="h-[200px] w-full rounded-md border">
                {indices.length > 0 ? (
                  indices.map((index) => (
                    <div key={index.name} className="flex items-center justify-between p-3 border-b">
                      <span className="font-medium">{index.name}</span>
                      <div className="text-right">
                        <div className="font-semibold">{index.lastPrice.toLocaleString()}</div>
                        <div className={index.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {index.change.toFixed(2)} ({index.pChange.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No index data available</div>
                )}
              </ScrollArea>
              <div className="text-xs text-right text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </TabsContent>
            <TabsContent value="gainers" className="space-y-2">
              <ScrollArea className="h-[200px] w-full rounded-md border">
                {gainers.length > 0 ? (
                  gainers.map((gainer) => (
                    <div key={gainer.symbol} className="flex items-center justify-between p-3 border-b">
                      <span className="font-medium">{gainer.symbol}</span>
                      <div className="text-right">
                        <div className="font-semibold">₹{gainer.lastPrice.toLocaleString()}</div>
                        <div className="text-green-500">
                          {gainer.change.toFixed(2)} ({gainer.pChange.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No gainers data available</div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="losers" className="space-y-2">
              <ScrollArea className="h-[200px] w-full rounded-md border">
                {losers.length > 0 ? (
                  losers.map((loser) => (
                    <div key={loser.symbol} className="flex items-center justify-between p-3 border-b">
                      <span className="font-medium">{loser.symbol}</span>
                      <div className="text-right">
                        <div className="font-semibold">₹{loser.lastPrice.toLocaleString()}</div>
                        <div className="text-red-500">
                          {loser.change.toFixed(2)} ({loser.pChange.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No losers data available</div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </>
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
