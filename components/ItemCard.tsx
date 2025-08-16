// in components/ItemCard.tsx

import React from 'react';
import { SavedItem } from '../types';
import Tag from './Tag';

interface ItemCardProps {
    item: SavedItem;
    onSelect: () => void;
    onTagClick: (tag: string) => void;
    onToggleFavorite: (id: string) => void;
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// KORREKTUR 1: 'React.FC' korrekt implementiert mit explizitem 'return'
const PlatformIcon: React.FC<{ platform: SavedItem['sourcePlatform'] }> = ({ platform }) => {
    const iconStyles = "w-5 h-5 mr-2";
    if (platform === 'ChatGPT') {
        return <span className={iconStyles} title="ChatGPT">🤖</span>;
    }
    if (platform === 'Gemini') {
        return <span className={iconStyles} title="Gemini">✨</span>;
    }
    return <span className={iconStyles} title="Other">❔</span>;
};


const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, onTagClick, onToggleFavorite }) => {
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(item.id);
    }
    
    // KORREKTUR 2: Event-Objekt wird nicht mehr benötigt, nur der Tag-String
    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.stopPropagation();
        onTagClick(tag);
    }

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-200"
            onClick={onSelect}
        >
            <div className="flex justify-between items-start mb-2">
                <p className="text-gray-800 dark:text-gray-200 font-semibold pr-4">{item.summary}</p>
                <button onClick={handleFavoriteClick} className="text-gray-400 hover:text-yellow-400 transition-colors flex-shrink-0">
                    <svg className={`w-5 h-5 ${item.isFavorite ? 'text-yellow-400' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
                {/* Die Weitergabe der Funktion wird vereinfacht */}
                {item.tags.map(tag => <Tag key={tag} label={tag} onClick={(clickedTag) => handleTagClick(event as unknown as React.MouseEvent, clickedTag)} />)}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <PlatformIcon platform={item.sourcePlatform} />
                    <span>{item.model}</span>
                </div>
                <span>{formatDate(item.timestamp)}</span>
            </div>
        </div>
    );
};

export default ItemCard;