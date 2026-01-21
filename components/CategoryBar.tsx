
import React from 'react';
import { NewsCategory } from '../types';

interface CategoryBarProps {
  activeCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelectCategory }) => {
  const categories = Object.values(NewsCategory);

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-40 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex space-x-8 py-4 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`text-sm font-medium transition-colors relative pb-1 ${
                activeCategory === category 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
