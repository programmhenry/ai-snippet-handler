// in api/gemini-proxy.ts
import type { IncomingMessage, ServerResponse } from 'http';

// Die createPrompt Funktion bleibt genau gleich wie vorher
const createPrompt = (rawText: string): string => {
  return `Analyze the following text from an AI assistant conversation and provide a summary and relevant tags.

  **Instructions:**
  1.  **Summary:** Create a concise, 1-2 sentence summary of the main point or solution in the text.
  2.  **Tags:** Generate 3-8 relevant keywords or phrases that categorize the content. Focus on technologies, concepts, and key terms.
  3.  **Output Format:** Respond with a valid JSON object.
  
  **Text to Process:**
  ---
  ${rawText}
  ---
  `;
};


// Der Handler bekommt jetzt explizite Typen
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
    // Setze den Content-Type für alle Antworten
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.statusCode = 405;
        res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }));
        return;
    }

    try {
        const { text } = req.body;
        if (!text) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Text content is missing in the request body.' }));
            return;
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error("Gemini API key is not configured on the server.");
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Server configuration error.' }));
            return;
        }
        
        const gapiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(gapiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: createPrompt(text) }] }],
                generationConfig: {
                    response_mime_type: "application/json",
                    temperature: 0.2
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Error from Gemini API:", errorBody);
            throw new Error(`Gemini API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const jsonText = data.candidates[0].content.parts[0].text;
        
        // Sende die erfolgreiche Antwort
        res.statusCode = 200;
        res.end(jsonText);

    } catch (error) {
        console.error('Error in Gemini proxy:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to process text with Gemini.' }));
    }
}