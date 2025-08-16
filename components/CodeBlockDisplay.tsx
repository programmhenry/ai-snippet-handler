import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockDisplayProps {
    language: string;
    code: string;
}

const CodeBlockDisplay: React.FC<CodeBlockDisplayProps> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-gray-900 dark:bg-black rounded-lg my-4 relative not-prose">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700 dark:bg-gray-800 rounded-t-lg">
                <span className="text-xs font-semibold text-gray-300 uppercase">{language || 'code'}</span>
                <button onClick={handleCopy} className="flex items-center text-xs text-gray-300 hover:text-white transition-colors">
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            Copy
                        </>
                    )}
                </button>
            </div>
            {/* Hier wird der Syntax Highlighter eingesetzt */}
            <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: '0 0 0.5rem 0.5rem' }}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlockDisplay;