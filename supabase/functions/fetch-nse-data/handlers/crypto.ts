
import { RAPIDAPI_HOST, RAPIDAPI_KEY, API_FUNCTIONS } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getCryptoRate(req: Request, params: { from_currency: string; to_currency: string }) {
  try {
    const { from_currency = 'BTC', to_currency = 'USD' } = params;
    
    console.log(`Fetching crypto rate for ${from_currency} to ${to_currency}`);
    
    const url = `https://${RAPIDAPI_HOST}/query?function=${API_FUNCTIONS.CRYPTO.RATE}&from_currency=${from_currency}&to_currency=${to_currency}`;
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Crypto rate response received');
    
    if (!data || !data['Realtime Currency Exchange Rate']) {
      console.error('Invalid crypto data format received');
      throw new Error('Invalid crypto data format received');
    }
    
    const rateData = data['Realtime Currency Exchange Rate'];
    
    // Format the response
    const result = {
      fromCurrency: rateData['1. From_Currency Code'] || from_currency,
      fromCurrencyName: rateData['2. From_Currency Name'] || from_currency,
      toCurrency: rateData['3. To_Currency Code'] || to_currency,
      toCurrencyName: rateData['4. To_Currency Name'] || to_currency,
      exchangeRate: parseFloat(rateData['5. Exchange Rate']) || 0,
      lastRefreshed: rateData['6. Last Refreshed'] || new Date().toISOString(),
      timeZone: rateData['7. Time Zone'] || 'UTC',
      bidPrice: parseFloat(rateData['8. Bid Price'] || '0'),
      askPrice: parseFloat(rateData['9. Ask Price'] || '0'),
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error fetching crypto rate:`, error);
    return new Response(
      JSON.stringify({
        error: `Failed to fetch crypto rate: ${error.message}`,
        mockData: {
          fromCurrency: params.from_currency || 'BTC',
          fromCurrencyName: 'Bitcoin',
          toCurrency: params.to_currency || 'USD',
          toCurrencyName: 'United States Dollar',
          exchangeRate: 45000, // Mock exchange rate for BTC to USD
          lastRefreshed: new Date().toISOString(),
          timeZone: 'UTC',
          bidPrice: 44990,
          askPrice: 45010,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}

export async function getCryptoTimeSeries(req: Request, params: { 
  symbol: string; 
  market: string;
  period?: string;
}) {
  try {
    const { 
      symbol = 'BTC', 
      market = 'USD',
      period = 'daily'
    } = params;
    
    console.log(`Fetching crypto time series for ${symbol} in ${market}, period: ${period}`);
    
    // Determine which API function to use based on period
    let function_name;
    switch (period.toLowerCase()) {
      case 'weekly':
        function_name = API_FUNCTIONS.CRYPTO.WEEKLY;
        break;
      case 'monthly':
        function_name = API_FUNCTIONS.CRYPTO.MONTHLY;
        break;
      case 'daily':
      default:
        function_name = API_FUNCTIONS.CRYPTO.DAILY;
    }
    
    const url = `https://${RAPIDAPI_HOST}/query?function=${function_name}&symbol=${symbol}&market=${market}`;
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Crypto time series response received');
    
    // Extract metadata and time series data
    const metaDataKey = Object.keys(data).find(key => key.includes('Meta Data'));
    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
    
    if (!metaDataKey || !timeSeriesKey || !data[metaDataKey] || !data[timeSeriesKey]) {
      console.error('Invalid crypto time series data format received');
      throw new Error('Invalid crypto time series data format received');
    }
    
    const metaData = data[metaDataKey];
    const timeSeries = data[timeSeriesKey];
    
    // Convert time series data to array format
    const seriesData = Object.entries(timeSeries).map(([date, values]) => {
      const entry = values as Record<string, string>;
      return {
        date,
        open: parseFloat(entry[`1a. open (${market})`] || '0'),
        high: parseFloat(entry[`2a. high (${market})`] || '0'),
        low: parseFloat(entry[`3a. low (${market})`] || '0'),
        close: parseFloat(entry[`4a. close (${market})`] || '0'),
        volume: parseFloat(entry['5. volume'] || '0'),
        marketCap: parseFloat(entry[`6. market cap (${market})`] || '0')
      };
    });
    
    // Format the response
    const result = {
      metadata: {
        information: metaData['1. Information'] || 'Crypto Time Series',
        digitalCurrencyCode: metaData['2. Digital Currency Code'] || symbol,
        digitalCurrencyName: metaData['3. Digital Currency Name'] || symbol,
        marketCode: metaData['4. Market Code'] || market,
        marketName: metaData['5. Market Name'] || market,
        lastRefreshed: metaData['6. Last Refreshed'] || new Date().toISOString(),
        timeZone: metaData['7. Time Zone'] || 'UTC'
      },
      timeSeries: seriesData,
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error fetching crypto time series:`, error);
    return new Response(
      JSON.stringify({ 
        error: `Failed to fetch crypto time series: ${error.message}`,
        mockData: {
          metadata: {
            information: 'Mock Crypto Time Series',
            digitalCurrencyCode: params.symbol || 'BTC',
            digitalCurrencyName: 'Bitcoin',
            marketCode: params.market || 'USD',
            marketName: 'United States Dollar',
            lastRefreshed: new Date().toISOString(),
            timeZone: 'UTC'
          },
          timeSeries: Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const basePrice = 45000 - (i * 100) + (Math.random() * 1000 - 500);
            return {
              date: date.toISOString().split('T')[0],
              open: basePrice - 200,
              high: basePrice + 400,
              low: basePrice - 400,
              close: basePrice,
              volume: 1000 + Math.random() * 5000,
              marketCap: 800000000000 + Math.random() * 50000000000
            };
          }),
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
