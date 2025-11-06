import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle2, Circle, Star, Code, LogOut, Youtube, X, User } from 'lucide-react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/firebase';
import { mockProblems, Problem } from '../../MockProblems/problems'; // CORRECTED: Import from the central data file

// --- Prop Types Definitions ---

interface ProblemsNavbarProps {}
interface ProblemsTableProps {
    problems: Problem[];
    onVideoClick: (url: string) => void;
}
interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
}

// --- Reusable Components for this page ---

const ProblemsNavbar: React.FC<ProblemsNavbarProps> = () => {
    const [user, loading] = useAuthState(auth);
    const [signOut] = useSignOut(auth);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const renderAuthSection = () => {
        if (!isClient || loading) {
            return <div className="h-8 w-24 bg-slate-700 rounded animate-pulse"></div>;
        }

        if (user) {
            return (
                <div className="flex items-center space-x-4">
                    <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
                        <User className="h-6 w-6 text-gray-300" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900 animate-pulse"></span>
                    </button>
                    <button onClick={handleSignOut} className="flex items-center text-gray-300 hover:text-white transition-colors">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-2">
                <Link href="/auth?modal=login" className="text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Sign In
                </Link>
                <Link href="#" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Premium
                </Link>
            </div>
        );
    };

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <Code className="h-8 w-8 text-indigo-500" />
                        <span className="text-2xl font-bold text-white">Pixcel Coders</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/problems" className="text-white font-semibold">Problems</Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contest</Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">Discuss</Link>
                    </nav>
                </div>
                {renderAuthSection()}
            </div>
        </header>
    );
};

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
    if (!isOpen) return null;
    const embedUrl = videoUrl ? videoUrl.replace("watch?v=", "embed/") : "";
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-3xl m-4 relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-4 -right-4 text-white bg-slate-800 rounded-full p-2 hover:bg-slate-700">
                    <X size={24} />
                </button>
                <div className="aspect-video">
                    <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-t-lg"></iframe>
                </div>
            </div>
        </div>
    );
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ problems, onVideoClick }) => {
    const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-900/50';
            case 'Medium': return 'text-yellow-400 bg-yellow-900/50';
            case 'Hard': return 'text-red-400 bg-red-900/50';
        }
    };

    const getStatusIcon = (status: 'Solved' | 'Attempted' | 'Unsolved') => {
        switch (status) {
            case 'Solved': return <CheckCircle2 className="text-green-500" size={20} />;
            case 'Unsolved': return <Circle className="text-slate-600" size={20} />;
            default: return <Circle className="text-slate-600" size={20} />;
        }
    };
    
    const getCategoryClass = (category: string) => {
        const categoryMap: { [key: string]: string } = {
            'Array': 'bg-sky-900/70 text-sky-300',
            'Linked List': 'bg-rose-900/70 text-rose-300',
            'Sliding Window': 'bg-amber-900/70 text-amber-300',
            'Binary Search': 'bg-indigo-900/70 text-indigo-300',
            'Math': 'bg-purple-900/70 text-purple-300',
            'Hash Table': 'bg-teal-900/70 text-teal-300',
            'Two Pointers': 'bg-pink-900/70 text-pink-300',
            'Stack': 'bg-cyan-900/70 text-cyan-300',
            'Tree': 'bg-emerald-900/70 text-emerald-300',
            'Dynamic Programming': 'bg-orange-900/70 text-orange-300',
        };
        return categoryMap[category] || 'bg-slate-700 text-slate-300';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-800 text-slate-400 font-semibold text-sm">
                <div className="col-span-1">Status</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2 text-center">Category</div>
                <div className="col-span-1 text-center">Acceptance</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-1 text-center">Solution</div>
            </div>
            <div>
                {problems.map((prob, index) => (
                    <div key={prob.id} className={`grid grid-cols-12 items-center px-6 py-4 text-white hover:bg-slate-800/50 transition-colors duration-200 ${index < problems.length - 1 ? 'border-b border-slate-800' : ''}`}>
                        <div className="col-span-1 flex justify-start">{getStatusIcon(prob.status)}</div>
                        <div className="col-span-5 flex items-center">
                            <Link href={`/problems/${prob.titleId}`} className="font-medium hover:text-indigo-400 transition-colors">
                                {prob.title}
                            </Link>
                            {prob.isPremium && <Star className="ml-2 text-yellow-500" size={16} fill="currentColor" />}
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryClass(prob.category)}`}>
                                {prob.category}
                            </span>
                        </div>
                        <div className="col-span-1 text-center text-slate-300">{prob.acceptance.toFixed(1)}%</div>
                        <div className="col-span-2 flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyClass(prob.difficulty)}`}>
                                {prob.difficulty}
                            </span>
                        </div>
                        <div className="col-span-1 flex justify-center">
                            {prob.videoUrl && (
                                <button onClick={() => onVideoClick(prob.videoUrl!)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <Youtube size={22} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Problems Page ---
const ProblemsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

    const handleVideoClick = (url: string) => {
        setSelectedVideoUrl(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideoUrl('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 font-sans text-white">
            <ProblemsNavbar />
            <main className="container mx-auto px-6 pt-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Problems</h1>
                </div>
                {/* Now using the imported mockProblems from the central file */}
                <ProblemsTable problems={mockProblems} onVideoClick={handleVideoClick} />
            </main>
            <VideoModal isOpen={isModalOpen} onClose={closeModal} videoUrl={selectedVideoUrl} />
        </div>
    );
};

export default ProblemsPage;
