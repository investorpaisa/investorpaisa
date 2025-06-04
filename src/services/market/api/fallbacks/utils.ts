
// Utility functions for generating fallback data
export function getFallbackData(endpoint: string, params: Record<string, string> = {}) {
  switch (endpoint) {
    case 'stocks':
      return generateFallbackStockData(params.symbol || 'AAPL');
    case 'indices':
      return generateFallbackIndexData(params.index || 'NIFTY 50');
    case 'search':
      return generateFallbackSearchData(params.query || '');
    case 'gainers':
      return generateFallbackGainersData();
    case 'losers':
      return generateFallbackLosersData();
    case 'marketStatus':
      return generateFallbackMarketStatus();
    default:
      return null;
  }
}

function generateFallbackStockData(symbol: string) {
  const basePrice = 100 + Math.random() * 400;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / basePrice) * 100;
  
  return {
    info: {
      symbol: symbol,
      companyName: `${symbol} Corporation`,
      industry: 'Technology',
      series: 'EQ'
    },
    priceInfo: {
      lastPrice: basePrice,
      change: change,
      pChange: changePercent,
      open: basePrice - 2,
      close: basePrice,
      previousClose: basePrice - change,
      intraDayHighLow: {
        min: basePrice - 5,
        max: basePrice + 5
      }
    },
    securityInfo: {
      tradedVolume: Math.floor(Math.random() * 1000000)
    }
  };
}

function generateFallbackIndexData(indexName: string) {
  const basePrice = 15000 + Math.random() * 5000;
  const change = (Math.random() - 0.5) * 200;
  const changePercent = (change / basePrice) * 100;
  
  return {
    name: indexName,
    lastPrice: basePrice,
    change: change,
    pChange: changePercent,
    open: basePrice - 20,
    high: basePrice + 50,
    low: basePrice - 30,
    previousClose: basePrice - change,
    timestamp: new Date().toISOString()
  };
}

function generateFallbackSearchData(query: string) {
  if (!query) return [];
  
  return [
    { symbol: `${query.toUpperCase()}`, name: `${query} Corporation`, type: 'stock' },
    { symbol: `${query.toUpperCase()}2`, name: `${query} Industries`, type: 'stock' }
  ];
}

function generateFallbackGainersData() {
  return Array.from({ length: 5 }, (_, i) => ({
    symbol: `GAINER${i + 1}`,
    lastPrice: 100 + Math.random() * 200,
    change: 5 + Math.random() * 10,
    pChange: 5 + Math.random() * 5,
    open: 95 + Math.random() * 190,
    high: 105 + Math.random() * 210,
    low: 90 + Math.random() * 180,
    previousClose: 95 + Math.random() * 190,
    tradedQuantity: Math.floor(Math.random() * 100000)
  }));
}

function generateFallbackLosersData() {
  return Array.from({ length: 5 }, (_, i) => ({
    symbol: `LOSER${i + 1}`,
    lastPrice: 100 + Math.random() * 200,
    change: -(5 + Math.random() * 10),
    pChange: -(5 + Math.random() * 5),
    open: 105 + Math.random() * 210,
    high: 110 + Math.random() * 220,
    low: 95 + Math.random() * 190,
    previousClose: 105 + Math.random() * 210,
    tradedQuantity: Math.floor(Math.random() * 100000)
  }));
}

function generateFallbackMarketStatus() {
  return {
    marketState: 'open',
    marketStatus: 'Market is open for trading',
    timestamp: new Date().toISOString()
  };
}
