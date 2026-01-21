
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  user: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, user, onLoginClick, onLogout }) => {
  const [query, setQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-3">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-200">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-900 tracking-tight leading-none">
              Nepal <span className="text-red-600">In Lens</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">News Aggregator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="hidden md:flex flex-grow max-w-md relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news about Nepal..."
            className="w-full bg-slate-100 border-none rounded-full py-2.5 px-6 pl-12 text-sm focus:ring-2 focus:ring-red-500 transition-all outline-none"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        <div className="flex items-center gap-4">
          {!user ? (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-slate-200 hover:shadow-md transition-all bg-white"
              >
                <div className="text-xs font-bold text-slate-700 hidden sm:block">{user.name.split(' ')[0]}</div>
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">My Interests</button>
                  <button className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Saved Articles</button>
                  <button 
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-slate-50 mt-1"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="text-right hidden lg:block border-l border-slate-200 pl-4 ml-2">
            <div className="text-xs font-semibold text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div className="text-[10px] text-slate-400">Kathmandu, Nepal</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
