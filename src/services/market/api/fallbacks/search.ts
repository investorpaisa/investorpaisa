
// Fallback data for search results
export function mockSearchResults(query: string = '') {
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
  
  if (!query) return [];
  
  const filteredStocks = mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredStocks.map(stock => ({
    symbol: stock.symbol,
    type: 'EQ',
    name: stock.name
  }));
}
