
// Utility functions for fallback data
export function createMockStock(symbol: string, price: number, change: number) {
  const percentChange = (change / price) * 100;
  
  return {
    symbol: symbol,
    lastPrice: price,
    change: change,
    pChange: percentChange,
    open: price - (Math.random() * 10),
    high: price + (Math.random() * 20),
    low: price - (Math.random() * 20),
    previousClose: price - change,
    tradedQuantity: Math.floor(Math.random() * 1000000)
  };
}

export function getCompanyName(symbol: string) {
  const companies: Record<string, string> = {
    'RELIANCE': 'Reliance Industries Ltd.',
    'TCS': 'Tata Consultancy Services Ltd.',
    'HDFCBANK': 'HDFC Bank Ltd.',
    'INFY': 'Infosys Ltd.',
    'ITC': 'ITC Ltd.',
    'ICICIBANK': 'ICICI Bank Ltd.',
    'WIPRO': 'Wipro Ltd.',
    'TATASTEEL': 'Tata Steel Ltd.',
    'AXISBANK': 'Axis Bank Ltd.',
    'SBIN': 'State Bank of India'
  };
  
  return companies[symbol] || `${symbol} Ltd.`;
}
