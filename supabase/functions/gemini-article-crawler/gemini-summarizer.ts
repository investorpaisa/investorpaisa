
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

export const summarizeContent = async (title: string, content: string, source: string) => {
  const prompt = `You are a professional financial news summarizer. Please create a concise 2-3 sentence summary of this article that captures the key financial insights and market implications.

Article Title: ${title}
Source: ${source}
Content: ${content}

Please provide only the summary without any additional text or formatting.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 500
        }
      }),
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return content.substring(0, 300) + '...'; // Fallback to truncated content
    }

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text.trim();
    
    return summary || content.substring(0, 300) + '...';
  } catch (error) {
    console.error('Error calling Gemini API for summarization:', error);
    return content.substring(0, 300) + '...'; // Fallback to truncated content
  }
};
