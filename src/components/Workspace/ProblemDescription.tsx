// src/components/Workspace/ProblemDescription.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Problem } from '../../MockProblems/problems';
import { ThumbsUp, ThumbsDown, Star, CheckCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../Firebase/firebase';
import { doc, runTransaction, onSnapshot, increment } from 'firebase/firestore';

// Define the state for problem data, including real-time counts
interface ProblemDataState extends Problem {
    likes?: number;
    dislikes?: number;
}

interface ProblemDescriptionProps {
    problem: Problem;
    setLeftPaneView: (view: 'description' | 'submissions') => void;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, setLeftPaneView }) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [problemData, setProblemData] = useState<ProblemDataState>(problem);

    // User's personal interaction state (liked, disliked, starred)
    const [userVote, setUserVote] = useState<'liked' | 'disliked' | null>(null);
    const [isStarred, setIsStarred] = useState(false);

    // State to prevent multiple clicks while a transaction is running
    const [isInteracting, setIsInteracting] = useState(false);

    // Effect to listen for real-time updates from Firestore
    useEffect(() => {
        if (!problem || !user) return;

        const problemDocRef = doc(firestore, 'problems', problem.titleId);
        const userDocRef = doc(firestore, 'users', user.uid);

        // Listener for public problem data (likes/dislikes)
        const unsubProblem = onSnapshot(problemDocRef, (snap) => {
            if (snap.exists()) {
                const { likes = 0, dislikes = 0 } = snap.data();
                setProblemData((prev) => ({ ...prev, likes, dislikes }));
            }
        });

        // Listener for the current user's personal data (their votes and stars)
        const unsubUser = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
                const userData = snap.data();
                setUserVote(
                    userData.likedProblems?.includes(problem.titleId) ? 'liked'
                    : userData.dislikedProblems?.includes(problem.titleId) ? 'disliked'
                    : null
                );
                setIsStarred(userData.starredProblems?.includes(problem.titleId) || false);
            }
        });

        // Cleanup listeners on component unmount
        return () => {
            unsubProblem();
            unsubUser();
        };
    }, [problem, user]);

    // Transactional function to handle likes, dislikes, and stars safely
    const handleInteraction = async (type: 'like' | 'dislike' | 'star') => {
        if (!user) {
            router.push('/auth?modal=login');
            return;
        }
        if (isInteracting) return;

        setIsInteracting(true);

        const userDocRef = doc(firestore, 'users', user.uid);
        const problemDocRef = doc(firestore, 'problems', problem.titleId);

        try {
            await runTransaction(firestore, async (tx) => {
                const userSnap = await tx.get(userDocRef);
                const problemSnap = await tx.get(problemDocRef);

                if (!userSnap.exists() || !problemSnap.exists()) throw "Document not found!";

                const userData = userSnap.data();
                const problemData = problemSnap.data();
                
                let likedProblems: string[] = userData.likedProblems || [];
                let dislikedProblems: string[] = userData.dislikedProblems || [];
                let starredProblems: string[] = userData.starredProblems || [];
                let { likes = 0, dislikes = 0 } = problemData;

                if (type === 'star') {
                    if (starredProblems.includes(problem.titleId)) {
                        tx.update(userDocRef, { starredProblems: starredProblems.filter(id => id !== problem.titleId) });
                    } else {
                        tx.update(userDocRef, { starredProblems: [...starredProblems, problem.titleId] });
                    }
                }

                if (type === 'like') {
                    if (likedProblems.includes(problem.titleId)) {
                        tx.update(userDocRef, { likedProblems: likedProblems.filter(id => id !== problem.titleId) });
                        if (likes > 0) tx.update(problemDocRef, { likes: increment(-1) });
                    } else {
                        tx.update(userDocRef, {
                            likedProblems: [...likedProblems, problem.titleId],
                            dislikedProblems: dislikedProblems.filter(id => id !== problem.titleId),
                        });
                        tx.update(problemDocRef, {
                            likes: increment(1),
                            dislikes: dislikedProblems.includes(problem.titleId) && dislikes > 0 ? increment(-1) : increment(0),
                        });
                    }
                }

                if (type === 'dislike') {
                    if (dislikedProblems.includes(problem.titleId)) {
                        tx.update(userDocRef, { dislikedProblems: dislikedProblems.filter(id => id !== problem.titleId) });
                        if (dislikes > 0) tx.update(problemDocRef, { dislikes: increment(-1) });
                    } else {
                        tx.update(userDocRef, {
                            dislikedProblems: [...dislikedProblems, problem.titleId],
                            likedProblems: likedProblems.filter(id => id !== problem.titleId),
                        });
                        tx.update(problemDocRef, {
                            dislikes: increment(1),
                            likes: likedProblems.includes(problem.titleId) && likes > 0 ? increment(-1) : increment(0),
                        });
                    }
                }
            });
        } catch (err) {
            console.error('Interaction failed:', err);
        } finally {
            setIsInteracting(false);
        }
    };

    const getDifficultyClass = (difficulty: string) => {
        if (difficulty === 'Easy') return 'bg-green-900/50 text-green-400';
        if (difficulty === 'Medium') return 'bg-yellow-900/50 text-yellow-400';
        return 'bg-red-900/50 text-red-400';
    };

    return (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full overflow-y-auto">
            {/* Tabs */}
            <div className="flex-shrink-0 flex space-x-4 border-b border-slate-700 mb-4">
                <div className="text-white font-semibold py-2 border-b-2 border-indigo-500 cursor-pointer">Description</div>
                <div 
                    onClick={() => setLeftPaneView('submissions')}
                    className="text-slate-400 font-medium py-2 hover:text-white cursor-pointer transition-colors"
                >
                    Submissions
                </div>
            </div>

            {/* Problem Header */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold text-white">{problemData.title}</h1>
                    {problemData.status === 'Solved' && (
                        <div className="flex items-center space-x-2 text-green-500">
                            <CheckCircle size={20} />
                            <span className="font-semibold">Solved</span>
                        </div>
                    )}
                </div>

                {/* Likes / Dislikes / Stars */}
                <div className="flex items-center space-x-4 mb-6">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getDifficultyClass(problemData.difficulty)}`}>
                        {problemData.difficulty}
                    </span>
                    <div className="flex items-center space-x-4 text-slate-400">
                        <button onClick={() => handleInteraction('like')} disabled={isInteracting} className={`flex items-center space-x-1 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors ${userVote === 'liked' ? 'text-blue-500' : ''}`}>
                            <ThumbsUp size={18} />
                            <span>{problemData.likes || 0}</span>
                        </button>
                        <button onClick={() => handleInteraction('dislike')} disabled={isInteracting} className={`flex items-center space-x-1 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors ${userVote === 'disliked' ? 'text-red-500' : ''}`}>
                            <ThumbsDown size={18} />
                            <span>{problemData.dislikes || 0}</span>
                        </button>
                        <button onClick={() => handleInteraction('star')} disabled={isInteracting} className={`flex items-center space-x-1 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors ${isStarred ? 'text-yellow-400' : ''}`}>
                            <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* Problem Statement */}
                <div
                    className="prose prose-invert max-w-none text-slate-300"
                    dangerouslySetInnerHTML={{ __html: problemData.problemStatement }}
                />

                {/* Examples */}
                {problemData.examples.map((example, index) => (
                    <div key={example.id} className="mt-6">
                        <p className="font-semibold text-white">Example {index + 1}:</p>
                        <div className="bg-slate-800 p-4 rounded-md mt-2 text-sm">
                            <p><strong className="text-slate-300">Input:</strong> <code className="text-white">{example.inputText}</code></p>
                            <p><strong className="text-slate-300">Output:</strong> <code className="text-white">{example.outputText}</code></p>
                            {example.explanation && (
                                <div dangerouslySetInnerHTML={{ __html: `<strong class="text-slate-300">Explanation:</strong> ${example.explanation}` }} />
                            )}
                        </div>
                    </div>
                ))}

                {/* Constraints */}
                <div className="mt-8">
                    <p className="font-semibold text-white">Constraints:</p>
                    <ul
                        className="list-disc pl-5 mt-2 text-slate-300"
                        dangerouslySetInnerHTML={{ __html: problemData.constraints }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemDescription;
