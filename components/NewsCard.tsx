
import React from 'react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  isHero?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, isHero = false }) => {
  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  if (isHero) {
    return (
      <div 
        onClick={handleClick}
        className="group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-900 h-[400px] md:h-[500px] shadow-xl transition-transform hover:scale-[1.01]"
      >
        <img 
          src={article.thumbnail} 
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 p-6 md:p-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-slate-300 text-sm">{article.source}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-bold leading-tight mb-4 group-hover:text-red-400 transition-colors">
            {article.title}
          </h2>
          <p className="text-slate-300 text-lg line-clamp-2 max-w-2xl">
            {article.excerpt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer flex flex-col transition-all hover:shadow-md hover:border-red-200 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.thumbnail} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex-grow">
        <div className="text-xs text-red-600 font-semibold mb-2 uppercase tracking-tight">
          {article.source}
        </div>
        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-red-700 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-3">
          {article.excerpt}
        </p>
      </div>
      <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400">{article.publishedAt}</span>
        <button className="text-xs font-bold text-slate-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Read More
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
