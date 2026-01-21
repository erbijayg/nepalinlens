
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import NewsCard from './components/NewsCard';
import AdminPanel from './components/AdminPanel';
import GoogleLoginModal from './components/GoogleLoginModal';
import { NewsArticle, NewsCategory, NewsSource, UserProfile } from './types';
import { fetchNewsByCategory, searchNews } from './services/newsService';

const DEFAULT_SOURCES: NewsSource[] = [
  { id: '1', name: 'Kantipur', domain: 'ekantipur.com', enabled: true },
  { id: '2', name: 'Online Khabar', domain: 'onlinekhabar.com', enabled: true },
  { id: '3', name: 'Setopati', domain: 'setopati.com', enabled: true },
  { id: '4', name: 'Ratopati', domain: 'ratopati.com', enabled: true },
  { id: '5', name: 'MyRepublica', domain: 'myrepublica.nagariknetwork.com', enabled: true },
  { id: '6', name: 'The Kathmandu Post', domain: 'kathmandupost.com', enabled: false },
];

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.LATEST);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Auth & Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nil_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [sources, setSources] = useState<NewsSource[]>(() => {
    const saved = localStorage.getItem('nil_sources');
    return saved ? JSON.parse(saved) : DEFAULT_SOURCES;
  });

  // Handle hidden admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setShowLoginModal(true);
      // Clean up URL for better UX
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const loadNews = useCallback(async (category: NewsCategory) => {
    setLoading(true);
    setIsSearching(false);
    const data = await fetchNewsByCategory(category, sources);
    setArticles(data);
    setLoading(false);
  }, [sources]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setIsSearching(true);
    const data = await searchNews(query, sources);
    setArticles(data);
    setLoading(false);
  };

  const handleToggleSource = (id: string) => {
    const newSources = sources.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setSources(newSources);
    localStorage.setItem('nil_sources', JSON.stringify(newSources));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'nepal123') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      setLoginPassword('');
    } else {
      alert('Incorrect Password');
    }
  };

  const handleUserLogin = (selectedUser: UserProfile) => {
    setUser(selectedUser);
    localStorage.setItem('nil_user', JSON.stringify(selectedUser));
    setShowGoogleLogin(false);
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem('nil_user');
  };

  const trackInterest = (category: string) => {
    if (!user) return;
    const newUser = { ...user };
    newUser.interests = { ...newUser.interests };
    newUser.interests[category] = (newUser.interests[category] || 0) + 1;
    setUser(newUser);
    localStorage.setItem('nil_user', JSON.stringify(newUser));
  };

  const favoriteCategory = useMemo(() => {
    if (!user || Object.keys(user.interests).length === 0) return null;
    return Object.entries(user.interests).sort((a, b) => b[1] - a[1])[0][0];
  }, [user]);

  useEffect(() => {
    loadNews(activeCategory);
  }, [activeCategory, loadNews]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        onSearch={handleSearch} 
        user={user}
        onLoginClick={() => setShowGoogleLogin(true)}
        onLogout={handleUserLogout}
      />
      
      <CategoryBar 
        activeCategory={activeCategory} 
        onSelectCategory={(cat) => setActiveCategory(cat)} 
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {user && favoriteCategory && activeCategory === NewsCategory.LATEST && !isSearching && (
          <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Personalized For You</span>
              <p className="text-sm font-medium text-slate-800">Showing news based on your interest in <span className="text-red-600 font-bold">{favoriteCategory}</span></p>
            </div>
            <button 
              onClick={() => setActiveCategory(favoriteCategory as NewsCategory)}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              See all {favoriteCategory}
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-[400px] md:h-[500px] bg-slate-200 rounded-2xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-12">
            {!isSearching && articles.length > 0 && (
              <section>
                <NewsCard 
                  article={articles[0]} 
                  isHero={true} 
                  onArticleClick={trackInterest}
                />
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  {isSearching ? 'Search Results' : `${activeCategory} Updates`}
                </h2>
                <div className="h-px bg-slate-200 flex-grow ml-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(isSearching ? 0 : 1).map((article) => (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    onArticleClick={trackInterest}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500">Check your source filters or internet connection.</p>
          </div>
        )}
      </main>

      {/* Admin Login Modal (Triggered via /admin) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h2>
            <p className="text-sm text-slate-500 mb-6">Restricted access area.</p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Access Key"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                autoFocus
              />
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Go Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGoogleLogin && (
        <GoogleLoginModal 
          onSelect={handleUserLogin} 
          onClose={() => setShowGoogleLogin(false)} 
        />
      )}

      {showAdminPanel && (
        <AdminPanel 
          sources={sources}
          onToggleSource={handleToggleSource}
          onLogout={() => { setIsAdmin(false); setShowAdminPanel(false); }}
          onClose={() => { setShowAdminPanel(false); loadNews(activeCategory); }}
        />
      )}

      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>&copy; {new Date().getFullYear()} NepaliLens.com. All Rights Reserved.</div>
          <div className="flex gap-6">
            <span>Powered by Gemini AI Search Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
