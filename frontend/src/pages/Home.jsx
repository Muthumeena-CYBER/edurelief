import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Heart, Sparkles, CheckCircle2, DollarSign, BookOpen, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState({ isOpen: false, title: '', message: '' });
    const { user } = useAuth();
    const location = useLocation();
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

    const scrollToCampaigns = () => {
        const element = document.getElementById('campaigns-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (location.hash === '#campaigns' && !loading) {
            scrollToCampaigns();
        }
    }, [location, loading]);

    const openModal = (title, message) => {
        setModalData({ isOpen: true, title, message });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Modal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ ...modalData, isOpen: false })}
                title={modalData.title}
                message={modalData.message}
            />

            {/* Hero Section */}
            <main className="flex-1">
                <section className="container py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                                <Sparkles className="w-4 h-4" /> Global Education Relief
                            </div>

                            <h1 className="mb-8 leading-tight">
                                Every Student <br />
                                <span className="text-teal-600">Deserves Support</span>
                            </h1>

                            <p className="text-xl text-secondary mb-12 max-w-lg font-medium leading-relaxed">
                                Connecting brilliant minds with the support they need.
                                Secure funding for education or mentor a future leader.
                            </p>

                            <div className="flex flex-wrap gap-8">
                                {user ? (
                                    <>
                                        <Link to="/dashboard" className="btn-primary py-5 px-10 text-lg shadow-xl shadow-teal-500/20">
                                            <LayoutDashboard className="w-6 h-6" />
                                            <span>Go to Dashboard</span>
                                        </Link>
                                        <button
                                            onClick={scrollToCampaigns}
                                            className="flex items-center gap-2 font-black text-secondary hover:text-teal-600 transition-colors px-4"
                                        >
                                            Browse Stories <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={scrollToCampaigns} className="btn-primary py-5 px-10 text-lg shadow-xl shadow-teal-500/20">
                                            <Heart className="w-6 h-6 fill-current" />
                                            <span>Support a Student</span>
                                        </button>
                                        <Link
                                            to="/register"
                                            className="flex items-center gap-2 font-black text-secondary hover:text-teal-600 transition-colors px-4"
                                        >
                                            Join Community <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        <div className="hidden lg:block relative">
                            <div className="absolute -inset-10 bg-teal-500/5 blur-3xl rounded-full"></div>
                            <div className="card glass p-12 relative border border-white/20 shadow-2xl space-y-12 rounded-[3rem]">
                                <div className="grid grid-cols-3 gap-8 text-center px-4">
                                    <div className="space-y-3">
                                        <div className="text-4xl font-black text-teal-600">50K+</div>
                                        <div className="text-xs font-black text-secondary uppercase tracking-widest">Students</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-4xl font-black text-teal-600">$2M+</div>
                                        <div className="text-xs font-black text-secondary uppercase tracking-widest">Raised</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-4xl font-black text-teal-600">1K+</div>
                                        <div className="text-xs font-black text-secondary uppercase tracking-widest">Mentors</div>
                                    </div>
                                </div>
                                <div className="pt-10 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap justify-between gap-6">
                                    {["Verified", "Secure", "Transparent"].map(text => (
                                        <div key={text} className="flex items-center gap-2 text-sm font-bold text-secondary">
                                            <CheckCircle2 className="w-5 h-5 text-teal-600" /> {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Campaigns Grid */}
                <section id="campaigns-section" className="container py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-[4rem] mb-20">
                    <div className="flex justify-between items-end mb-16 px-6">
                        <div className="space-y-3">
                            <h2 className="tracking-tight leading-none">Live Campaigns</h2>
                            <p className="text-secondary text-lg font-medium opacity-80">Support students striving for academic excellence.</p>
                        </div>
                        <Link to="/campaigns" className="text-teal-600 font-bold hover:underline flex items-center gap-2 p-2 px-6 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                            View all <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 card bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2.5rem]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-2">
                            {campaigns.map((campaign) => {
                                const prog = Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100));
                                return (
                                    <motion.div
                                        key={campaign.id}
                                        whileHover={{ y: -10 }}
                                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                        className="card p-8 flex flex-col gap-6 cursor-pointer border-transparent hover:border-teal-500/20 group rounded-[2.5rem]"
                                    >
                                        <div className="h-56 bg-slate-100/50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                            <Sparkles className="w-16 h-16 text-teal-600 opacity-10 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="line-clamp-1 group-hover:text-teal-600 transition-colors tracking-tight text-2xl uppercase font-black">{campaign.title}</h3>
                                            <p className="text-secondary line-clamp-2 font-medium leading-relaxed opacity-80">{campaign.description}</p>
                                        </div>
                                        <div className="space-y-4 pt-4">
                                            <div className="flex justify-between text-sm font-black text-secondary">
                                                <span className="text-teal-600 text-lg">${campaign.current_amount} raised</span>
                                                <span className="self-end">{prog}%</span>
                                            </div>
                                            <div className="progress-container h-2.5">
                                                <div className="progress-bar" style={{ width: `${prog}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="pt-6 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-black text-secondary uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-teal-600" /> Backers Init
                                            </div>
                                            <span className="text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">Details <ArrowRight className="w-4 h-4" /></span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="container py-12 border-t border-slate-200 dark:border-slate-800 text-center">
                <p className="text-sm font-bold text-secondary opacity-60">
                    © 2025 EduRelief. All rights reserved. Built for students, by the community.
                </p>
            </footer>
        </div>
    );
};

export default Home;
