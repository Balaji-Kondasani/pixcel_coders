import React from 'react';
import Editor from '@monaco-editor/react';
import { Settings } from 'lucide-react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
    return (
        <div className="bg-slate-900 rounded-lg h-full flex flex-col">
            <div className="flex-shrink-0 p-3 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-white bg-slate-700 px-3 py-1.5 rounded-md text-sm">
                    <span>{language}</span>
                </div>
                <button>
                    <Settings size={20} className="text-slate-400 hover:text-white" />
                </button>
            </div>
            <div className="flex-grow overflow-hidden">
                <Editor
                    height="100%"
                    language={language.toLowerCase()}
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

export default CodeEditor;
