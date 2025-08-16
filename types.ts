// in types.ts

export interface Folder {
  id: string;
  name: string;
  timestamp: string;
}

export interface SavedItem {
  id:string;
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
  isFavorite?: boolean;
  folderId?: string | null; // <-- NEU: ID des Ordners, zu dem das Snippet gehört
}

export interface CodeBlock {
  language: string;
  code: string;
}