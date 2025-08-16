// in components/ItemDetailModal.tsx

import React from 'react';
import { SavedItem } from '../types';
import Tag from './Tag';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface ItemDetailModalProps {
    item: SavedItem;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit: (item: SavedItem) => void;
    onTagClick: (tag: string) => void; // <-- NEU
    onToggleFavorite: (id: string) => void; // <-- NEU
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onDelete, onEdit, onTagClick, onToggleFavorite }) => {
    
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this snippet?")) {
            onDelete(item.id);
            onClose();
        }
    };
    
    const handleTagClick = (tag: string) => {
        onClose(); // Modal schließen
        onTagClick(tag); // Filter in der Hauptansicht setzen
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div className="pr-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.summary}</h2>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => <Tag key={tag} label={tag} onClick={handleTagClick} />)}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => onToggleFavorite(item.id)} className="text-gray-400 hover:text-yellow-400 transition-colors">
                                <svg className={`w-6 h-6 ${item.isFavorite ? 'text-yellow-400' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 space-y-1">
                        <div>
                            <strong>Source:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{item.pageTitle || 'Direct Link'}</a>
                        </div>
                        <div>
                            <strong>Captured:</strong> {new Date(item.timestamp).toLocaleString()} with {item.model}
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Full Content</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                            children={item.text}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        />
                    </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center gap-4 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
                        Delete
                    </button>
                    <button onClick={() => onEdit(item)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;