// in components/AddFolderModal.tsx

import React, { useState } from 'react';

interface AddFolderModalProps {
  onClose: () => void;
  onAddFolder: (name: string) => void;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ onClose, onAddFolder }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Folder name cannot be empty.');
      return;
    }
    onAddFolder(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Folder</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React Projects"
              className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center gap-4 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFolderModal;