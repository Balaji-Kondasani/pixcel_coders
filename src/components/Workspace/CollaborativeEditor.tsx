import React from 'react';
import Editor from '@monaco-editor/react';
import { ChevronDown } from 'lucide-react';

interface CollaborativeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ value, onChange, language }) => {
    return (
        <div className="bg-slate-900 h-full flex flex-col">
            <div className="flex-shrink-0 p-2 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                <button className="flex items-center space-x-1 text-white bg-slate-700 px-3 py-1.5 rounded-md text-sm hover:bg-slate-600">
                    <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
                    <ChevronDown size={16} />
                </button>
            </div>
            <div className="flex-grow overflow-hidden">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={value}
                    onChange={(val) => onChange(val || "")}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        tabSize: 4,
                        insertSpaces: true,
                        autoIndent: "full",
                        formatOnType: true,
                    }}
                />
            </div>
        </div>
    );
};

export default CollaborativeEditor;
