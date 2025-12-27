import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Heart, Sparkles } from 'lucide-react';
import axios from 'axios';

const DonationModal = ({ isOpen, onClose, campaign, onDonateSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(`http://localhost:8000/campaigns/${campaign.id}/donate`, {
                amount: parseInt(amount)
            });
            onDonateSuccess();
            onClose();
            setAmount('');
        } catch (err) {
            setError('Failed to process donation. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl z-[101] border border-slate-100 dark:border-slate-800"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Heart className="w-8 h-8 text-teal-500 fill-current" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Support {campaign?.title}</h3>
                            <p className="text-secondary font-medium italic">Make a difference today</p>
                        </div>

                        {error && (
                            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-group">
                                <label className="block text-sm font-black mb-2 ml-1">Donation Amount ($)</label>
                                <div className="input-wrapper">
                                    <DollarSign className="w-5 h-5" />
                                    <input
                                        type="number"
                                        required
                                        placeholder="Enter amount (e.g. 50)"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="text-lg font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 text-xl justify-center group shadow-xl shadow-teal-500/20"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        <span>Confirm Donation</span>
                                        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-secondary mt-6 font-bold uppercase tracking-widest opacity-50">
                            Secure payment powered by EduRelief
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DonationModal;
