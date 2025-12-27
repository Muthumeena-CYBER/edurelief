import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Heart, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCampaignsClick = (e) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/#campaigns');
        } else {
            const element = document.getElementById('campaigns-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const guestNavItems = [
        { name: 'Home', path: '/' },
        { name: 'Campaigns', path: '#campaigns', onClick: handleCampaignsClick },
        { name: 'About', path: '/about' },
    ];

    const authNavItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Home', path: '/' },
        { name: 'Campaigns', path: '#campaigns', onClick: handleCampaignsClick },
    ];

    const navItems = user ? authNavItems : guestNavItems;

    return (
        <nav className="glass sticky top-0 z-50 py-4 border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="container flex justify-between items-center gap-6">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 shrink-0 group">
                    <div className="w-12 h-12 flex items-center justify-center p-1.5 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-500/10 shadow-inner overflow-hidden">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="flex flex-col text-slate-900 dark:text-white">
                        <span className="text-xl font-black text-teal-600 leading-tight">EduRelief</span>
                        <span className="text-[9px] uppercase font-black tracking-widest opacity-70">Community</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                    {navItems.map((item) => (
                        item.onClick ? (
                            <a
                                key={item.name}
                                href={item.path}
                                onClick={item.onClick}
                                className={`nav-link-pill drop-shadow-sm ${location.hash === item.path ? 'active' : ''}`}
                            >
                                {item.name}
                            </a>
                        ) : (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nav-link-pill drop-shadow-sm ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 shrink-0">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-secondary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all font-bold"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to={user.role === 'STUDENT' ? "/create-campaign" : "/dashboard"}
                                className="btn-primary py-2.5 px-5 text-sm rounded-xl font-bold"
                            >
                                {user.role === 'STUDENT' ? (
                                    <>
                                        <Heart className="w-4 h-4 fill-current" /> <span>Start Campaign</span>
                                    </>
                                ) : (
                                    <>
                                        <Heart className="w-4 h-4 fill-current" /> <span>Find Students</span>
                                    </>
                                )}
                            </Link>
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors flex items-center gap-2 font-bold"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden xl:inline text-xs">EXIT</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-black text-secondary hover:text-teal-600 px-2 transition-colors">Sign In</Link>
                            <Link to="/register" className="btn-primary py-2.5 px-6 text-sm rounded-xl shadow-lg shadow-teal-500/10">
                                <span className="font-bold">Get Started</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
