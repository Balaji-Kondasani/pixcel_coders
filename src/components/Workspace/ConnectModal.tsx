import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { connectModalState } from '../../atoms/connectModalAtom';
import { X, UserPlus, ArrowRight, Copy, Check, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/firebase';
import { useRouter } from 'next/router';

const ConnectModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(connectModalState);
    const [user] = useAuthState(auth);
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [roomDetails, setRoomDetails] = useState({ name: user?.displayName || '', roomId: '' });
    const [isCreating, setIsCreating] = useState(false);

    const handleClose = () => {
        setModalState({ isOpen: false });
        setTimeout(() => setStep(1), 300); // Reset on close
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomDetails({ ...roomDetails, [e.target.name]: e.target.value });
    };

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomDetails.name || !roomDetails.roomId) return;
        setIsCreating(true);
        // In a real app, you might validate the room ID here.
        // For now, we'll just redirect.
        setTimeout(() => {
            router.push(`/live/${roomDetails.roomId}`);
        }, 1000);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleCreateRoom}>
                        <p className="text-slate-400 mb-6 text-sm">Create a room to start a live coding session with your friends.</p>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Your Name" value={roomDetails.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                            <input type="text" name="roomId" placeholder="Enter a Room ID" value={roomDetails.roomId} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        <button type="submit" className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50" disabled={isCreating}>
                            {isCreating ? <Loader2 className="animate-spin" /> : <>Create Room <ArrowRight className="ml-2" size={18} /></>}
                        </button>
                    </form>
                );
            // You can add more steps here for inviting friends, etc.
            default:
                return null;
        }
    };

    if (!modalState.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-slate-900 border-t-4 border-indigo-500 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Start a Live Session</h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 pt-0">{renderStep()}</div>
            </div>
        </div>
    );
};

export default ConnectModal;
