// in services/storageService.ts
import { SavedItem } from '../types';

const STORAGE_KEY = 'ai-snippet-library-items';

export const loadItems = (): SavedItem[] => {
    try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
            return JSON.parse(storedItems);
        }
    } catch (error) {
        console.error("Could not load items from localStorage", error);
    }
    return []; // Gib ein leeres Array zurück, wenn nichts da ist oder ein Fehler auftritt
};

export const saveItems = (items: SavedItem[]) => {
    try {
        const itemsToStore = JSON.stringify(items);
        localStorage.setItem(STORAGE_KEY, itemsToStore);
    } catch (error) {
        console.error("Could not save items to localStorage", error);
    }
};