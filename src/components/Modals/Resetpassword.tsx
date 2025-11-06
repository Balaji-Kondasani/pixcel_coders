import React, { useState } from 'react';

// --- Prop Types Definitions ---

interface InputProps {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

interface ResetPasswordFormProps {
    onSwitchToLogin: () => void;
}

// --- Helper Components ---

const Input: React.FC<InputProps> = ({ id, label, type = 'text', placeholder, value, onChange, error }) => (
    <div className="mb-5">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
        <input type={type} id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-4 py-3 bg-slate-800 text-white border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500`} />
        {error && <p className="text-red-400 text-xs font-semibold mt-1">{error}</p>}
    </div>
);

// --- Main Component ---

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required.');
            return;
        }
        setError('');
        console.log('Sending reset link to:', email);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center text-white">
                <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                <p className="text-slate-300 mb-4">
                    If an account exists for <span className="font-bold text-indigo-300">{email}</span>, you will get a reset link.
                </p>
                <button onClick={onSwitchToLogin} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors">
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="text-slate-300 text-sm mb-4">
                Enter your account's email and we'll send you a link to reset your password.
            </p>
            <Input id="email" label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors">
                Send Reset Link
            </button>
            <p className="text-center text-sm text-slate-400 mt-8">
                Remember your password?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-semibold text-indigo-400 hover:underline">
                    Login
                </button>
            </p>
        </form>
    );
};

export default ResetPasswordForm;
