
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  source?: string;
  category?: string;
  published_at: string;
  thumbnail_url?: string;
}

export const NewsWidget: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      // Fallback to sample news if no data
      setArticles([
        {
          id: '1',
          title: 'Market Rally Continues Amid Economic Optimism',
          summary: 'Stocks surge as investors show confidence in economic recovery.',
          source: 'Financial Times',
          category: 'Markets',
          published_at: new Date().toISOString(),
          url: '#'
        },
        {
          id: '2',
          title: 'New Investment Opportunities in Green Technology',
          summary: 'Sustainable investing gains momentum with new green bonds.',
          source: 'Reuters',
          category: 'Investment',
          published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          url: '#'
        },
        {
          id: '3',
          title: 'Cryptocurrency Regulations Update',
          summary: 'New guidelines announced for digital asset trading.',
          source: 'Bloomberg',
          category: 'Crypto',
          published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          url: '#'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
            Financial News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
          Financial News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="group">
            <a
              href={article.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {article.thumbnail_url && (
                  <img
                    src={article.thumbnail_url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      {article.source && (
                        <span className="text-xs text-slate-500">{article.source}</span>
                      )}
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(article.published_at)}
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
              </div>
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
