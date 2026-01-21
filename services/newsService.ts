
import { GoogleGenAI } from "@google/genai";
import { NewsArticle, NewsCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function fetchNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  try {
    const prompt = `Find the 6 latest news articles from Nepal in the category: ${category}. 
    Focus on reputable sources like Kantipur (ekantipur.com), OnlineKhabar, Setopati, Ratopati, and MyRepublica.
    For each article, provide:
    1. A catchy title.
    2. A short summary (2 sentences).
    3. The exact source name.
    4. The publication date or time if available.
    
    IMPORTANT: Provide the information clearly. I will extract the URLs from the grounding metadata.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || '';
    
    // We attempt to map the grounding chunks to articles.
    // Since Gemini returns structured text and grounding metadata, we'll parse the text
    // and match it with the URIs provided by grounding.
    
    const lines = text.split('\n').filter(l => l.trim().length > 5);
    const articles: NewsArticle[] = [];

    // Simple heuristic to extract articles based on grounding chunks
    groundingChunks.forEach((chunk, index) => {
      if (chunk.web && index < 8) { // Limit to top results
        const title = chunk.web.title || `News from ${new URL(chunk.web.uri).hostname}`;
        articles.push({
          id: Math.random().toString(36).substr(2, 9),
          title: title.split(' - ')[0], // Clean title
          excerpt: "Read the latest updates regarding this story on the official portal.",
          source: new URL(chunk.web.uri).hostname.replace('www.', ''),
          url: chunk.web.uri,
          publishedAt: new Date().toLocaleDateString(),
          category: category,
          thumbnail: `https://picsum.photos/seed/${index + category}/800/450`
        });
      }
    });

    return articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  try {
    const prompt = `Search for news articles related to "${query}" from Nepal's top news portals (Kantipur, OnlineKhabar, etc.).`;

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
          excerpt: "Search result from Nepal In Lens grounding engine.",
          source: new URL(chunk.web.uri).hostname.replace('www.', ''),
          url: chunk.web.uri,
          publishedAt: new Date().toLocaleDateString(),
          category: NewsCategory.LATEST,
          thumbnail: `https://picsum.photos/seed/${index + query}/800/450`
        });
      }
    });

    return articles;
  } catch (error) {
    console.error("Error searching news:", error);
    return [];
  }
}
