
// Handler for indices endpoint
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { simulateIndexData } from "../utils/mockData.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/indices/India/${encodeURIComponent(indexName)}`, {
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
    
    // If no data found, return simulated data
    if (!data || !data.indices || data.indices.length === 0) {
      return simulateIndexData(indexName);
    }
    
    const indexData = data.indices[0];
    
    // Format to match our application's expected structure
    const result = {
      name: indexName,
      lastPrice: parseFloat(indexData.last || "0"),
      change: parseFloat(indexData.netChange || "0"),
      pChange: parseFloat(indexData.pChange || "0"),
      open: parseFloat(indexData.open || "0"),
      high: parseFloat(indexData.high || "0"),
      low: parseFloat(indexData.low || "0"),
      previousClose: parseFloat(indexData.previousClose || "0"),
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error fetching index data for ${indexName}:`, error);
    return simulateIndexData(indexName);
  }
}
