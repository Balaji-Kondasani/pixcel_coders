import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BookOpen, Cpu, Database, GitBranch, LogOut, User, Code, ToyBrick, Puzzle, Rocket, Loader2 } from 'lucide-react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/firebase';
import Link from 'next/link';

// --- Prop Types Definitions ---

interface ModuleCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    isDummy: boolean;
    onDummyClick: () => void;
}

// --- Reusable Components for this page ---

// Dashboard-specific Navbar
const DashboardNavbar = () => {
    const [user, loading, error] = useAuthState(auth);
    const [signOut] = useSignOut(auth);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false); // State to check if we are on the client

    // This effect runs only on the client side, after the component mounts
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/'); // Redirect to homepage after logout
    };

    const renderAuthButtons = () => {
        // On the server, or while auth is loading, render a placeholder to prevent mismatch
        if (!isClient || loading) {
            return <div className="h-8 w-24 bg-slate-700 rounded animate-pulse"></div>;
        }

        if (user) {
            return (
                <div className="flex items-center space-x-4">
                    <span className="text-gray-300 hidden sm:block">Welcome, {user.displayName || user.email?.split('@')[0]}</span>
                    <button onClick={handleSignOut} className="flex items-center text-gray-300 hover:text-white transition-colors">
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            );
        }
        
        return (
            <div className="flex items-center space-x-2">
                <Link href="/auth?modal=login" className="text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Login
                </Link>
                <Link href="/auth?modal=signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                    Sign Up
                </Link>
            </div>
        );
    };

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Code className="h-8 w-8 text-indigo-500" />
                    <span className="text-2xl font-bold text-white">Pixcel Coders</span>
                </div>
                {renderAuthButtons()}
            </div>
        </header>
    );
};

// Module Card Component
const ModuleCard: React.FC<ModuleCardProps> = ({ icon, title, description, href, isDummy, onDummyClick }) => {
    const cardContent = (
        <>
            <div className="p-4 bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mb-4 border-2 border-slate-700">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
        </>
    );

    if (isDummy) {
        return (
            <button onClick={onDummyClick} className="bg-slate-900 p-6 rounded-lg border border-slate-800 text-left w-full h-full flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300">
                {cardContent}
            </button>
        );
    }

    // Use Next.js Link for client-side navigation
    return (
        <Link href={href} className="block bg-slate-900 p-6 rounded-lg border border-slate-800 w-full h-full flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300">
            {cardContent}
        </Link>
    );
};

// Simple Footer
const Footer = () => (
    <footer className="w-full border-t border-slate-800 mt-24">
        <div className="container mx-auto py-6 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Pixcel Coders. All rights reserved.</p>
        </div>
    </footer>
);

// --- Main Dashboard Page ---

const DashboardPage: React.FC = () => {
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handleDummyClick = () => {
        setShowComingSoon(true);
        setTimeout(() => setShowComingSoon(false), 2000); // Hide after 2 seconds
    };

    const modules = [
        { icon: <BookOpen size={32} className="text-indigo-400" />, title: 'Data Structures', description: 'Master the core building blocks of programming.', href: '/problems', isDummy: false },
        { icon: <Cpu size={32} className="text-teal-400" />, title: 'Algorithms', description: 'Learn to write efficient and scalable code.', href: '#', isDummy: false },
        { icon: <Database size={32} className="text-sky-400" />, title: 'DBMS', description: 'Explore database management and SQL.', href: '#', isDummy: false },
        { icon: <GitBranch size={32} className="text-rose-400" />, title: 'System Design', description: 'Design large-scale, distributed systems.', href: '#', isDummy: false },
        { icon: <ToyBrick size={32} className="text-amber-400" />, title: 'Frontend Masters', description: 'Dive deep into modern frontend frameworks.', href: '#', isDummy: true },
        { icon: <Puzzle size={32} className="text-purple-400" />, title: 'Logic Puzzles', description: 'Sharpen your problem-solving skills.', href: '#', isDummy: true },
        { icon: <Rocket size={32} className="text-lime-400" />, title: 'DevOps Essentials', description: 'Understand the CI/CD pipeline and deployment.', href: '#', isDummy: true },
    ];

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-white">
            <DashboardNavbar />
            <main className="container mx-auto px-6 pt-32">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Explore Modules</h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Choose a topic to start your learning journey and prepare for interviews.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {modules.map((module) => (
                        <ModuleCard key={module.title} {...module} onDummyClick={handleDummyClick} />
                    ))}
                </div>
            </main>
            <Footer />

            {/* "Coming Soon" Toast Message */}
            {showComingSoon && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white py-2 px-6 rounded-lg shadow-lg animate-fade-in-up">
                    Coming Soon!
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
