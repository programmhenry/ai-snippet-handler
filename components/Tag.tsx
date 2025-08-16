// in components/Tag.tsx

import React from 'react';

interface TagProps {
    label: string;
    onClick?: (label: string) => void; // <-- NEU: Optionaler Click-Handler
}

const Tag: React.FC<TagProps> = ({ label, onClick }) => {
    const commonClasses = "text-xs font-medium px-2.5 py-1 rounded-full";

    if (onClick) {
        return (
            <button
                onClick={() => onClick(label)}
                className={`${commonClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors`}
            >
                #{label}
            </button>
        );
    }

    return (
        <span className={`${commonClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>
            #{label}
        </span>
    );
};

export default Tag;