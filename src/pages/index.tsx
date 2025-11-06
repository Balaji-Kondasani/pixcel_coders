import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase'; // Adjust this import path if needed
import { Loader2 } from 'lucide-react';

import Navbar from '@/components/HomeComponents/Navbar';
import HeroSection from '@/components/HomeComponents/Hero';
import FeaturesSection from '@/components/HomeComponents/Features';
import Footer from '@/components/HomeComponents/Footer';
import PricingSection from "@/components/HomeComponents/PricingSection";

const HomePage: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    // This hook handles the redirect logic
    useEffect(() => {
        // When the auth state is no longer loading and a user object exists, redirect.
        if (!loading && user) {
            // A short delay can make the transition feel smoother
            const timer = setTimeout(() => {
                router.push('./Dashboard');
            }, 1000); // 1-second delay before redirecting

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [user, loading, router]);

    // While Firebase is checking the user's status OR if the user is found and we are about to redirect,
    // show the loading/redirect animation.
    if (loading || user) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mb-4" />
                <p className="text-lg text-slate-300">Taking you to your dashboard...</p>
            </div>
        );
    }

    // If the user is not logged in and the check is complete, show the normal homepage.
    return (
        <>
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
            <Footer />
        </>
    );
};

export default HomePage;
