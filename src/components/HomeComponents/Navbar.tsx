import React, { useState } from 'react';
import Link from 'next/link';
import { Code, Menu, X } from 'lucide-react';

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <Code className="h-8 w-8 text-indigo-500" />
                    <span className="text-2xl font-bold text-white">Pixcel Coders</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
                    <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
                    <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
                    <Link href="/community" className="text-gray-300 hover:text-white transition-colors">Community</Link>
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/auth?modal=login" className="text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Login
                    </Link>
                    <Link href="/auth?modal=signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900 pb-4">
                    <nav className="flex flex-col items-center space-y-4">
                        <Link href="/#features" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                        <Link href="/docs" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Docs</Link>
                        <Link href="/community" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Community</Link>
                        <div className="flex items-center space-x-4 pt-4">
                            <Link href="/auth?modal=login" className="text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Login
                            </Link>
                            <Link href="/auth?modal=signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                                Sign Up
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;
