
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

export const generateBatchArticles = async (topic: string, category: string, count: number) => {
  const prompt = `You are a web crawler that generates realistic financial news articles about "${topic}". 

For each article, provide EXACTLY this format (no additional text):
---ARTICLE START---
TITLE: [Compelling, realistic news headline]
SUMMARY: [2-3 sentence summary of the article]
IMAGE_URL: [Generate a realistic financial news image URL using unsplash or similar service]
SOURCE_URL: [Generate a realistic source URL like https://reuters.com/article/... or https://bloomberg.com/news/...]
SOURCE: [Realistic financial news source like Reuters, Bloomberg, Financial Times, CNBC, etc.]
---ARTICLE END---

Generate ${count} distinct articles. Each article must:
- Have a unique, timely headline about ${topic}
- Include current market insights and trends
- Use different reputable financial news sources
- Have realistic URLs that look like actual news articles
- Include relevant financial data and expert opinions

Make sure each article is completely different and covers various aspects of ${topic}.`;

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
