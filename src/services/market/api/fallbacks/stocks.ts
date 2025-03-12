
// Fallback data for stock quotes
import { getCompanyName } from './utils';

export function mockStockQuote(symbol: string = 'RELIANCE') {
  const basePrice = symbol === 'RELIANCE' ? 2540.75 : 
                  symbol === 'TCS' ? 3456.80 : 
                  symbol === 'HDFCBANK' ? 1678.25 : 
                  symbol === 'INFY' ? 1540.65 : 
                  Math.random() * 2000 + 500;
  
  const priceChange = (Math.random() * 40) - 20;
  const percentChange = (priceChange / basePrice) * 100;
  
  return {
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
}
