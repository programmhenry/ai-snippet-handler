// in types.ts

export interface SavedItem {
  id: string;
  text: string;
  markdown: string;
  summary: string;
  tags: string[];
  codeBlocks: CodeBlock[];
  images: string[];
  model: string;
  url: string;
  pageTitle: string; 
  timestamp: string;
  sourcePlatform: 'ChatGPT' | 'Gemini' | 'Other';
  isFavorite?: boolean; // <-- NEU: Für Favoriten
}

export interface CodeBlock {
  language: string;
  code: string;
}