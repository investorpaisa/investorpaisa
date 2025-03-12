
// Handler for stock search endpoint
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { simulateSearchResults } from "../utils/mockData.ts";

export async function searchStocks(req: Request, query: string = '') {
  if (!query) {
    return new Response(
      JSON.stringify([]),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/search/${encodeURIComponent(query)}?country=India`, {
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
    
    if (!data || !data.instruments || data.instruments.length === 0) {
      return simulateSearchResults(query);
    }
    
    // Format search results
    const results = data.instruments
      .filter((item: any) => item.country === "India" && item.type === "EQUITY")
      .slice(0, 10)
      .map((item: any) => ({
        symbol: item.symbol,
        type: 'EQ',
        name: item.name
      }));
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error searching stocks for "${query}":`, error);
    return simulateSearchResults(query);
  }
}
