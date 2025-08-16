// in components/EditItemModal.tsx

import React, { useState } from 'react';
import { SavedItem, Folder } from '../types'; // <-- Folder importieren

interface EditItemModalProps {
    item: SavedItem;
    folders: Folder[]; // <-- NEU
    onClose: () => void;
    onUpdateItem: (updatedItem: SavedItem) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, folders, onClose, onUpdateItem }) => {
    const [summary, setSummary] = useState(item.summary);
    const [tags, setTags] = useState(item.tags.join(', '));
    const [folderId, setFolderId] = useState(item.folderId || 'none'); // <-- NEU
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!summary.trim() || !tags.trim()) {
            setError('Summary and tags cannot be empty.');
            return;
        }

        const updatedItem: SavedItem = {
            ...item,
            summary: summary,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            folderId: folderId === 'none' ? null : folderId, // <-- NEU
        };

        onUpdateItem(updatedItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Snippet</h2>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                            <input
                                type="text"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                        </div>
                        {/* --- NEUES FOLDER DROPDOWN --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folder</label>
                            <select
                                value={folderId}
                                onChange={(e) => setFolderId(e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="none">No Folder</option>
                                {folders.map(folder => (
                                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* ------------------------- */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center gap-4 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemModal;