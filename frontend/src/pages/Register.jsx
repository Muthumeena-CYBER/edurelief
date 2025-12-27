import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, ArrowRight, UserCircle } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(email, password, role);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-20 flex items-center justify-center container min-h-[calc(100vh-100px)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card glass p-8 md:p-10 w-full max-w-md shadow-2xl rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Join EduRelief</h1>
                    <p className="text-base text-secondary font-medium italic opacity-70">Start your educational journey today</p>
                </div>

                {error && (
                    <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 ml-1">Email Address</label>
                        <div className="input-wrapper relative">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="pl-14 py-4 text-base font-bold border-2 border-slate-100 dark:border-slate-800 focus:border-teal-500 rounded-xl w-full bg-slate-50 dark:bg-slate-800/50 transition-all"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 ml-1">Secure Password</label>
                        <div className="input-wrapper relative">
                            <Lock className="w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                className="pl-14 py-4 text-base font-bold border-2 border-slate-100 dark:border-slate-800 focus:border-teal-500 rounded-xl w-full bg-slate-50 dark:bg-slate-800/50 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 ml-1">I am a...</label>
                        <div className="input-wrapper relative">
                            <UserCircle className="w-5 h-5 text-slate-400" />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="pl-14 py-4 text-base font-bold border-2 border-slate-100 dark:border-slate-800 focus:border-teal-500 rounded-xl w-full appearance-none bg-slate-50 dark:bg-slate-800/50 transition-all cursor-pointer"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="DONOR">Donor</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <ArrowRight className="w-4 h-4 rotate-90 text-slate-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.2em] justify-center group mt-4 rounded-2xl shadow-xl shadow-teal-500/10 active:scale-[0.98] transition-all"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="font-black uppercase tracking-widest text-xs">Joining...</span>
                            </div>
                        ) : (
                            <>
                                <span className="font-black uppercase tracking-widest text-xs">Create Account</span>
                                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-[11px] font-bold text-secondary">
                    Already part of the community?{' '}
                    <Link to="/login" className="text-teal-600 hover:opacity-70 inline-flex items-center gap-1 transition-all">
                        Sign In <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
