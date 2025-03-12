
// Fallback data for market indices
export function mockIndexData(indexName: string = 'NIFTY 50') {
  const baseValue = indexName === 'NIFTY 50' ? 22500 : 
                  indexName === 'NIFTY BANK' ? 48000 : 
                  indexName === 'NIFTY IT' ? 33500 : 
                  indexName === 'NIFTY PHARMA' ? 17800 : 
                  Math.random() * 20000 + 15000;
  
  const change = (Math.random() * 400) - 200;
  const percentChange = (change / baseValue) * 100;
  
  return {
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
}
