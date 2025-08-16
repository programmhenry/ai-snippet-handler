// in App.tsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SavedItem, Folder } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ItemList from './components/ItemList';
import ItemDetailModal from './components/ItemDetailModal';
import AddItemFab from './components/AddItemFab';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import { loadItems, saveItems } from './services/storageService';
import Sidebar from './components/Sidebar';
import AddFolderModal from './components/AddFolderModal';

// Helper-Funktion zum Laden der Ordner
const loadFolders = (): Folder[] => {
    try {
        const stored = localStorage.getItem('ai-snippet-folders');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Could not load folders from localStorage", error);
        return [];
    }
};

// Helper-Funktion zum Speichern der Ordner
const saveFolders = (folders: Folder[]) => {
    try {
        localStorage.setItem('ai-snippet-folders', JSON.stringify(folders));
    } catch (error) {
        console.error("Could not save folders to localStorage", error);
    }
};

const App: React.FC = () => {
    const [items, setItems] = useState<SavedItem[]>(loadItems);
    const [folders, setFolders] = useState<Folder[]>(loadFolders);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
    const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isAddFolderModalOpen, setAddFolderModalOpen] = useState(false);
    
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showFavorites, setShowFavorites] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

    const [modalInitialData, setModalInitialData] = useState({ text: '', context: { url: '', pageTitle: '' } });

    useEffect(() => { saveItems(items); }, [items]);
    useEffect(() => { saveFolders(folders); }, [folders]);
    
    // Wir bündeln die Logik zum Öffnen des Modals in einer wiederverwendbaren Funktion
    const openAddModalWithData = useCallback((dataString: string | null) => {
        if (!dataString) return;
        
        try {
            const pendingSnippet = JSON.parse(dataString);
            setModalInitialData({
                text: pendingSnippet.text || '',
                context: { url: pendingSnippet.url || '', pageTitle: pendingSnippet.title || '' }
            });
            setAddModalOpen(true);
            localStorage.removeItem('snippet-to-add'); // Aufräumen
        } catch (error) {
            console.error("Failed to parse snippet from localStorage", error);
            localStorage.removeItem('snippet-to-add'); // Auch bei Fehlern aufräumen
        }
    }, []);

    // Effekt 1: Prüft EINMAL beim Laden der Seite
    useEffect(() => {
        const pendingSnippetJSON = localStorage.getItem('snippet-to-add');
        if (pendingSnippetJSON) {
            openAddModalWithData(pendingSnippetJSON);
        }
    }, [openAddModalWithData]);

    // NEU -> Effekt 2: Lauscht auf Änderungen, während die App läuft
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            // Reagiere nur auf das richtige Item und wenn es neue Daten gibt
            if (event.key === 'snippet-to-add' && event.newValue) {
                openAddModalWithData(event.newValue);
            }
        };
        
        // Hänge den Listener an das Fenster an
        window.addEventListener('storage', handleStorageChange);
        
        // Wichtig: Räume den Listener auf, wenn die Komponente verlassen wird
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [openAddModalWithData]);


    const filteredItems = useMemo(() => {
        let filtered = items;

        if (activeFolderId) {
            filtered = filtered.filter(item => item.folderId === activeFolderId);
        }
        if (showFavorites) {
            filtered = filtered.filter(item => item.isFavorite);
        }
        if (activeTag) {
            filtered = filtered.filter(item => item.tags.includes(activeTag));
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        if (lowercasedQuery) {
            filtered = filtered.filter(item =>
                item.summary.toLowerCase().includes(lowercasedQuery) ||
                item.text.toLowerCase().includes(lowercasedQuery) ||
                item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
            );
        }
        
        const sorted = [...filtered];
        switch (sortOrder) {
            case 'oldest':
                sorted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                break;
            case 'alphabetical':
                sorted.sort((a, b) => a.summary.localeCompare(b.summary));
                break;
            case 'newest':
            default:
                sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                break;
        }
        
        return sorted;
    }, [items, searchQuery, activeTag, showFavorites, activeFolderId, sortOrder]);

    const handleAddFolder = (name: string) => {
        const newFolder: Folder = { id: new Date().toISOString(), name, timestamp: new Date().toISOString() };
        setFolders(prev => [...prev, newFolder].sort((a,b) => a.name.localeCompare(b.name)));
    };

    const handleDeleteFolder = (folderId: string) => {
        setItems(prevItems => prevItems.map(item => item.folderId === folderId ? { ...item, folderId: null } : item));
        setFolders(prevFolders => prevFolders.filter(f => f.id !== folderId));
        if (activeFolderId === folderId) {
            setActiveFolderId(null);
        }
    };

    const handleDropSnippetOnFolder = (folderId: string, snippetId: string) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === snippetId ? { ...item, folderId: folderId } : item
            )
        );
        setActiveFolderId(folderId); 
    };

    const handleTagClick = useCallback((tag: string) => {
        setActiveTag(tag);
        setSearchQuery('');
    }, []);

    const clearTagFilter = useCallback(() => setActiveTag(null), []);
    const toggleShowFavorites = () => setShowFavorites(prev => !prev);
    
    const toggleFavoriteStatus = useCallback((id: string) => {
        setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    }, []);
    
    const handleDeleteItem = useCallback((id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const handleUpdateItem = useCallback((updatedItem: SavedItem) => {
        setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        setEditingItem(null);
    }, []);

    const handleStartEdit = (item: SavedItem) => {
        setSelectedItem(null);
        setEditingItem(item);
    };
    
    const handleAddItem = useCallback((newItem: Omit<SavedItem, 'id'>) => {
        const fullNewItem: SavedItem = { ...newItem, id: new Date().toISOString(), isFavorite: false, folderId: activeFolderId };
        setItems(prevItems => [fullNewItem, ...prevItems]);
    }, [activeFolderId]);

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    folders={folders}
                    activeFolderId={activeFolderId}
                    onSelectFolder={setActiveFolderId}
                    onShowAll={() => setActiveFolderId(null)}
                    onAddFolder={() => setAddFolderModalOpen(true)}
                    onDeleteFolder={handleDeleteFolder}
                    onDropSnippet={handleDropSnippetOnFolder}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={toggleShowFavorites}
                                    className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-2 transition-colors ${showFavorites ? 'bg-yellow-400 text-black' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                                >
                                   <svg className={`w-4 h-4 ${showFavorites ? 'text-black' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                   Favorites
                                </button>
                                {activeTag && (
                                    <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full">
                                        <span>Filtering by: <span className="font-bold">#{activeTag}</span></span>
                                        <button onClick={clearTagFilter} className="bg-white/20 hover:bg-white/40 rounded-full w-5 h-5 flex items-center justify-center text-sm">&times;</button>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'alphabetical')}
                                    className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Sort: Newest first</option>
                                    <option value="oldest">Sort: Oldest first</option>
                                    <option value="alphabetical">Sort: Alphabetical</option>
                                </select>
                            </div>
                        </div>

                        <ItemList 
                            items={filteredItems} 
                            onSelectItem={setSelectedItem} 
                            onTagClick={handleTagClick} 
                            onToggleFavorite={toggleFavoriteStatus}
                            searchQuery={searchQuery}
                            activeFolderId={activeFolderId}
                            folders={folders}
                        />
                    </div>
                </main>
            </div>
            
            {selectedItem && ( <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} onDelete={handleDeleteItem} onEdit={handleStartEdit} onTagClick={handleTagClick} onToggleFavorite={toggleFavoriteStatus} /> )}
            {editingItem && ( <EditItemModal item={editingItem} folders={folders} onClose={() => setEditingItem(null)} onUpdateItem={handleUpdateItem} /> )}
            <AddItemFab onOpen={() => { setModalInitialData({ text: '', context: { url: '', pageTitle: '' } }); setAddModalOpen(true); }} />
            {isAddModalOpen && ( <AddItemModal onClose={() => setAddModalOpen(false)} onAddItem={handleAddItem} initialText={modalInitialData.text} initialContext={modalInitialData.context} /> )}
            {isAddFolderModalOpen && <AddFolderModal onClose={() => setAddFolderModalOpen(false)} onAddFolder={handleAddFolder} />}
        </div>
    );
};

export default App;