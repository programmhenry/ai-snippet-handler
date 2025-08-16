
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
  timestamp: string;
  sourcePlatform: 'ChatGPT' | 'Gemini' | 'Other';
}

export interface CodeBlock {
  language: string;
  code: string;
}

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
  pageTitle: string; // <-- DIESE ZEILE HINZUFÜGEN
  timestamp: string;
  sourcePlatform: 'ChatGPT' | 'Gemini' | 'Other';
}

export interface CodeBlock {
  language: string;
  code: string;
}