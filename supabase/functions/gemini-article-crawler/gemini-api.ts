
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

// Generate multiple articles in one API call to reduce costs
export const generateBatchArticles = async (topic: string, category: string, count: number) => {
  const prompt = `Generate ${count} distinct and realistic financial news articles about "${topic}". 

For each article, provide the following format:
---ARTICLE START---
TITLE: [Compelling news headline]
SUMMARY: [2-3 sentence summary]
CONTENT: [3-4 paragraph detailed article with current insights]
SOURCE: [Realistic financial news source like Reuters, Bloomberg, Financial Times, etc.]
---ARTICLE END---

Make each article unique and focused on different aspects of ${topic}. Include current market trends, expert opinions, and relevant data points. Ensure professional journalistic tone.`;

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
          temperature: 0.8,
          topP: 0.9,
          maxOutputTokens: 4000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
