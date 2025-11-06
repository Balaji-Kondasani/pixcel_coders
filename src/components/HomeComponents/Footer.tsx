import Link from 'next/link';
import { Code, Github, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0e1119] border-t border-gray-800">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Code className="h-8 w-8 text-blue-500" />
                            <span className="text-2xl font-bold text-white">Pixcel Coders</span>
                        </Link>
                        <p className="text-gray-400 text-sm">The future of collaborative development.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link href="/#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/changelog" className="text-gray-400 hover:text-blue-400 transition-colors">Changelog</Link></li>
                            <li><Link href="/integrations" className="text-gray-400 hover:text-blue-400 transition-colors">Integrations</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li><Link href="/docs" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</Link></li>
                            <li><Link href="/community" className="text-gray-400 hover:text-blue-400 transition-colors">Community Forum</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
                            <li><Link href="/support" className="text-gray-400 hover:text-blue-400 transition-colors">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Pixcel Coders, Inc. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <Link href="#" className="text-gray-500 hover:text-white"><Twitter className="h-5 w-5" /></Link>
                        <Link href="#" className="text-gray-500 hover:text-white"><Github className="h-5 w-5" /></Link>
                        <Link href="#" className="text-gray-500 hover:text-white"><Facebook className="h-5 w-5" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;