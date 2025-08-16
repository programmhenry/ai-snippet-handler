
import React from 'react';
import { SavedItem } from '../types';
import ItemCard from './ItemCard';

interface ItemListProps {
    items: SavedItem[];
    onSelectItem: (item: SavedItem) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onSelectItem }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Snippets Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search term or add a new snippet!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map(item => (
                <ItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
            ))}
        </div>
    );
};

export default ItemList;
