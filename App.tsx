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

const App: React.FC = () => {
    const [items, setItems] = useState<SavedItem[]>(loadItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
    const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    
    const [modalInitialData, setModalInitialData] = useState({ text: '', context: { url: '', pageTitle: '' } });

    useEffect(() => {
        saveItems(items);
    }, [items]);

    // Dieser useEffect ersetzt die alte URL-Parameter-Logik
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
                
                // WICHTIG: Die Daten sofort löschen, um Doppelverarbeitung zu verhindern
                localStorage.removeItem('snippet-to-add');

            } catch (error) {
                console.error("Failed to parse snippet from localStorage", error);
                localStorage.removeItem('snippet-to-add'); // Aufräumen bei Fehler
            }
        }
    }, []); // Läuft nur einmal beim Start der App
    
    const filteredItems = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        if (!lowercasedQuery) return items;
        return items.filter(item =>
            item.summary.toLowerCase().includes(lowercasedQuery) ||
            item.text.toLowerCase().includes(lowercasedQuery) ||
            item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
        );
    }, [items, searchQuery]);

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
        };
        setItems(prevItems => [fullNewItem, ...prevItems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <ItemList items={filteredItems} onSelectItem={handleSelectItem} />
                </div>
            </main>
            
            {selectedItem && ( <ItemDetailModal item={selectedItem} onClose={handleCloseModal} onDelete={handleDeleteItem} onEdit={handleStartEdit} /> )}
            {editingItem && ( <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onUpdateItem={handleUpdateItem} /> )}
            <AddItemFab onOpen={() => { setModalInitialData({ text: '', context: { url: '', pageTitle: '' } }); setAddModalOpen(true); }} />
            {isAddModalOpen && ( <AddItemModal onClose={() => setAddModalOpen(false)} onAddItem={handleAddItem} initialText={modalInitialData.text} initialContext={modalInitialData.context} /> )}
        </div>
    );
};

export default App;