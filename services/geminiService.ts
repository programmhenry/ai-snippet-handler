
import { GoogleGenAI, Type } from "@google/genai";

// IMPORTANT: This is a client-side application.
// Storing API keys in client-side code is insecure and should only be done for prototyping.
// In a production environment, this key should be handled by a backend server.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API key not found. Please set the API_KEY environment variable. For development, you can create a .env.local file with API_KEY=YOUR_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export interface ProcessedContent {
  summary: string;
  tags: string[];
  confidence: number;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A short, concise summary of the text, 1-2 sentences long."
        },
        tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 3-8 relevant tags for the text content."
        },
        confidence: {
            type: Type.NUMBER,
            description: "A score from 0.0 to 1.0 indicating confidence in the summary and tags."
        }
    },
    required: ["summary", "tags", "confidence"],
};

const createPrompt = (rawText: string): string => {
  return `Analyze the following text from an AI assistant conversation and provide a summary and relevant tags.

  **Instructions:**
  1.  **Summary:** Create a concise, 1-2 sentence summary of the main point or solution in the text.
  2.  **Tags:** Generate 3-8 relevant keywords or phrases that categorize the content. Focus on technologies, concepts, and key terms.
  3.  **Output Format:** Respond with a valid JSON object matching the provided schema.
  
  **Few-Shot Example 1:**
  *   **Input Text:** "Sure — here's a sample answer for how to log to the console in JavaScript...\\n\\\`\`\`js\\nconsole.log('hi')\\n\\\`\`\`"
  *   **Expected JSON Output:**
      \`\`\`json
      {
        "summary": "Provides a basic JavaScript code snippet for logging 'hi' to the console.",
        "tags": ["javascript", "example", "console.log", "debugging"],
        "confidence": 0.95
      }
      \`\`\`
  
  **Few-Shot Example 2:**
  *   **Input Text:** "The Model-View-Controller (MVC) is an architectural pattern that separates an application into three main logical components: the model, the view, and the controller. Each of these components are built to handle specific development aspects of an application."
  *   **Expected JSON Output:**
      \`\`\`json
      {
        "summary": "Explains the Model-View-Controller (MVC) architectural pattern, which separates applications into model, view, and controller components.",
        "tags": ["software architecture", "mvc", "design pattern", "programming concepts"],
        "confidence": 0.98
      }
      \`\`\`
  
  **Text to Process:**
  ---
  ${rawText}
  ---
  `;
};

export const processTextWithGemini = async (text: string): Promise<ProcessedContent> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    try {
        const prompt = createPrompt(text);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        if (parsedJson.summary && Array.isArray(parsedJson.tags)) {
            return parsedJson as ProcessedContent;
        } else {
            throw new Error("Invalid JSON structure received from Gemini.");
        }

    } catch (error) {
        console.error("Error processing text with Gemini:", error);
        throw new Error("Failed to generate summary and tags from Gemini.");
    }
};
