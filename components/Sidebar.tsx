// in components/Sidebar.tsx

import React, { useState } from 'react';
import { Folder } from '../types';

interface SidebarProps {
  folders: Folder[];
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onShowAll: () => void;
  onAddFolder: () => void;
  onDeleteFolder: (folderId: string) => void;
  onDropSnippet: (folderId: string, snippetId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ folders, activeFolderId, onSelectFolder, onShowAll, onAddFolder, onDeleteFolder, onDropSnippet }) => {
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolderId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolderId(null);
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const snippetId = e.dataTransfer.getData("snippetId");
    if (snippetId) {
      onDropSnippet(folderId, snippetId);
    }
    setDragOverFolderId(null);
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 space-y-4 flex-shrink-0 border-r dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Folders</h2>
      <button 
        onClick={onShowAll}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${!activeFolderId ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        All Snippets
      </button>
      <div className="border-t border-gray-200 dark:border-gray-700"></div>
      <div className="space-y-1">
        {folders.map(folder => (
          <div key={folder.id} className="group flex items-center justify-between">
            <button 
              onClick={() => onSelectFolder(folder.id)}
              onDragOver={(e) => handleDragOver(e, folder.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${activeFolderId === folder.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${dragOverFolderId === folder.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {folder.name}
            </button>
            <button 
                onClick={() => {
                    if (window.confirm(`Are you sure you want to delete the folder "${folder.name}"? This cannot be undone.`)) {
                        onDeleteFolder(folder.id)
                    }
                }}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded-full transition-opacity"
                aria-label="Delete folder"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        ))}
      </div>
      
      {/* --- DIESER BUTTON SOLLTE SICHTBAR SEIN --- */}
      <button 
        onClick={onAddFolder} 
        className="w-full mt-4 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
      >
        + Add New Folder
      </button>
    </aside>
  );
};

export default Sidebar;