import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/HomeComponents/Navbar';
import LoginForm from '../../components/Modals/Login';
import SignupForm from '../../components/Modals/Signup';
import ResetPasswordForm from '../../components/Modals/Resetpassword';
import { X, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/firebase';

// Define props for the Modal component
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

// Apply the props type to the Modal component
const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={handleBackdropClick}>
            <div className="bg-slate-900 border-t-4 border-indigo-500 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 pt-0">{children}</div>
            </div>
        </div>
    );
};


const AuthPage: React.FC = () => {
    const router = useRouter();
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [user, loading, error] = useAuthState(auth);

    // Effect for handling the route guard
    useEffect(() => {
        if (!loading && user) {
            // If user is logged in, redirect to home page
            router.push('/');
        }
    }, [user, loading, router]);

    // Effect for setting the modal based on URL query
    useEffect(() => {
        const { modal } = router.query;
        if (typeof modal === 'string' && ['login', 'signup', 'reset'].includes(modal)) {
            setActiveModal(modal);
        } else {
            // Default to showing the login modal if no specific one is requested
            setActiveModal('login');
        }
    }, [router.query]);

    const closeModal = () => {
        setActiveModal(null);
        // Instead of just clearing the query, redirecting to home might be a better UX
        router.push('/'); 
    };

    const openModal = (modalName: string) => {
        setActiveModal(modalName);
        router.push(`/auth?modal=${modalName}`, undefined, { shallow: true });
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'login':
                return <LoginForm onSwitchToSignup={() => openModal('signup')} onSwitchToReset={() => openModal('reset')} />;
            case 'signup':
                return <SignupForm onSwitchToLogin={() => openModal('login')} />;
            case 'reset':
                return <ResetPasswordForm onSwitchToLogin={() => openModal('login')} />;
            default:
                return null;
        }
    };
    
    const getModalTitle = () => {
        switch (activeModal) {
            case 'login': return 'Sign in to Your Account';
            case 'signup': return 'Create a New Account';
            case 'reset': return 'Reset Your Password';
            default: return '';
        }
    }

    // Show a full-screen loading animation while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
            </div>
        );
    }

    // If the user is not logged in, render the page with the modal
    return (
        <div className="min-h-screen bg-gray-900 font-sans text-white">
            {/* The background is always blurred because the modal is always open for a non-logged-in user */}
            <div className="transition-filter duration-300 blur-md">
                <Navbar />
                <div className="relative container mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome</h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Please log in or sign up to continue.
                    </p>
                </div>
            </div>
            
            {/* The modal is rendered on top of the blurred background */}
            {activeModal && (
                <Modal onClose={closeModal} title={getModalTitle()}>
                    {renderModalContent()}
                </Modal>
            )}
        </div>
    );
};

export default AuthPage;
