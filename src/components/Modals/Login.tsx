import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/firebase';
import { useRouter } from 'next/router'; // Import the useRouter hook

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

interface PasswordInputProps extends Omit<InputProps, 'type'> {}

interface SocialButtonProps {
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
}

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onSwitchToReset: () => void;
}

// --- Helper Components ---

const Input: React.FC<InputProps> = ({ id, label, type = 'text', placeholder, value, onChange, error }) => (
    <div className="mb-5">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
        <input type={type} id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-4 py-3 bg-slate-800 text-white border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500`} />
        {error && <p className="text-red-400 text-xs font-semibold mt-1">{error}</p>}
    </div>
);

const PasswordInput: React.FC<PasswordInputProps> = ({ id, label, placeholder, value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
            <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-4 py-3 bg-slate-800 text-white border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && <p className="text-red-400 text-xs font-semibold mt-1">{error}</p>}
        </div>
    );
};

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.438,36.338,48,31,48,24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const SocialButton: React.FC<SocialButtonProps> = ({ icon, children, onClick }) => (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
        {icon}
        <span className="ml-3 text-sm font-medium">{children}</span>
    </button>
);

// --- Main Component ---

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onSwitchToReset }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter(); // Initialize the router hook

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: '' });
        }
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newErrors: { [key: string]: string } = {};
        if (!formData.email) newErrors.email = 'Email is required.';
        if (!formData.password) newErrors.password = 'Password is required.';
        
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        signInWithEmailAndPassword(formData.email, formData.password);
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle();
    };

    useEffect(() => {
        const authError = error || googleError;
        if (authError) {
            let newErrors: { [key: string]: string } = {};
            if (authError.message.includes('user-not-found') || authError.message.includes('invalid-email')) {
                newErrors.email = 'Invalid email address.';
            } else if (authError.message.includes('wrong-password')) {
                newErrors.password = 'Incorrect password. Please try again.';
            } else {
                newErrors.general = 'Invalid credentials. Please try again.';
            }
            setFormErrors(newErrors);
        }
    }, [error, googleError]);

    // Handle successful user login
    useEffect(() => {
        if (user || googleUser) {
            console.log('User signed in successfully:', user || googleUser);
            // CORRECTED: Use the URL path, not the file system path
            router.push('/dashboard');
        }
    }, [user, googleUser, router]);

    return (
        <form onSubmit={handleSubmit} noValidate>
            {formErrors.general && <p className="text-red-400 text-sm font-semibold mb-4 text-center">{formErrors.general}</p>}

            <Input id="email" label="Email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} error={formErrors.email} />
            <PasswordInput id="password" label="Password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={formErrors.password} />
            <div className="text-right mb-6">
                <button type="button" onClick={onSwitchToReset} className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline">
                    Forgot Password?
                </button>
            </div>
            <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                disabled={loading || googleLoading}
            >
                {(loading || googleLoading) ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                    'Sign In'
                )}
            </button>
            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-sm">Or continue with</span>
                <div className="flex-grow border-t border-slate-700"></div>
            </div>
            <div className="space-y-3">
                <SocialButton icon={<GoogleIcon />} onClick={handleGoogleSignIn}>
                    Sign in with Google
                </SocialButton>
            </div>
            <p className="text-center text-sm text-slate-400 mt-8">
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignup} className="font-semibold text-indigo-400 hover:underline">
                    Sign Up
                </button>
            </p>
        </form>
    );
};

export default LoginForm;
