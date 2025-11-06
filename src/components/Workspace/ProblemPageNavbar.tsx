// src/components/Workspace/ProblemPageNavbar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Code, Users, ShieldCheck, ChevronLeft, ChevronRight, Timer as TimerIcon, Play, Pause, RefreshCw } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/firebase';
import { useRecoilState } from 'recoil';
import { connectModalState } from '../../atoms/connectModalAtom';
import ConnectModal from './ConnectModal'; // Import the new modal

interface ProblemPageNavbarProps {
    timerHasStarted: boolean;
    timerIsActive: boolean;
    seconds: number;
    onTimerStart: () => void;
    onTimerStop: () => void;
    onTimerReset: () => void;
}

const ProblemPageNavbar: React.FC<ProblemPageNavbarProps> = ({ timerHasStarted, timerIsActive, seconds, onTimerStart, onTimerStop, onTimerReset }) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const controlsRef = useRef<HTMLDivElement | null>(null);
    const [modalState, setModalState] = useRecoilState(connectModalState);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
                setShowControls(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [controlsRef]);

    const handleAuthAction = () => {
        router.push('/auth?modal=login');
    };
    
    const handleConnectClick = () => {
        setModalState({ isOpen: true });
    };

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleStartClick = () => {
        onTimerStart();
        setShowControls(false);
    };

    const renderTimerSection = () => {
        if (timerHasStarted) {
            return (
                <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
                    <span className="font-mono text-white">{formatTime(seconds)}</span>
                    {timerIsActive ? (
                        <button onClick={onTimerStop} className="p-1 rounded-full text-red-400 hover:bg-red-500/20">
                            <Pause size={16} />
                        </button>
                    ) : (
                        <button onClick={onTimerStart} className="p-1 rounded-full text-green-400 hover:bg-green-500/20">
                            <Play size={16} />
                        </button>
                    )}
                    <button onClick={onTimerReset} className="p-1 rounded-full text-gray-400 hover:bg-gray-500/20">
                        <RefreshCw size={16} />
                    </button>
                </div>
            );
        }
        return (
            <div className="relative" ref={controlsRef}>
                <button 
                    onClick={() => setShowControls(!showControls)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-medium p-2 rounded-lg transition-colors flex items-center"
                >
                    <TimerIcon size={20} />
                </button>
                {showControls && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 p-4">
                        <div className="text-center text-2xl font-mono mb-4">{formatTime(seconds)}</div>
                        <div className="flex justify-center">
                            <button onClick={handleStartClick} className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                <Play size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderAuthSection = () => {
        if (!isClient || loading) {
            return <div className="h-10 w-40 bg-slate-700 rounded-lg animate-pulse"></div>;
        }

        if (user) {
            return (
                <div className="flex items-center space-x-3">
                    {renderTimerSection()}
                    <button className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                        <ShieldCheck size={18} />
                        <span>Debug</span>
                    </button>
                    <button 
                        onClick={handleConnectClick}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 flex items-center space-x-2"
                    >
                        <Users size={18} />
                        <span>Connect</span>
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-3">
                <button onClick={handleAuthAction} className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                    <ShieldCheck size={18} />
                    <span>Debug</span>
                </button>
                <button onClick={handleAuthAction} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 flex items-center space-x-2">
                    <Users size={18} />
                    <span>Connect</span>
                </button>
                   <Link href="/auth?modal=login" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                       Sign In
                   </Link>
            </div>
        );
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex-1 flex justify-start">
                        <Link href="/dashboard" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                            <Code className="h-8 w-8 text-indigo-500" />
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center space-x-2 bg-slate-800 p-2 rounded-lg">
                            <ChevronLeft size={20} className="text-slate-400 cursor-pointer hover:text-white" />
                            <Link href="/problems" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                                <span className="text-sm font-medium">Problem List</span>
                            </Link>
                            <ChevronRight size={20} className="text-slate-400 cursor-pointer hover:text-white" />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-end">
                        {renderAuthSection()}
                    </div>
                </div>
            </header>
            <ConnectModal />
        </>
    );
};

export default ProblemPageNavbar;
