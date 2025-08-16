// in components/ItemList.tsx

import React from 'react';
import { SavedItem } from '../types';
import ItemCard from './ItemCard';

interface ItemListProps {
    items: SavedItem[];
    onSelectItem: (item: SavedItem) => void;
    onTagClick: (tag: string) => void; // <-- NEU
    onToggleFavorite: (id: string) => void; // <-- NEU
}

const ItemList: React.FC<ItemListProps> = ({ items, onSelectItem, onTagClick, onToggleFavorite }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Snippets Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search term or filter!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map(item => (
                <ItemCard 
                    key={item.id} 
                    item={item} 
                    onSelect={() => onSelectItem(item)}
                    onTagClick={onTagClick} // <-- Durchreichen
                    onToggleFavorite={onToggleFavorite} // <-- Durchreichen
                />
            ))}
        </div>
    );
};

export default ItemList;