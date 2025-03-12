
import { API_FUNCTIONS } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { makeRapidApiRequest } from "../utils/apiRequest.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    console.log(`Fetching index data for ${indexName}`);
    
    // Format symbol for API request (e.g., ^NSEI for Nifty 50)
    const symbol = indexName === 'NIFTY 50' ? '^NSEI' : 
                  indexName === 'NIFTY BANK' ? '^NSEBANK' : 
                  indexName === 'NIFTY IT' ? '^CNXIT' : indexName;
    
    console.log(`Using RapidAPI to fetch data for symbol: ${symbol}`);
    
    const rapidApiUrl = `https://alpha-vantage.p.rapidapi.com/query?function=${API_FUNCTIONS.STOCK.QUOTE}&symbol=${symbol}`;
    console.log(`Requesting from RapidAPI URL: ${rapidApiUrl}`);
    
    // Use our rate-limit-aware API request function with a fallback
    const rapidApiData = await makeRapidApiRequest(
      rapidApiUrl, 
      () => ({ fallback: true })
    );
    
    // If we got fallback indicator, return the fallback response
    if (rapidApiData.fallback) {
      return createFallbackResponse(indexName);
    }
    
    console.log('Raw RapidAPI response structure:', Object.keys(rapidApiData));
    
    // Check for error messages in RapidAPI response
    if (rapidApiData.Note || rapidApiData.Information || rapidApiData.Error) {
      console.error('API error:', rapidApiData.Note || rapidApiData.Information || rapidApiData.Error);
      console.error('Complete error response:', JSON.stringify(rapidApiData));
      return createFallbackResponse(indexName);
    }

    // Check if we got valid data from RapidAPI
    if (!rapidApiData['Global Quote'] || Object.keys(rapidApiData['Global Quote']).length === 0) {
      console.error('Empty quote data received from RapidAPI');
      return createFallbackResponse(indexName);
    }
    
    return formatResponse(rapidApiData['Global Quote'], indexName);
  } catch (error) {
    console.error(`Error in getIndices for ${indexName}:`, error);
    return createFallbackResponse(indexName);
  }
}

// Helper function to format the API response
function formatResponse(quote: any, indexName: string) {
  // Validate required fields
  if (!quote['05. price']) {
    console.error('Missing price data in quote:', JSON.stringify(quote));
    return createFallbackResponse(indexName);
  }
  
  // Format response to match our application's structure
  const result = {
    name: indexName,
    lastPrice: parseFloat(quote['05. price']) || 0,
    change: parseFloat(quote['09. change']) || 0,
    pChange: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
    open: parseFloat(quote['02. open']) || 0,
    high: parseFloat(quote['03. high']) || 0,
    low: parseFloat(quote['04. low']) || 0,
    previousClose: parseFloat(quote['08. previous close']) || 0,
    timestamp: new Date().toISOString()
  };

  console.log('Formatted result:', result);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Helper function to generate fallback data
function createFallbackResponse(indexName: string) {
  console.log(`Generating fallback data for ${indexName}`);
  
  // Base values for different indices
  const baseValue = 
    indexName === 'NIFTY 50' ? 22500 : 
    indexName === 'NIFTY BANK' ? 48000 : 
    indexName === 'NIFTY IT' ? 33500 : 
    indexName === 'NIFTY PHARMA' ? 17800 : 
    Math.random() * 20000 + 15000;
  
  const change = (Math.random() * 400) - 200;
  const percentChange = (change / baseValue) * 100;
  
  const fallbackData = {
    name: indexName,
    lastPrice: baseValue,
    change: change,
    pChange: percentChange,
    open: baseValue - (Math.random() * 100),
    high: baseValue + (Math.random() * 200),
    low: baseValue - (Math.random() * 200),
    previousClose: baseValue - change,
    timestamp: new Date().toISOString(),
    isFallback: true // Indicate this is fallback data
  };
  
  console.log('Returning fallback data:', fallbackData);
  
  return new Response(
    JSON.stringify(fallbackData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
