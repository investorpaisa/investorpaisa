import { RAPIDAPI_HOST, RAPIDAPI_KEY, ALPHA_VANTAGE_API_KEY, API_FUNCTIONS } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getCryptoRate(req: Request, params: any) {
  try {
    console.log(`Fetching crypto rate data for params:`, params);
    
    const { from_currency = 'BTC', to_currency = 'USD' } = params;
    
    // Try direct Alpha Vantage API first with detailed error logging
    const directUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency}&to_currency=${to_currency}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Requesting from Alpha Vantage API (masked key): ${directUrl.replace(ALPHA_VANTAGE_API_KEY, '***')}`);
    
    const directResponse = await fetch(directUrl);
    
    if (!directResponse.ok) {
      console.error(`Alpha Vantage API responded with status: ${directResponse.status}`);
      throw new Error(`Alpha Vantage API responded with status: ${directResponse.status}`);
    }

    const directData = await directResponse.json();
    console.log('Raw Alpha Vantage response:', JSON.stringify(directData));

    // Check for API rate limiting or other errors
    if (directData.Note || directData.Information || !directData['Realtime Currency Exchange Rate']) {
      console.log('Alpha Vantage API returned error or no data, falling back to RapidAPI');
      
      const rapidApiUrl = `https://alpha-vantage.p.rapidapi.com/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency}&to_currency=${to_currency}`;
      console.log('Attempting RapidAPI fallback');
      
      const rapidApiResponse = await fetch(rapidApiUrl, {
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      });

      if (!rapidApiResponse.ok) {
        console.error(`RapidAPI responded with status: ${rapidApiResponse.status}`);
        throw new Error(`RapidAPI responded with status: ${rapidApiResponse.status}`);
      }

      const rapidApiData = await rapidApiResponse.json();
      console.log('RapidAPI response:', JSON.stringify(rapidApiData));
      
      if (!rapidApiData['Realtime Currency Exchange Rate']) {
        console.log('No valid data from either API, using fallback');
        return createFallbackCryptoResponse(from_currency, to_currency);
      }
      
      return formatCryptoResponse(rapidApiData);
    }
    
    return formatCryptoResponse(directData);
    
  } catch (error) {
    console.error(`Error in getCryptoRate:`, error);
    return createFallbackCryptoResponse(params.from_currency || 'BTC', params.to_currency || 'USD');
  }
}

export async function getCryptoTimeSeries(req: Request, params: any) {
  try {
    console.log(`Fetching crypto time series data for params:`, params);
    
    const { symbol = 'BTC', market = 'USD', function: func = 'DIGITAL_CURRENCY_DAILY' } = params;
    
    // Try direct Alpha Vantage API first with detailed error logging
    const directUrl = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&market=${market}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Requesting time series from Alpha Vantage API (masked key): ${directUrl.replace(ALPHA_VANTAGE_API_KEY, '***')}`);
    
    const directResponse = await fetch(directUrl);
    
    if (!directResponse.ok) {
      console.error(`Alpha Vantage API responded with status: ${directResponse.status}`);
      throw new Error(`Alpha Vantage API responded with status: ${directResponse.status}`);
    }

    const directData = await directResponse.json();
    console.log('Raw time series response:', JSON.stringify(directData));

    if (Object.keys(directData).length === 0 || directData.Note || directData.Information) {
      console.log('No valid time series data from Alpha Vantage, falling back to CoinGecko');
      
      // Fallback to CoinGecko for time series data
      const geckoUrl = `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=7&interval=daily`;
      console.log('Attempting CoinGecko fallback for time series');
      
      const geckoResponse = await fetch(geckoUrl);
      
      if (!geckoResponse.ok) {
        throw new Error('Failed to fetch time series from CoinGecko');
      }
      
      const geckoData = await geckoResponse.json();
      console.log('CoinGecko time series response:', JSON.stringify(geckoData));
      
      if (!geckoData.prices || !Array.isArray(geckoData.prices)) {
        return createFallbackTimeSeriesResponse(symbol, market);
      }
      
      return new Response(
        JSON.stringify({
          symbol,
          market,
          prices: geckoData.prices.map(([timestamp, price]) => ({
            timestamp: new Date(timestamp).toISOString(),
            price
          })),
          metadata: {
            information: "Data from CoinGecko API",
            symbol,
            refreshed: new Date().toISOString()
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return formatTimeSeriesResponse(directData, symbol, market);
    
  } catch (error) {
    console.error(`Error in getCryptoTimeSeries:`, error);
    return createFallbackTimeSeriesResponse(params.symbol || 'BTC', params.market || 'USD');
  }
}

// Helper function to format crypto exchange rate response
function formatCryptoResponse(data: any) {
  try {
    const exchangeData = data['Realtime Currency Exchange Rate'];
    
    if (!exchangeData) {
      throw new Error('Missing exchange rate data');
    }
    
    const result = {
      fromCurrency: exchangeData['1. From_Currency Code'],
      toCurrency: exchangeData['3. To_Currency Code'],
      exchangeRate: parseFloat(exchangeData['5. Exchange Rate']),
      lastRefreshed: exchangeData['6. Last Refreshed'],
      timeZone: exchangeData['7. Time Zone'],
      bidPrice: parseFloat(exchangeData['8. Bid Price'] || '0'),
      askPrice: parseFloat(exchangeData['9. Ask Price'] || '0')
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error formatting crypto response:', error);
    return createFallbackCryptoResponse();
  }
}

// Helper function to format time series response
function formatTimeSeriesResponse(data: any, symbol: string, market: string) {
  try {
    let timeSeriesKey = '';
    // Find the time series key in the response
    for (const key in data) {
      if (key.includes('Time Series') || key.includes('Digital Currency')) {
        timeSeriesKey = key;
        break;
      }
    }
    
    if (!timeSeriesKey || !data[timeSeriesKey]) {
      throw new Error('Missing time series data');
    }
    
    const timeSeries = data[timeSeriesKey];
    const timestamps = Object.keys(timeSeries).sort();
    
    const prices = timestamps.map((timestamp) => {
      // Different APIs might have different key structures
      const entry = timeSeries[timestamp];
      const closePrice = entry['4a. close (USD)'] || entry['4. close'] || entry['4b. close (USD)'] || '0';
      
      return {
        timestamp,
        price: parseFloat(closePrice)
      };
    });
    
    const result = {
      symbol,
      market,
      prices,
      metadata: data['Meta Data'] || {}
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error formatting time series response:', error);
    return createFallbackTimeSeriesResponse(symbol, market);
  }
}

// Helper function to generate fallback crypto exchange rate data
function createFallbackCryptoResponse(fromCurrency = 'BTC', toCurrency = 'USD') {
  const baseRate = fromCurrency === 'BTC' ? 67000 : 
                  fromCurrency === 'ETH' ? 3500 : 
                  fromCurrency === 'USDT' ? 1 : 
                  fromCurrency === 'BNB' ? 600 : 
                  Math.random() * 1000;
  
  // Add small random variation
  const exchangeRate = baseRate * (1 + (Math.random() * 0.02 - 0.01));
  
  const fallbackData = {
    fromCurrency,
    toCurrency,
    exchangeRate,
    lastRefreshed: new Date().toISOString(),
    timeZone: 'UTC',
    bidPrice: exchangeRate * 0.995,
    askPrice: exchangeRate * 1.005,
    isFallback: true
  };
  
  console.log('Returning fallback crypto exchange rate data:', fallbackData);
  
  return new Response(
    JSON.stringify(fallbackData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Helper function to generate fallback time series data
function createFallbackTimeSeriesResponse(symbol = 'BTC', market = 'USD') {
  const basePrice = symbol === 'BTC' ? 67000 : 
                   symbol === 'ETH' ? 3500 : 
                   symbol === 'USDT' ? 1 : 
                   symbol === 'BNB' ? 600 : 
                   Math.random() * 1000;
  
  const prices = [];
  const now = new Date();
  
  // Generate 30 days of data
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random price with a trend
    const randomFactor = 1 + ((Math.random() * 0.1) - 0.05);
    // Slightly decreasing trend for older dates
    const trendFactor = 1 - (i * 0.001);
    
    prices.push({
      timestamp: date.toISOString().split('T')[0],
      price: basePrice * randomFactor * trendFactor
    });
  }
  
  const fallbackData = {
    symbol,
    market,
    prices,
    metadata: {
      information: "Fallback data generated due to API limitations",
      symbol,
      refreshed: now.toISOString()
    },
    isFallback: true
  };
  
  console.log('Returning fallback time series data');
  
  return new Response(
    JSON.stringify(fallbackData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
