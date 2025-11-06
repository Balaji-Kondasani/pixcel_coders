import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Split from 'react-split';
import CollaborativeEditor from '../../components/Workspace/CollaborativeEditor';
import { firestore, auth } from '../../Firebase/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Play, Users, Code, ChevronDown } from 'lucide-react';

const LiveCodingPage: React.FC = () => {
    const router = useRouter();
    const { roomId } = router.query;
    const [user] = useAuthState(auth);

    const [code, setCode] = useState<string>("# Welcome to your collaborative session!\n# Start coding in Python.");
    const [language, setLanguage] = useState('python');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

    // Firestore real-time listener
    useEffect(() => {
        if (!roomId || !user) return;

        const roomDocRef = doc(firestore, 'live_rooms', roomId as string);

        // Set initial document data if it doesn't exist
        setDoc(roomDocRef, { code: code, language: language, input: input, output: output, users: [user.displayName] }, { merge: true });

        const unsubscribe = onSnapshot(roomDocRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setCode(data.code);
                setLanguage(data.language);
                setInput(data.input);
                setOutput(data.output);
                setConnectedUsers(data.users || []);
            }
        });

        // Add user to the room
        const addUser = async () => {
            const currentDoc = await onSnapshot(roomDocRef, (snap) => {
                if (snap.exists()) {
                    const users = snap.data().users || [];
                    if (!users.includes(user.displayName)) {
                        setDoc(roomDocRef, { users: [...users, user.displayName] }, { merge: true });
                    }
                }
            });
        };
        addUser();

        return () => unsubscribe();
    }, [roomId, user]);

    const handleCodeChange = (newCode: string) => {
        const roomDocRef = doc(firestore, 'live_rooms', roomId as string);
        setDoc(roomDocRef, { code: newCode }, { merge: true });
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const roomDocRef = doc(firestore, 'live_rooms', roomId as string);
        setDoc(roomDocRef, { input: e.target.value }, { merge: true });
    };

    return (
        <div className="h-screen bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-slate-800/50 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Code className="h-7 w-7 text-indigo-500" />
                    <span className="text-xl font-bold">Live Session: {roomId}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center -space-x-2">
                        {connectedUsers.slice(0, 3).map(name => (
                             <div key={name} className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold border-2 border-slate-800">{name.charAt(0).toUpperCase()}</div>
                        ))}
                        {connectedUsers.length > 3 && <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border-2 border-slate-800">+{connectedUsers.length - 3}</div>}
                    </div>
                    <button className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                        <Play size={16} />
                        <span>Run</span>
                    </button>
                </div>
            </header>

            {/* Main Content (CodeChef Layout) */}
            <main className="flex-grow flex">
                <Split className="split h-full w-full" sizes={[65, 35]} minSize={200}>
                    {/* Left Pane: Collaborative Editor */}
                    <div className="h-full overflow-hidden">
                        <CollaborativeEditor
                            value={code}
                            onChange={handleCodeChange}
                            language={language}
                        />
                    </div>

                    {/* Right Pane: Input/Output */}
                    <div className="h-full flex flex-col">
                        <Split className="split-vertical h-full" direction="vertical" sizes={[30, 70]}>
                            <div className="h-full flex flex-col">
                                <h3 className="text-sm font-semibold p-3 bg-slate-800 border-b border-slate-700">Input</h3>
                                <textarea
                                    value={input}
                                    onChange={handleInputChange}
                                    className="w-full flex-grow bg-slate-900 p-3 text-sm font-mono focus:outline-none resize-none"
                                    placeholder="Enter your input here..."
                                />
                            </div>
                            <div className="h-full flex flex-col">
                                <h3 className="text-sm font-semibold p-3 bg-slate-800 border-b border-slate-700">Output</h3>
                                <pre className="w-full flex-grow bg-slate-900 p-3 text-sm font-mono overflow-y-auto">
                                    {output || "Run code to see output..."}
                                </pre>
                            </div>
                        </Split>
                    </div>
                </Split>
            </main>
        </div>
    );
};

export default LiveCodingPage;
