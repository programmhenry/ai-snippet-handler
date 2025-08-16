
import React from 'react';
import { SavedItem } from '../types';
import Tag from './Tag';

interface ItemCardProps {
    item: SavedItem;
    onSelect: () => void;
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

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

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-200"
            onClick={onSelect}
        >
            <p className="text-gray-800 dark:text-gray-200 font-semibold mb-2">{item.summary}</p>
            <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map(tag => <Tag key={tag} label={tag} />)}
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
