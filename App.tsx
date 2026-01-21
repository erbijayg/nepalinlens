
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import NewsCard from './components/NewsCard';
import { NewsArticle, NewsCategory } from './types';
import { fetchNewsByCategory, searchNews } from './services/newsService';

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.LATEST);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const loadNews = useCallback(async (category: NewsCategory) => {
    setLoading(true);
    setIsSearching(false);
    const data = await fetchNewsByCategory(category);
    setArticles(data);
    setLoading(false);
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setIsSearching(true);
    const data = await searchNews(query);
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      <CategoryBar 
        activeCategory={activeCategory} 
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
        }} 
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-[400px] md:h-[500px] bg-slate-200 rounded-2xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-12">
            {!isSearching && articles.length > 0 && (
              <section>
                <NewsCard article={articles[0]} isHero={true} />
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  {isSearching ? 'Search Results' : `More in ${activeCategory}`}
                </h2>
                <div className="h-px bg-slate-200 flex-grow ml-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(isSearching ? 0 : 1).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              We couldn't find any recent news matching this category or search query. Try another one.
            </p>
            <button 
              onClick={() => setActiveCategory(NewsCategory.LATEST)}
              className="mt-6 text-red-600 font-bold hover:underline"
            >
              Back to Home
            </button>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                 </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                Nepal <span className="text-red-500">In Lens</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed">
              Nepal In Lens is a premier news aggregator delivering live stories from Nepal's most trusted sources. Powered by Gemini AI.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Portals Included</h4>
            <ul className="grid grid-cols-2 gap-y-3 text-sm">
              <li>Kantipur News</li>
              <li>Online Khabar</li>
              <li>Setopati</li>
              <li>Ratopati</li>
              <li>MyRepublica</li>
              <li>The Kathmandu Post</li>
              <li>Annapurna Post</li>
              <li>Nagarik News</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Stay Connected</h4>
            <div className="flex gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors">
                  <div className="w-4 h-4 bg-slate-600 rounded-sm" />
                </div>
              ))}
            </div>
            <p className="text-xs italic">
              All articles belong to their respective owners. We only aggregate and link to original sources.
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>&copy; {new Date().getFullYear()} NepaliLens.com. Built with Gemini AI.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
