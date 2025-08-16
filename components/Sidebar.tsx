// in components/Sidebar.tsx

import React, { useState } from 'react'; // <-- useState importieren
import { Folder } from '../types';

interface SidebarProps {
  folders: Folder[];
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onShowAll: () => void;
  onAddFolder: () => void;
  onDeleteFolder: (folderId: string) => void;
  onDropSnippet: (folderId: string, snippetId: string) => void; // <-- NEU
}

const Sidebar: React.FC<SidebarProps> = ({ folders, activeFolderId, onSelectFolder, onShowAll, onAddFolder, onDeleteFolder, onDropSnippet }) => {
  // NEU: Zustand, um zu wissen, über welchem Ordner gerade gezogen wird
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault(); // Notwendig, um 'onDrop' zu ermöglichen
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
    setDragOverFolderId(null); // Aufräumen nach dem Drop
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
              // NEUE Drag & Drop Event Handler
              onDragOver={(e) => handleDragOver(e, folder.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
              // NEUE Klasse für visuelles Feedback
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${activeFolderId === folder.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${dragOverFolderId === folder.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {folder.name}
            </button>
            {/* ... Löschen-Button bleibt unverändert ... */}
          </div>
        ))}
      </div>
      {/* ... "Add New Folder"-Button bleibt unverändert ... */}
    </aside>
  );
};

export default Sidebar;