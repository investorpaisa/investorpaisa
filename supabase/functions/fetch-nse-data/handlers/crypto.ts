
import { RAPIDAPI_HOST, RAPIDAPI_KEY, ALPHA_VANTAGE_API_KEY, API_FUNCTIONS } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getCryptoRate(req: Request, params: any) {
  try {
    console.log(`Fetching crypto rate data for params:`, params);
    
    const { from_currency = 'BTC', to_currency = 'USD' } = params;
    
    // Try direct Alpha Vantage API first
    const directUrl = `https://www.alphavantage.co/query?function=${API_FUNCTIONS.CRYPTO.RATE}&from_currency=${from_currency}&to_currency=${to_currency}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Requesting from direct URL: ${directUrl.replace(ALPHA_VANTAGE_API_KEY, '***')}`);
    
    const directResponse = await fetch(directUrl);
    
    if (!directResponse.ok) {
      console.error(`Direct Alpha Vantage API responded with status: ${directResponse.status}`);
      throw new Error(`Direct API responded with status: ${directResponse.status}`);
    }

    const directData = await directResponse.json();
    console.log('Raw direct API response structure:', Object.keys(directData));

    // Check for API rate limiting or other errors
    if (directData.Note || directData.Information || directData.Error) {
      console.log('Direct API returned error, falling back to RapidAPI');
      
      const rapidApiUrl = `https://alpha-vantage.p.rapidapi.com/query?function=${API_FUNCTIONS.CRYPTO.RATE}&from_currency=${from_currency}&to_currency=${to_currency}`;
      
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
      
      // If we still got an error or no data, return fallback
      if (rapidApiData.Note || rapidApiData.Information || rapidApiData.Error || !rapidApiData['Realtime Currency Exchange Rate']) {
        return createFallbackCryptoResponse(from_currency, to_currency);
      }
      
      return formatCryptoResponse(rapidApiData);
    }
    
    // Process direct API response if it's valid
    if (!directData['Realtime Currency Exchange Rate']) {
      console.error('Missing exchange rate data from direct API');
      return createFallbackCryptoResponse(from_currency, to_currency);
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
    
    const { symbol = 'BTC', market = 'USD', function: func = API_FUNCTIONS.CRYPTO.DAILY } = params;
    
    // Try direct Alpha Vantage API first
    const directUrl = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&market=${market}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Requesting from direct URL: ${directUrl.replace(ALPHA_VANTAGE_API_KEY, '***')}`);
    
    const directResponse = await fetch(directUrl);
    
    if (!directResponse.ok) {
      console.error(`Direct Alpha Vantage API responded with status: ${directResponse.status}`);
      throw new Error(`Direct API responded with status: ${directResponse.status}`);
    }

    const directData = await directResponse.json();
    console.log('Raw direct API response structure:', Object.keys(directData));

    // Check for API rate limiting or other errors
    if (directData.Note || directData.Information || directData.Error) {
      console.log('Direct API returned error, falling back to RapidAPI');
      
      const rapidApiUrl = `https://alpha-vantage.p.rapidapi.com/query?function=${func}&symbol=${symbol}&market=${market}`;
      
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
      
      // If we still got an error or no data, return fallback
      if (rapidApiData.Note || rapidApiData.Information || rapidApiData.Error) {
        return createFallbackTimeSeriesResponse(symbol, market);
      }
      
      return formatTimeSeriesResponse(rapidApiData, symbol, market);
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
