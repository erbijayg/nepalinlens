
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  url: string;
  publishedAt: string;
  category: NewsCategory;
  thumbnail?: string;
}

export enum NewsCategory {
  LATEST = 'Latest',
  POLITICS = 'Politics',
  ECONOMY = 'Economy',
  SPORTS = 'Sports',
  ENTERTAINMENT = 'Entertainment',
  TECHNOLOGY = 'Technology',
  WORLD = 'World'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
