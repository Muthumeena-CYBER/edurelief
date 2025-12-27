import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-20 flex items-center justify-center container">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card glass p-10 md:p-12 w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
                    <p className="text-secondary font-medium">Log in to your account</p>
                </div>

                {error && (
                    <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="block text-sm font-black mb-2 ml-1">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="w-5 h-5" />
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-black mb-2 ml-1">Password</label>
                        <div className="input-wrapper">
                            <Lock className="w-5 h-5" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg justify-center group"
                    >
                        {loading ? 'Logging in...' : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-bold text-secondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-teal-600 hover:underline">
                        Sign up now
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
