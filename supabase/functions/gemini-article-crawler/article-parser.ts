
// Parse batch response into individual articles with required fields
export const parseBatchArticles = (batchContent: string, category: string) => {
  const articles = [];
  const articleBlocks = batchContent.split('---ARTICLE START---').slice(1);
  
  for (let i = 0; i < articleBlocks.length; i++) {
    const block = articleBlocks[i].split('---ARTICLE END---')[0];
    if (!block.trim()) continue;
    
    const lines = block.split('\n').filter(line => line.trim());
    let title = '', summary = '', imageUrl = '', sourceUrl = '', source = '';
    
    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('SUMMARY:')) {
        summary = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('IMAGE_URL:')) {
        imageUrl = line.replace('IMAGE_URL:', '').trim();
      } else if (line.startsWith('SOURCE_URL:')) {
        sourceUrl = line.replace('SOURCE_URL:', '').trim();
      } else if (line.startsWith('SOURCE:')) {
        source = line.replace('SOURCE:', '').trim();
      }
    }
    
    if (title && summary && source) {
      // Generate our internal article ID
      const articleId = `crawled-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
      
      articles.push({
        id: articleId,
        title: title,
        summary: summary,
        content: summary, // Using summary as content for now
        url: sourceUrl || `https://example.com/article/${articleId}`,
        source: source,
        category: category,
        published_at: new Date().toISOString(),
        thumbnail_url: imageUrl || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80`,
        relevance_score: 80 + Math.floor(Math.random() * 15),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }
  
  return articles;
};
