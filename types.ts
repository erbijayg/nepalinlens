
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

export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  enabled: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  interests: Record<string, number>;
}
