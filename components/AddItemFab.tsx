
import React from 'react';

interface AddItemFabProps {
    onOpen: () => void;
}

const AddItemFab: React.FC<AddItemFabProps> = ({ onOpen }) => {
    return (
        <button
            onClick={onOpen}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 z-20"
            aria-label="Add new snippet"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
};

export default AddItemFab;
