import React from 'react';
import { SavedItem } from '../types';
import Tag from './Tag';

// NEUE IMPORTE
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight'; // Das neue Highlighting-Plugin

interface ItemDetailModalProps {
    item: SavedItem;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit: (item: SavedItem) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onDelete, onEdit }) => {
    
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this snippet?")) {
            onDelete(item.id);
            onClose();
        }
    };

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
                                {item.tags.map(tag => <Tag key={tag} label={tag} />)}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
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

                {/* --- HIER DIE NEUE, SAUBERE ANZEIGE --- */}
                <div className="p-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Full Content</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                            children={item.text}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]} // Hier wird das neue Plugin aktiviert
                        />
                    </div>
                </div>
                {/* --- ENDE --- */}

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