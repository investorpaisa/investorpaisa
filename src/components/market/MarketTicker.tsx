
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Bitcoin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getIndexData, NSE_INDICES } from '@/services/market';
import { toast } from 'sonner';

interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isUp: boolean;
  type: 'index' | 'crypto' | 'stock';
}

const MarketTicker = () => {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const tickerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // Fetch real NSE index data
        const nifty50 = await getIndexData(NSE_INDICES.NIFTY_50);
        const bankNifty = await getIndexData(NSE_INDICES.NIFTY_BANK);
        const itNifty = await getIndexData(NSE_INDICES.NIFTY_IT);
        
        // Prepare market data from real API responses
        const realMarketData: MarketItem[] = [
          { 
            id: '1', 
            symbol: 'NIFTY', 
            name: 'NIFTY 50', 
            price: nifty50.lastPrice.toLocaleString('en-IN'), 
            change: nifty50.change.toFixed(2), 
            changePercent: `${nifty50.change >= 0 ? '+' : ''}${nifty50.pChange.toFixed(2)}%`, 
            isUp: nifty50.change >= 0, 
            type: 'index' 
          },
          { 
            id: '2', 
            symbol: 'BANKNIFTY', 
            name: 'NIFTY BANK', 
            price: bankNifty.lastPrice.toLocaleString('en-IN'), 
            change: bankNifty.change.toFixed(2), 
            changePercent: `${bankNifty.change >= 0 ? '+' : ''}${bankNifty.pChange.toFixed(2)}%`, 
            isUp: bankNifty.change >= 0, 
            type: 'index' 
          },
          { 
            id: '3', 
            symbol: 'NIFTYIT', 
            name: 'NIFTY IT', 
            price: itNifty.lastPrice.toLocaleString('en-IN'), 
            change: itNifty.change.toFixed(2), 
            changePercent: `${itNifty.change >= 0 ? '+' : ''}${itNifty.pChange.toFixed(2)}%`, 
            isUp: itNifty.change >= 0, 
            type: 'index' 
          },
        ];
        
        // Add some static international indices and crypto for completeness
        const staticData: MarketItem[] = [
          { id: '4', symbol: 'DJIA', name: 'Dow Jones', price: '39,123.45', change: '+223.67', changePercent: '+0.57%', isUp: true, type: 'index' },
          { id: '5', symbol: 'NASDAQ', name: 'NASDAQ', price: '16,789.23', change: '+45.67', changePercent: '+0.27%', isUp: true, type: 'index' },
          { id: '6', symbol: 'S&P500', name: 'S&P 500', price: '5,234.56', change: '-12.34', changePercent: '-0.24%', isUp: false, type: 'index' },
          { id: '7', symbol: 'BTC', name: 'Bitcoin', price: '$67,890.45', change: '+1234.56', changePercent: '+1.85%', isUp: true, type: 'crypto' },
          { id: '8', symbol: 'ETH', name: 'Ethereum', price: '$3,456.78', change: '+78.90', changePercent: '+2.34%', isUp: true, type: 'crypto' },
          { id: '9', symbol: 'SOL', name: 'Solana', price: '$178.23', change: '-5.67', changePercent: '-3.08%', isUp: false, type: 'crypto' },
        ];
        
        setMarketData([...realMarketData, ...staticData]);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        toast.error("Could not load market data. Using fallback data.");
        
        // Fallback to static data
        const fallbackData: MarketItem[] = [
          { id: '1', symbol: 'NIFTY', name: 'NIFTY 50', price: '22,456.50', change: '+120.45', changePercent: '+0.54%', isUp: true, type: 'index' },
          { id: '2', symbol: 'SENSEX', name: 'BSE SENSEX', price: '73,890.30', change: '+245.78', changePercent: '+0.33%', isUp: true, type: 'index' },
          { id: '3', symbol: 'BANKNIFTY', name: 'NIFTY BANK', price: '48,123.75', change: '-156.25', changePercent: '-0.32%', isUp: false, type: 'index' },
          { id: '4', symbol: 'DJIA', name: 'Dow Jones', price: '39,123.45', change: '+223.67', changePercent: '+0.57%', isUp: true, type: 'index' },
          { id: '5', symbol: 'NASDAQ', name: 'NASDAQ', price: '16,789.23', change: '+45.67', changePercent: '+0.27%', isUp: true, type: 'index' },
          { id: '6', symbol: 'S&P500', name: 'S&P 500', price: '5,234.56', change: '-12.34', changePercent: '-0.24%', isUp: false, type: 'index' },
          { id: '7', symbol: 'BTC', name: 'Bitcoin', price: '$67,890.45', change: '+1234.56', changePercent: '+1.85%', isUp: true, type: 'crypto' },
          { id: '8', symbol: 'ETH', name: 'Ethereum', price: '$3,456.78', change: '+78.90', changePercent: '+2.34%', isUp: true, type: 'crypto' },
          { id: '9', symbol: 'SOL', name: 'Solana', price: '$178.23', change: '-5.67', changePercent: '-3.08%', isUp: false, type: 'crypto' },
        ];
        setMarketData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchMarketData();
    
    // Set up periodic refresh (every 5 minutes)
    const refreshIntervalId = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshIntervalId);
  }, []);
  
  const handleItemClick = (item: MarketItem) => {
    // Navigate to detailed view
    if (item.type === 'index' || item.type === 'stock') {
      navigate(`/market?symbol=${item.symbol}`);
    } else {
      navigate(`/market?crypto=${item.symbol}`);
    }
  };
  
  const scrollLeft = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-black text-white border-t border-gold/20 h-10 flex items-center relative shadow-lg overflow-hidden"
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => setIsPaused(false)}>
      
      {/* Left control */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
        <button onClick={scrollLeft} className="h-full px-2 bg-black hover:bg-black/80 text-gold transition-colors">
          <ChevronLeft size={18} />
        </button>
      </div>
      
      {/* Scrolling ticker */}
      <div 
        ref={tickerRef}
        className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none mx-8"
        style={{ scrollBehavior: 'smooth' }}
      >
        {loading ? (
          <div className="inline-flex items-center text-xs">Loading market data...</div>
        ) : (
          <div 
            className={`inline-block whitespace-nowrap ${!isPaused ? 'animate-marquee' : ''}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {marketData.map((item) => (
              <div 
                key={item.id}
                className="inline-flex items-center mr-6 cursor-pointer hover:bg-white/10 px-3 py-1 rounded-md transition-colors"
                onClick={() => handleItemClick(item)}
              >
                {item.type === 'crypto' ? (
                  <Bitcoin size={16} className="text-gold mr-2" />
                ) : (
                  <TrendingUp size={16} className="text-gold mr-2" />
                )}
                <span className="text-xs font-bold mr-2">{item.symbol}</span>
                <span className="text-xs mr-2">{item.price}</span>
                <span className={`text-xs ${item.isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {item.changePercent}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Right control */}
      <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
        <button onClick={scrollRight} className="h-full px-2 bg-black hover:bg-black/80 text-gold transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default MarketTicker;
