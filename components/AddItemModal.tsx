// in components/AddItemModal.tsx

import React, { useState } from 'react';
import { processTextWithGemini, ProcessedContent } from '../services/geminiService';
import { SavedItem } from '../types';
import Spinner from './Spinner';

interface AddItemModalProps {
    onClose: () => void;
    onAddItem: (newItem: Omit<SavedItem, 'id'>) => void;
    initialText: string;
    initialContext: { url: string; pageTitle: string; };
}

// NEU: Eine Liste gängiger KI-Modelle für das Dropdown
const popularModels = [
    "Gemini 2.5 Flash",
    "Gemini 2.5 Pro",
    "GPT-4o",
    "GPT-4",
    "Claude 3 Opus",
    "Claude 3 Sonnet",
    "Other"
];

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAddItem, initialText, initialContext }) => {
    const [rawText, setRawText] = useState(initialText);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // NEU: Zustand für das ausgewählte Modell, mit einem Standardwert
    const [selectedModel, setSelectedModel] = useState(popularModels[0]); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawText.trim()) {
            setError('Please paste some text from the chat.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const processedContent: ProcessedContent = await processTextWithGemini(rawText);
            
            // NEU: Automatische Erkennung der Plattform basierend auf der URL
            let sourcePlatform: SavedItem['sourcePlatform'] = 'Other';
            if (initialContext.url.includes('chat.openai.com')) {
                sourcePlatform = 'ChatGPT';
            } else if (initialContext.url.includes('gemini.google.com')) {
                sourcePlatform = 'Gemini';
            }

            const newItem: Omit<SavedItem, 'id'> = {
                text: rawText,
                markdown: rawText,
                summary: processedContent.summary,
                tags: processedContent.tags,
                codeBlocks: [],
                images: [],
                model: selectedModel, // Verwendet das Modell aus dem Dropdown
                url: initialContext.url,
                pageTitle: initialContext.pageTitle,
                timestamp: new Date().toISOString(),
                sourcePlatform: sourcePlatform, // Setzt die automatisch erkannte Plattform
            };
            onAddItem(newItem);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Snippet</h2>
                        {initialContext.pageTitle && <p className="text-sm text-gray-500 dark:text-gray-400">From: {initialContext.pageTitle}</p>}
                    </div>
                    <div className="p-6 space-y-4">
                        <textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste the assistant's reply here..."
                            className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            disabled={isLoading}
                        />
                        {/* --- NEUES MODELL-DROPDOWN --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Model</label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                disabled={isLoading}
                            >
                                {popularModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        {/* --------------------------- */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center gap-4 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium" disabled={isLoading}>Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2" disabled={isLoading}>
                            {isLoading ? <Spinner /> : 'Process & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;