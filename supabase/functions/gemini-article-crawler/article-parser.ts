
// Parse batch response into individual articles
export const parseBatchArticles = (batchContent: string, category: string) => {
  const articles = [];
  const articleBlocks = batchContent.split('---ARTICLE START---').slice(1);
  
  for (let i = 0; i < articleBlocks.length; i++) {
    const block = articleBlocks[i].split('---ARTICLE END---')[0];
    if (!block.trim()) continue;
    
    const lines = block.split('\n').filter(line => line.trim());
    let title = '', summary = '', content = '', source = '';
    let currentSection = '';
    
    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
        currentSection = 'title';
      } else if (line.startsWith('SUMMARY:')) {
        summary = line.replace('SUMMARY:', '').trim();
        currentSection = 'summary';
      } else if (line.startsWith('CONTENT:')) {
        content = line.replace('CONTENT:', '').trim();
        currentSection = 'content';
      } else if (line.startsWith('SOURCE:')) {
        source = line.replace('SOURCE:', '').trim();
        currentSection = 'source';
      } else if (line.trim() && currentSection) {
        if (currentSection === 'summary' && summary) {
          summary += ' ' + line.trim();
        } else if (currentSection === 'content' && content) {
          content += ' ' + line.trim();
        }
      }
    }
    
    if (title && summary && source) {
      articles.push({
        id: `gemini-batch-${Date.now()}-${i}`,
        title: title,
        summary: summary,
        content: content || summary,
        url: `https://example.com/article/${Date.now()}-${i}`,
        source: source,
        category: category,
        published_at: new Date().toISOString(),
        thumbnail_url: `https://placehold.co/600x400?text=${encodeURIComponent(category)}+News`,
        relevance_score: 80 + Math.floor(Math.random() * 15)
      });
    }
  }
  
  return articles;
};
