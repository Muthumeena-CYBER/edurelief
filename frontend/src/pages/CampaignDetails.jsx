import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Users, Calendar, Share2, DollarSign, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const CampaignDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [donating, setDonating] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

    const fetchCampaign = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/campaigns/${id}`);
            setCampaign(response.data);
        } catch (err) {
            console.error("Failed to fetch campaign", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaign();
    }, [id]);

    const handleDonate = async (e) => {
        e.preventDefault();
        const donationAmount = parseInt(amount);
        if (!donationAmount || donationAmount <= 0) return;

        setDonating(true);
        try {
            await axios.post(`http://localhost:8000/campaigns/${id}/donate`, {
                amount: donationAmount
            });
            setModal({
                isOpen: true,
                title: 'Success!',
                message: `Thank you for supporting this campaign. You've successfully donated $${donationAmount}.`
            });
            setAmount('');
            fetchCampaign();
        } catch (err) {
            console.error(err);
        } finally {
            setDonating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="container py-20 text-center">
                <h2 className="mb-4">Campaign not found</h2>
                <Link to="/" className="text-teal-600 font-bold">Return Home</Link>
            </div>
        );
    }

    const progress = Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100));

    const handleShare = () => {
        const url = window.location.href;
        const text = `Check out this educational campaign on EduRelief: ${campaign.title}`;

        if (navigator.share) {
            navigator.share({
                title: campaign.title,
                text: text,
                url: url
            }).catch(() => {
                // User cancelled or error, fallback to whatsapp
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        }
    };

    return (
        <div className="container py-8 md:py-16">
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
            />

            <Link to="/" className="inline-flex items-center gap-3 text-secondary font-bold mb-12 hover:text-teal-600 transition-colors group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-lg">Back to Campaigns</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-details gap-20 items-start">

                {/* Content Side */}
                <div className="flex flex-col gap-6">
                    <div className="card h-[160px] flex items-center justify-center bg-teal-50/10 dark:bg-slate-800/50 rounded-[2.5rem] overflow-hidden relative border-teal-500/5">
                        <Sparkles className="w-20 h-20 text-teal-600 opacity-10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-teal-500/10 rounded-full shadow-lg shadow-teal-500/5">
                                <span className="text-sm font-black uppercase tracking-[0.3em] text-teal-600 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5" /> Education Funding
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h1 className="text-slate-900 dark:text-white tracking-tighter leading-tight text-5xl md:text-6xl lg:text-7xl uppercase">
                                {campaign.title}
                            </h1>

                            <div className="flex flex-wrap gap-16 py-12 mb-8 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <Calendar className="w-8 h-8 text-teal-600" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-50">Started</span>
                                        <span className="text-lg font-black text-slate-800 dark:text-slate-200">Dec 2025</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Users className="w-8 h-8 text-teal-600" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-50">Community</span>
                                        <span className="text-lg font-black text-slate-800 dark:text-slate-200">Verified Backers</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="w-8 h-8 text-teal-600" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-50">Trust</span>
                                        <span className="text-lg font-black text-slate-800 dark:text-slate-200">Verified Goal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pb-12">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">About this campaign</h3>
                            <div className="space-y-10">
                                <p className="text-2xl text-secondary font-medium leading-relaxed">
                                    {campaign.description}
                                </p>
                                <div className="p-10 bg-white dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800 italic text-xl text-secondary leading-loose shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    "Education is the path that leads from darkness to light. This educational campaign is dedicated to removing financial barriers for students. We believe in 100% transparency. Every dollar raised goes directly toward the tuition and learning materials required for this specific educational milestone."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Card */}
                <div className="sticky top-32">
                    <div className="card shadow-2xl p-10 md:p-12 border-teal-500/10 flex flex-col gap-10 rounded-[3rem] backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">

                        <div className="space-y-8">
                            <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-8">
                                <div className="flex flex-col">
                                    <span className="text-5xl font-black text-teal-600 tracking-tighter">${campaign.current_amount}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">Raised so far</span>
                                </div>
                                <div className="text-right flex flex-col">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">${campaign.goal_amount}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1 opacity-50">Target Goal</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="progress-container h-4 shadow-inner border border-slate-100 dark:border-slate-800">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="progress-bar rounded-full"
                                    />
                                </div>

                                <div className="flex justify-between text-xs font-black text-secondary uppercase tracking-[0.15em]">
                                    <span className="text-teal-600">{progress}% Completed</span>
                                    <span>{campaign.goal_amount - campaign.current_amount > 0 ? `$${campaign.goal_amount - campaign.current_amount} to go` : 'Goal met!'}</span>
                                </div>
                            </div>
                        </div>

                        {user?.role === 'STUDENT' ? (
                            <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-4">
                                <AlertCircle className="w-8 h-8 text-teal-600 opacity-40" />
                                <p className="text-sm font-bold text-secondary">As a verified student, you can track this campaign's progress but cannot contribute to it directly.</p>
                            </div>
                        ) : !user ? (
                            <div className="space-y-6">
                                <p className="text-sm font-medium text-center text-secondary">Please sign in as a donor to support this student.</p>
                                <Link to="/login" className="btn-primary w-full justify-center py-5 rounded-[2rem]">Sign In to Support</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleDonate} className="flex flex-col gap-8">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1 opacity-60">Custom Support Amount ($)</label>
                                    <div className="input-wrapper">
                                        <DollarSign className="w-6 h-6" />
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            placeholder="Amount (e.g. 50)"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="font-black text-xl"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={donating}
                                    className="btn-primary w-full justify-center py-6 rounded-[2rem] text-xl shadow-2xl shadow-teal-500/25 active:scale-[0.98] transition-all group"
                                >
                                    <Heart className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                                    <span className="font-black leading-none">{donating ? 'Processing...' : 'Support Goal Now'}</span>
                                </button>
                            </form>
                        )}

                        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                                <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
                                <span className="leading-tight">100% Encrypted & Secure Payment System</span>
                            </div>

                            <button
                                onClick={handleShare}
                                className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-[10px] font-black uppercase tracking-[0.25em] text-secondary hover:text-teal-600 hover:bg-teal-50 transition-all group border border-slate-100 dark:border-slate-700/50"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="uppercase">Spread the word</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
