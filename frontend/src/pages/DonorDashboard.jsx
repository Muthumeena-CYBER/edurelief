import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Search, Filter, ArrowRight, Sparkles, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get('http://localhost:8000/campaigns/');
            setCampaigns(response.data);
        } catch (err) {
            console.error("Failed to fetch campaigns", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container py-12 md:py-20">
            <header className="mb-24 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-teal-500/10">
                        <TrendingUp className="w-3.5 h-3.5" /> Empowering Futures
                    </div>
                    <h1 className="mb-6">Donor <span className="text-teal-600">Explore</span></h1>
                    <p className="text-xl text-secondary font-medium leading-relaxed">
                        Your contribution makes educational dreams a reality. Browse verified campaigns and support talent globally.
                    </p>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-6">
                    <div className="input-wrapper group min-w-[320px]">
                        <Search className="w-5 h-5 group-focus-within:text-teal-600 transition-colors opacity-50" />
                        <input
                            type="text"
                            placeholder="Find a student or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="py-4 pl-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/20 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-6 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-default">
                            <ShieldCheck className="w-4 h-4 text-teal-600" /> Secure Payments
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2 opacity-60 hover:opacity-100 transition-all cursor-default">
                            <Sparkles className="w-4 h-4 text-teal-600" /> Verified Students
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Campaigns Feed */}
                <div className="lg:col-span-3 space-y-12">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[1, 2, 4].map(i => (
                                <div key={i} className="h-80 card bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {filteredCampaigns.map((campaign) => {
                                const prog = Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100));
                                return (
                                    <motion.div
                                        key={campaign.id}
                                        whileHover={{ y: -8 }}
                                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                        className="card p-8 flex flex-col gap-6 cursor-pointer group hover:border-teal-500/30 transition-all rounded-[2.5rem]"
                                    >
                                        <div className="h-52 bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center relative overflow-hidden">
                                            <Sparkles className="w-16 h-16 text-teal-600 opacity-10 group-hover:scale-125 transition-transform duration-500" />
                                            <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${prog >= 100 ? 'bg-amber-100 text-amber-600' : 'bg-white/90 dark:bg-slate-900/90 text-teal-600'}`}>
                                                {prog >= 100 ? 'Goal Met' : 'Active'}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="line-clamp-1 group-hover:text-teal-600 transition-colors uppercase tracking-tight text-xl">{campaign.title}</h3>
                                            <p className="text-secondary line-clamp-2 font-medium leading-relaxed opacity-70 italic">"{campaign.description}"</p>
                                        </div>
                                        <div className="space-y-4 pt-4 mt-auto">
                                            <div className="flex justify-between items-baseline">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-teal-600">${campaign.current_amount}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary opacity-50">Collected</span>
                                                </div>
                                                <span className="text-xs font-black text-secondary">{prog}%</span>
                                            </div>
                                            <div className="progress-container h-2.5">
                                                <div className="progress-bar rounded-full" style={{ width: `${prog}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black text-secondary uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-teal-600" /> community power
                                            </div>
                                            <span className="text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">Support Now <ArrowRight className="w-4 h-4" /></span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Impact Sidebar */}
                <div className="space-y-8">
                    <div className="card p-10 bg-teal-600 text-white space-y-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Impact Score</span>
                            <div className="text-5xl font-black mt-3">850</div>
                            <p className="text-xs font-bold mt-4 opacity-70 leading-relaxed">
                                You are in the top 10% of donors this month. Keep supporting educational dreams!
                            </p>
                        </div>
                        <div className="space-y-6 pt-8 border-t border-white/20">
                            <div>
                                <div className="text-2xl font-black">$450.00</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">Total Contributions</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black">4</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">Students Supported</div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8 space-y-6 rounded-[2.5rem] bg-amber-50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30">
                        <h4 className="font-black text-amber-800 dark:text-amber-400 flex items-center gap-2 uppercase tracking-tight">
                            <Heart className="w-5 h-5 fill-amber-500 text-amber-500" /> Featured Students
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/30">
                                <p className="text-xs font-black text-amber-600 uppercase mb-1">Scholarship goal</p>
                                <p className="text-sm font-bold leading-tight">Physics major needs help with laboratory equipment fees.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
