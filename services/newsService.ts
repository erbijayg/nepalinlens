
import { GoogleGenAI } from "@google/genai";
import { NewsArticle, NewsCategory, NewsSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function fetchNewsByCategory(category: NewsCategory, sources: NewsSource[]): Promise<NewsArticle[]> {
  try {
    const enabledSources = sources.filter(s => s.enabled).map(s => s.name).join(", ");
    const prompt = `Find the 6 most recent specific news ARTICLES from Nepal in the category: ${category}. 
    STRICTLY prioritize these sources: ${enabledSources}.
    
    For each result, I need the DIRECT DEEP LINK to the specific news article, NOT the homepage of the website.
    Provide the information clearly. I will extract the exact article URLs from the grounding metadata.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const articles: NewsArticle[] = [];

    groundingChunks.forEach((chunk, index) => {
      if (chunk.web && index < 10) { 
        const url = chunk.web.uri;
        // Basic check to avoid homepage links if possible
        const isLikelyArticle = url.split('/').length > 4 || url.includes('.html') || url.includes('?');
        
        if (isLikelyArticle) {
          const title = chunk.web.title || `News Story`;
          articles.push({
            id: Math.random().toString(36).substr(2, 9),
            title: title.split(' - ')[0].split(' | ')[0], // Clean title
            excerpt: "Read the full specific report on the original portal by clicking below.",
            source: new URL(url).hostname.replace('www.', ''),
            url: url,
            publishedAt: new Date().toLocaleDateString(),
            category: category,
            thumbnail: `https://picsum.photos/seed/${encodeURIComponent(url)}/800/450`
          });
        }
      }
    });

    return articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function searchNews(query: string, sources: NewsSource[]): Promise<NewsArticle[]> {
  try {
    const enabledSources = sources.filter(s => s.enabled).map(s => s.name).join(", ");
    const prompt = `Search for specific recent news articles related to "${query}" from these Nepali portals: ${enabledSources}. 
    I need the direct article URLs.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const articles: NewsArticle[] = [];

    groundingChunks.forEach((chunk, index) => {
      if (chunk.web) {
        articles.push({
          id: Math.random().toString(36).substr(2, 9),
          title: chunk.web.title || query,
          excerpt: "Search result with direct link to the full story.",
          source: new URL(chunk.web.uri).hostname.replace('www.', ''),
          url: chunk.web.uri,
          publishedAt: new Date().toLocaleDateString(),
          category: NewsCategory.LATEST,
          thumbnail: `https://picsum.photos/seed/${encodeURIComponent(chunk.web.uri)}/800/450`
        });
      }
    });

    return articles;
  } catch (error) {
    console.error("Error searching news:", error);
    return [];
  }
}
