// in App.tsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SavedItem } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ItemList from './components/ItemList';
import ItemDetailModal from './components/ItemDetailModal';
import AddItemFab from './components/AddItemFab';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import { loadItems, saveItems } from './services/storageService';
import Tag from './components/Tag'; // <-- Importieren

const App: React.FC = () => {
    const [items, setItems] = useState<SavedItem[]>(loadItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
    const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    
    // --- NEUE STATUS-HOOKS ---
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showFavorites, setShowFavorites] = useState(false);
    // -------------------------

    const [modalInitialData, setModalInitialData] = useState({ text: '', context: { url: '', pageTitle: '' } });

    useEffect(() => {
        saveItems(items);
    }, [items]);

    useEffect(() => {
        const pendingSnippetJSON = localStorage.getItem('snippet-to-add');

        if (pendingSnippetJSON) {
            try {
                const pendingSnippet = JSON.parse(pendingSnippetJSON);
                
                setModalInitialData({
                    text: pendingSnippet.text || '',
                    context: {
                        url: pendingSnippet.url || '',
                        pageTitle: pendingSnippet.title || ''
                    }
                });
                setAddModalOpen(true);
                localStorage.removeItem('snippet-to-add');

            } catch (error) {
                console.error("Failed to parse snippet from localStorage", error);
                localStorage.removeItem('snippet-to-add');
            }
        }
    }, []); 
    
    const filteredItems = useMemo(() => {
        let filtered = items;

        // 1. Nach Favoriten filtern
        if (showFavorites) {
            filtered = filtered.filter(item => item.isFavorite);
        }

        // 2. Nach aktivem Tag filtern
        if (activeTag) {
            filtered = filtered.filter(item => item.tags.includes(activeTag));
        }

        // 3. Nach Suchanfrage filtern
        const lowercasedQuery = searchQuery.toLowerCase();
        if (lowercasedQuery) {
            filtered = filtered.filter(item =>
                item.summary.toLowerCase().includes(lowercasedQuery) ||
                item.text.toLowerCase().includes(lowercasedQuery) ||
                item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
            );
        }
        
        return filtered;
    }, [items, searchQuery, activeTag, showFavorites]);

    const handleTagClick = useCallback((tag: string) => {
        setActiveTag(tag);
        setSearchQuery(''); // Suchleiste leeren für klares Ergebnis
    }, []);

    const clearFilter = useCallback(() => {
        setActiveTag(null);
    }, []);

    const toggleFavorites = () => {
        setShowFavorites(prev => !prev);
    }
    
    const toggleFavoriteStatus = useCallback((id: string) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
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
    
    const handleSelectItem = useCallback((item: SavedItem) => {
        setSelectedItem(item);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedItem(null);
    }, []);
    
    const handleAddItem = useCallback((newItem: Omit<SavedItem, 'id'>) => {
        const fullNewItem: SavedItem = {
            ...newItem,
            id: new Date().toISOString(),
            isFavorite: false,
        };
        setItems(prevItems => [fullNewItem, ...prevItems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    
                    {/* --- NEUE FILTER-LEISTE --- */}
                    <div className="mb-4 flex items-center gap-4">
                         <button 
                            onClick={toggleFavorites}
                            className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-2 transition-colors ${showFavorites ? 'bg-yellow-400 text-black' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                        >
                           <svg className={`w-4 h-4 ${showFavorites ? 'text-black' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                           Favorites
                        </button>
                        {activeTag && (
                            <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full">
                                <span>Filtering by: <span className="font-bold">#{activeTag}</span></span>
                                <button onClick={clearFilter} className="bg-white/20 hover:bg-white/40 rounded-full w-5 h-5 flex items-center justify-center text-sm">&times;</button>
                            </div>
                        )}
                    </div>
                    {/* ------------------------- */}

                    <ItemList items={filteredItems} onSelectItem={handleSelectItem} onTagClick={handleTagClick} onToggleFavorite={toggleFavoriteStatus} />
                </div>
            </main>
            
            {selectedItem && ( <ItemDetailModal item={selectedItem} onClose={handleCloseModal} onDelete={handleDeleteItem} onEdit={handleStartEdit} onTagClick={handleTagClick} onToggleFavorite={toggleFavoriteStatus} /> )}
            {editingItem && ( <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onUpdateItem={handleUpdateItem} /> )}
            <AddItemFab onOpen={() => { setModalInitialData({ text: '', context: { url: '', pageTitle: '' } }); setAddModalOpen(true); }} />
            {isAddModalOpen && ( <AddItemModal onClose={() => setAddModalOpen(false)} onAddItem={handleAddItem} initialText={modalInitialData.text} initialContext={modalInitialData.context} /> )}
        </div>
    );
};

export default App;