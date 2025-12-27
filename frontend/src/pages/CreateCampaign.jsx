import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Layout, DollarSign, Send, AlertCircle, FileText, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

const CreateCampaign = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal_amount: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user || !user.token) {
            setError('Your session has expired. Please log in again.');
            return;
        }

        if (user.role !== 'STUDENT' && user.role !== 'PARENT') {
            setError('Only students or parents can launch campaigns.');
            return;
        }

        setLoading(true);

        try {
            await axios.post('http://localhost:8000/campaigns/', {
                ...formData,
                goal_amount: parseInt(formData.goal_amount)
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid session or token expired. Please log out and log in again.');
            } else {
                setError(err.response?.data?.detail || 'Failed to create campaign. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="py-20 text-center container">
                <div className="card glass p-12 max-w-xl mx-auto shadow-2xl rounded-[3rem] border-slate-100 dark:border-slate-800">
                    <AlertCircle className="w-16 h-16 text-teal-600 opacity-20 mx-auto mb-6" />
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Access Restricted</h2>
                    <p className="text-secondary font-medium text-lg mb-10">You need to be logged in as a student to launch an educational campaign.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary px-10 py-4 text-sm uppercase tracking-widest font-black">Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-20 container max-w-4xl">
            {/* Header / Navigation */}
            <div className="mb-12">
                <Link to="/dashboard" className="inline-flex items-center gap-3 text-secondary font-bold mb-10 hover:text-teal-600 transition-all group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors border border-slate-100 dark:border-slate-700">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span>Back to Dashboard</span>
                </Link>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-teal-600 font-black uppercase tracking-[0.3em] text-[10px]">
                        <Sparkles className="w-4 h-4" />
                        <span>Empower Your Future</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                        Launch <span className="text-teal-600">Campaign</span>
                    </h1>
                    <p className="text-base text-secondary font-medium max-w-xl leading-relaxed">
                        Share your story with the community and unlock support for your educational goals.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Form Side */}
                <div className="lg:col-span-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                        {error && (
                            <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Campaign Title */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">Campaign Title</label>
                                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-500/10">Required</span>
                                </div>
                                <div className="input-wrapper relative">
                                    <Layout className="w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        className="pl-14 py-4 text-base font-bold border-2 border-slate-100 dark:border-slate-800 focus:border-teal-500 transition-all rounded-xl w-full"
                                        placeholder="e.g. Tuition Fees for Computer Science Degree"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Campaign Description */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">Your Story (Description)</label>
                                </div>
                                <div className="input-wrapper relative">
                                    <FileText className="w-5 h-5 absolute left-5 !top-6 !transform-none text-slate-400" />
                                    <textarea
                                        required
                                        rows="5"
                                        className="pl-14 py-5 pr-5 text-base font-medium border-2 border-slate-100 dark:border-slate-800 focus:border-teal-500 transition-all rounded-2xl w-full resize-none leading-relaxed bg-transparent"
                                        placeholder="Tell your story. Why do you need this support?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <p className="text-[9px] font-medium text-secondary opacity-40 px-1 italic">TIP: Be personal and specific. People love supporting dedicated students.</p>
                            </div>

                            {/* Goal Amount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 px-0.5">Target Goal Amount ($)</label>
                                    <div className="input-wrapper relative">
                                        <DollarSign className="w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            required
                                            className="pl-14 py-4 text-lg font-black border-2 border-slate-100 dark:border-slate-800 focus:border-teal-500 transition-all rounded-xl w-full"
                                            placeholder="5000"
                                            value={formData.goal_amount}
                                            onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center p-5 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800 h-[60px] gap-1.5">
                                    <div className="flex items-center gap-2 text-teal-600">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">Trust & Transparency</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-secondary leading-tight opacity-70">Verified fund tracking maintains community trust.</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-5 text-lg justify-center rounded-2xl shadow-xl shadow-teal-500/10 active:scale-[0.98] transition-all group"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-black uppercase tracking-widest text-xs">Deploying...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-black uppercase tracking-widest text-xs">Launch My Campaign</span>
                                            <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
