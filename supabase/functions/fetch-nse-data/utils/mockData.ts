
// Mock data generators for fallback scenarios
import { corsHeaders } from "./cors.ts";
import { getCompanyName } from "./helpers.ts";

export function simulateIndexData(indexName: string) {
  const baseValue = indexName === 'NIFTY 50' ? 22500 : 
                  indexName === 'NIFTY BANK' ? 48000 : 
                  indexName === 'NIFTY IT' ? 33500 : 
                  indexName === 'NIFTY PHARMA' ? 17800 : 
                  Math.random() * 20000 + 15000;
  
  const change = (Math.random() * 400) - 200;
  const percentChange = (change / baseValue) * 100;
  
  const mockData = {
    name: indexName,
    lastPrice: baseValue,
    open: baseValue - (Math.random() * 100),
    high: baseValue + (Math.random() * 200),
    low: baseValue - (Math.random() * 200),
    previousClose: baseValue - change,
    change: change,
    pChange: percentChange,
    timestamp: new Date().toISOString()
  };
  
  console.log(`Returning simulated data for index: ${indexName}`);
  
  return new Response(
    JSON.stringify(mockData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function simulateStockQuote(symbol: string) {
  const basePrice = symbol === 'RELIANCE' ? 2540.75 : 
                  symbol === 'TCS' ? 3456.80 : 
                  symbol === 'HDFCBANK' ? 1678.25 : 
                  symbol === 'INFY' ? 1540.65 : 
                  Math.random() * 2000 + 500;
  
  const priceChange = (Math.random() * 40) - 20;
  const percentChange = (priceChange / basePrice) * 100;
  
  const mockData = {
    info: {
      symbol: symbol,
      companyName: getCompanyName(symbol),
      industry: 'Various',
      series: 'EQ'
    },
    priceInfo: {
      lastPrice: basePrice,
      change: priceChange,
      pChange: percentChange,
      open: basePrice - (Math.random() * 10),
      close: basePrice - priceChange,
      previousClose: basePrice - priceChange,
      intraDayHighLow: {
        min: basePrice - (Math.random() * 30),
        max: basePrice + (Math.random() * 30)
      }
    },
    securityInfo: {
      tradedVolume: Math.floor(Math.random() * 1000000)
    }
  };
  
  console.log(`Returning simulated data for stock: ${symbol}`);
  
  return new Response(
    JSON.stringify(mockData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function simulateGainersLosers(gainers: boolean) {
  const mockStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ITC', name: 'ITC Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'WIPRO', name: 'Wipro Ltd.' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' }
  ];
  
  return new Response(
    JSON.stringify(mockStocks.slice(0, 5).map(stock => {
      const price = Math.random() * 2000 + 500;
      const change = gainers ? Math.random() * 50 : -Math.random() * 50;
      const pChange = (change / price) * 100;
      
      return {
        symbol: stock.symbol,
        lastPrice: price,
        change: change,
        pChange: pChange,
        open: price - (Math.random() * 10),
        high: price + (Math.random() * 20),
        low: price - (Math.random() * 20),
        previousClose: price - change,
        tradedQuantity: Math.floor(Math.random() * 1000000)
      };
    })),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function simulateSearchResults(query: string) {
  const mockStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ITC', name: 'ITC Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'WIPRO', name: 'Wipro Ltd.' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' }
  ];
  
  const filteredStocks = !query 
    ? [] 
    : mockStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
  
  return new Response(
    JSON.stringify(filteredStocks.map(stock => ({
      symbol: stock.symbol,
      type: 'EQ',
      name: stock.name
    }))),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
