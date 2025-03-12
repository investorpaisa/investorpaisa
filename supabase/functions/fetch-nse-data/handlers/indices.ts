
import { RAPIDAPI_HOST, RAPIDAPI_KEY, ALPHA_VANTAGE_API_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    console.log(`Fetching index data for ${indexName}`);
    
    // Format symbol for API request (e.g., ^NSEI for Nifty 50)
    const symbol = indexName === 'NIFTY 50' ? '^NSEI' : 
                  indexName === 'NIFTY BANK' ? '^NSEBANK' : 
                  indexName === 'NIFTY IT' ? '^CNXIT' : indexName;
    
    // Check API key
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error('ALPHA_VANTAGE_API_KEY is not configured');
      throw new Error('ALPHA_VANTAGE_API_KEY is not configured');
    }
    
    // Direct Alpha Vantage API call
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Requesting from URL: ${url}`);
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Alpha Vantage response:', JSON.stringify(data));

    // Check for rate limiting or error messages
    if (data.Note) {
      console.error('API rate limit reached:', data.Note);
      throw new Error(`Alpha Vantage API rate limit: ${data.Note}`);
    }
    
    if (data.Information) {
      console.error('API information message:', data.Information);
      throw new Error(`Alpha Vantage API information: ${data.Information}`);
    }

    if (data.Error) {
      console.error('API error message:', data.Error);
      throw new Error(`Alpha Vantage API error: ${data.Error}`);
    }

    // Basic validation of the response structure
    if (!data || !data['Global Quote']) {
      console.error('Invalid data format received, full response:', JSON.stringify(data));
      throw new Error('Invalid data format received from API');
    }
    
    const quote = data['Global Quote'];
    
    // Check if the quote object contains the expected fields
    if (!quote['05. price']) {
      console.error('Missing price data in response:', JSON.stringify(quote));
      throw new Error('Missing price data in API response');
    }
    
    // Format response to match our application's structure
    const result = {
      name: indexName,
      lastPrice: parseFloat(quote['05. price']) || 0,
      change: parseFloat(quote['09. change']) || 0,
      pChange: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
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
  } catch (error) {
    console.error(`Error in getIndices for ${indexName}:`, error);
    return new Response(
      JSON.stringify({ error: `Failed to fetch index data: ${error.message}` }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
