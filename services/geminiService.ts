// in services/geminiService.ts

export interface ProcessedContent {
  summary: string;
  tags: string[];
  confidence: number;
}

export const processTextWithGemini = async (text: string): Promise<ProcessedContent> => {
    try {
        // Rufe unseren eigenen Backend-Proxy auf
        const response = await fetch('/api/gemini-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const parsedJson = await response.json();

        if (parsedJson.summary && Array.isArray(parsedJson.tags)) {
            return parsedJson as ProcessedContent;
        } else {
            throw new Error("Invalid JSON structure received from the server.");
        }

    } catch (error) {
        console.error("Error processing text via proxy:", error);
        throw new Error("Failed to generate summary and tags.");
    }
};