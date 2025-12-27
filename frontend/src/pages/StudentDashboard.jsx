import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, BookOpen, Clock, CheckCircle2, ArrowRight, Sparkles, TrendingUp, Zap, Heart, Users, Calendar, ShieldCheck, LayoutDashboard, ChevronDown, ChevronUp, Trash2, ExternalLink, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedISA, setExpandedISA] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    const mockISAs = [
        {
            id: 1,
            title: "Full-Stack Engineering ISA",
            provider: "Academy",
            duration: "6 Months",
            share: "10%",
            minIncome: "$40k",
            applicationUrl: "https://www.ycombinator.com/apply",
            requirements: [
                "Must have completed high school",
                "Basic understanding of logic & math",
                "Commitment to 30 hours/week of study",
                "No prior student loan defaults"
            ]
        },
        {
            id: 2,
            title: "Data Science Specialization",
            provider: "TechFlow",
            duration: "4 Months",
            share: "8%",
            minIncome: "$35k",
            applicationUrl: "https://www.bloomtech.com/courses/data-science",
            requirements: [
                "Prior knowledge of Python (basics)",
                "Interest in statistical analysis",
                "Own a laptop with 8GB+ RAM",
                "Available for evening live sessions"
            ]
        }
    ];

    const fetchMyCampaigns = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/campaigns/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyCampaigns(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCampaigns();
    }, []);

    const handleDelete = async (campaignId) => {
        if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/campaigns/${campaignId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyCampaigns(prev => prev.filter(c => c.id !== campaignId));
        } catch (err) {
            console.error("Failed to delete campaign", err);
            alert("Failed to delete campaign. Please try again.");
        }
    };

    const generateHistory = () => {
        const history = [
            { id: 'h1', type: 'security', title: 'Security', message: 'Residency documents verified.', time: 'Yesterday' },
        ];

        myCampaigns.forEach(c => {
            // Campaign Creation
            history.push({
                id: `create-${c.id}`,
                type: 'create',
                title: 'Campaign Created',
                message: `Started campaign: "${c.title}"`,
                time: 'Dec 2025'
            });

            // If has funds, show support
            if (c.current_amount > 0) {
                history.push({
                    id: `don-${c.id}`,
                    type: 'support',
                    title: 'New Support',
                    message: `Received contributions for "${c.title}"`,
                    time: 'Recent'
                });
            }

            if (c.is_verified) {
                history.push({
                    id: `ver-${c.id}`,
                    type: 'verify',
                    title: 'Verified',
                    message: `"${c.title}" has been community verified.`,
                    time: 'Verified'
                });
            }
        });

        return history;
    };

    const HistoryModal = () => (
        <AnimatePresence>
            {showHistory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowHistory(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
                    >
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-600 rounded-xl text-white">
                                    <History className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Account History</h2>
                            </div>
                            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6 custom-scrollbar">
                            {generateHistory().length > 0 ? (
                                generateHistory().map((item) => (
                                    <div key={item.id} className="flex gap-4 items-start pb-6 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${item.type === 'support' ? 'bg-teal-50 text-teal-600' :
                                            item.type === 'security' ? 'bg-amber-50 text-amber-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {item.type === 'support' ? <Zap className="w-5 h-5" /> :
                                                item.type === 'security' ? <ShieldCheck className="w-5 h-5" /> :
                                                    <Clock className="w-5 h-5" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`font-black uppercase text-[10px] tracking-widest ${item.type === 'support' ? 'text-teal-600' : 'text-slate-400'
                                                    }`}>{item.title}</span>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.message}</p>
                                            </div>
                                            <span className="text-[9px] font-black text-secondary opacity-40 uppercase tracking-widest">{item.time}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-secondary font-medium">No history items found yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="container py-8 md:py-16">
            <HistoryModal />
            {/* Header Section - COMPACTED SPACING */}
            <header className="mb-8">
                <div className="inline-flex items-center gap-2 mb-2">
                    <LayoutDashboard className="w-4 h-4 text-teal-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary opacity-60">Account Hub</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                    Student <span className="text-teal-600">Dashboard</span>
                </h1>
            </header>

            {/* HALF AND HALF GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                {/* Left Side (50%) */}
                <div className="flex flex-col gap-12">

                    {/* My Campaigns Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black uppercase tracking-tight">My Campaigns</h2>
                            <Link to="/create-campaign" className="btn-primary py-2 px-4 text-[10px] uppercase font-black tracking-widest">
                                <Plus className="w-4 h-4" /> Create New
                            </Link>
                        </div>

                        {loading ? (
                            <div className="h-64 card animate-pulse bg-slate-50 border-none rounded-[2.5rem]"></div>
                        ) : myCampaigns.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {myCampaigns.map(campaign => {
                                    const prog = Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100));
                                    return (
                                        <div key={campaign.id} className="card p-10 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 flex flex-col gap-8 group relative overflow-hidden">
                                            <div className="flex justify-between items-center">
                                                <Sparkles className="w-8 h-8 text-teal-600" />
                                                <div className="flex items-center gap-3">
                                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${!campaign.is_active ? 'bg-amber-100 text-amber-700' : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600'}`}>
                                                        {!campaign.is_active ? 'Goal Reached' : 'Active'}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(campaign.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Delete Campaign"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-teal-600 transition-colors uppercase">{campaign.title}</h3>
                                                <p className="text-sm text-secondary font-medium italic opacity-70">"{campaign.description}"</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                                                <div>
                                                    <div className="text-2xl font-black text-slate-800 dark:text-slate-200">${campaign.current_amount}</div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40">Raised</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-black text-teal-600">{prog}%</div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40">Target</div>
                                                </div>
                                            </div>
                                            <Link to={`/campaigns/${campaign.id}`} className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-colors">
                                                View Live Progress <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    {/* ISA Section - UPDATED WITH MORE DETAILS */}
                    <div className="space-y-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-black uppercase tracking-tight">ISA Programs</h2>
                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary opacity-40">Income Share Agreements</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            {mockISAs.map(isa => (
                                <div key={isa.id} className={`card p-6 rounded-[2rem] border-2 transition-all ${expandedISA === isa.id ? 'border-teal-500/30 bg-teal-50/5' : 'border-slate-50 dark:border-slate-800 hover:border-teal-500/10'}`}>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center border border-teal-500/10 shrink-0">
                                                <BookOpen className="w-6 h-6 text-teal-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-teal-600 transition-colors leading-none mb-1">{isa.title}</h4>
                                                <p className="text-[9px] font-black text-secondary opacity-60 uppercase">{isa.provider} • {isa.duration}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setExpandedISA(expandedISA === isa.id ? null : isa.id)}
                                            className="btn-primary py-2.5 px-6 text-[9px] uppercase font-black tracking-widest bg-slate-100 dark:bg-slate-800 text-secondary hover:text-white"
                                        >
                                            {expandedISA === isa.id ? 'Close Details' : 'More Details'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {expandedISA === isa.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-6 mb-8">
                                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                        <div className="text-xl font-black text-teal-600">{isa.share}</div>
                                                        <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Income Share</div>
                                                    </div>
                                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                        <div className="text-xl font-black text-slate-800 dark:text-slate-200">{isa.minIncome}</div>
                                                        <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Threshold</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-8">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 dark:bg-teal-900/30 w-fit px-3 py-1 rounded-full">Requirements to Claim</h5>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {isa.requirements.map((req, idx) => (
                                                            <li key={idx} className="flex items-center gap-3 text-sm font-medium text-secondary">
                                                                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                                                                {req}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <button
                                                    onClick={() => window.open(isa.applicationUrl, '_blank')}
                                                    className="btn-primary w-full justify-center py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-teal-500/10 flex items-center gap-2"
                                                >
                                                    Proceed to Application <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side (50%) */}
                <div className="flex flex-col gap-12">

                    {/* Recent Updates */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight">Recent Updates</h2>
                        <div className="card p-6 rounded-[2rem] space-y-5 bg-white dark:bg-slate-900/50 border-2 border-slate-50 dark:border-slate-800">
                            <div className="flex gap-4 items-start pb-5 border-b border-slate-50 dark:border-white/5">
                                <div className="p-2 bg-teal-50 dark:bg-teal-900/40 rounded-lg shrink-0">
                                    <Zap className="w-4 h-4 text-teal-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-teal-600 font-black uppercase text-[9px] tracking-widest">New Support</span>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Received $50 donation.</p>
                                    </div>
                                    <span className="text-[8px] font-black text-secondary opacity-40 uppercase tracking-widest">2 Hours Ago</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-secondary opacity-40" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-secondary font-black uppercase text-[9px] tracking-widest">Security</span>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Documents verified.</p>
                                    </div>
                                    <span className="text-[8px] font-black text-secondary opacity-40 uppercase tracking-widest">Yesterday</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="w-full py-2.5 text-[9px] font-black uppercase tracking-widest text-secondary hover:text-teal-600 border border-slate-100 dark:border-slate-800 rounded-lg transition-all mt-2"
                            >
                                View History
                            </button>
                        </div>
                    </div>

                    {/* Profile Stats */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight">Profile Stats</h2>
                        <div className="card p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden shadow-xl border-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                            <div className="flex items-center gap-4 mb-12 relative z-10 p-5 bg-white/5 rounded-3xl border border-white/5">
                                <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center border border-teal-500/20">
                                    <CheckCircle2 className="w-8 h-8 text-teal-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-black uppercase tracking-tight leading-none">Verified Student</span>
                                    <span className="text-[8px] uppercase font-black tracking-[0.2em] text-teal-400 opacity-50 mt-1">Status Active</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 relative z-10">
                                <div>
                                    <div className="text-3xl font-black text-teal-400 tracking-tighter leading-none">$1,200</div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-1.5">Lifetime Contributions</div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                    <div className="space-y-1">
                                        <div className="text-xl font-black tracking-tight leading-none">2</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Active Req</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xl font-black tracking-tight leading-none">14</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Backers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
