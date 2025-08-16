// in components/ItemList.tsx

import React from 'react';
import { SavedItem, Folder } from '../types'; // <-- Folder importieren
import ItemCard from './ItemCard';

interface ItemListProps {
    items: SavedItem[];
    onSelectItem: (item: SavedItem) => void;
    onTagClick: (tag: string) => void;
    onToggleFavorite: (id: string) => void;
    // --- NEUE PROPS FÜR KONTEXT ---
    searchQuery: string;
    activeFolderId: string | null;
    folders: Folder[];
}

const ItemList: React.FC<ItemListProps> = ({ items, onSelectItem, onTagClick, onToggleFavorite, searchQuery, activeFolderId, folders }) => {
    
    // Wenn die Liste leer ist, zeige eine kontextabhängige Nachricht an
    if (items.length === 0) {
        let title = "No Snippets Found";
        let message = "Try a different search term or add a new snippet!";

        if (searchQuery) {
            title = `No results for "${searchQuery}"`;
            message = "Try checking your spelling or using different keywords.";
        } else if (activeFolderId) {
            const folderName = folders.find(f => f.id === activeFolderId)?.name;
            title = `Folder "${folderName}" is empty`;
            message = "You can drag and drop existing snippets here or add a new one while this folder is selected.";
        } else {
            title = "Welcome to your Snippet Library!";
            message = "Click the '+' button in the bottom right to add your first snippet.";
        }

        return (
            <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{message}</p>
            </div>
        );
    }

    // Wenn Items vorhanden sind, zeige die Liste wie gewohnt an
    return (
        <div className="space-y-4">
            {items.map(item => (
                <ItemCard 
                    key={item.id} 
                    item={item} 
                    onSelect={() => onSelectItem(item)}
                    onTagClick={onTagClick}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
};

export default ItemList;