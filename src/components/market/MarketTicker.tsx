
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Bitcoin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const tickerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mock data - would be replaced with real API data
    const mockData: MarketItem[] = [
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
    
    setMarketData(mockData);
    
    // In a real implementation, you would fetch market data here
    // and set up a timer to refresh it periodically
    const fetchIntervalId = setInterval(() => {
      // Simulate random changes in prices
      setMarketData(prevData => 
        prevData.map(item => {
          const randomChange = (Math.random() * 10 - 5).toFixed(2);
          const newIsUp = parseFloat(randomChange) >= 0;
          const newChange = (newIsUp ? '+' : '') + randomChange;
          const prevPrice = parseFloat(item.price.replace(/[$,]/g, ''));
          const newPrice = (prevPrice + parseFloat(randomChange)).toFixed(2);
          const formattedPrice = item.type === 'crypto' 
            ? '$' + newPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : newPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          const newChangePercent = (newIsUp ? '+' : '') + (parseFloat(randomChange) / prevPrice * 100).toFixed(2) + '%';
          
          return {
            ...item,
            price: formattedPrice,
            change: newChange,
            changePercent: newChangePercent,
            isUp: newIsUp
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(fetchIntervalId);
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
