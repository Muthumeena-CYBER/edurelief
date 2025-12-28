import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Heart, LogOut, UserRound } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '../context/ThemeContext';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated } = useAuth0();
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

    const navItems = isAuthenticated ? authNavItems : guestNavItems;
    const displayName = user?.name || user?.email || 'User';
    const initial = displayName.charAt(0).toUpperCase();

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

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm text-left">
                                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-black">
                                    {initial || '?'}
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-black">Signed in as</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <UserRound className="w-4 h-4 text-teal-600" />
                                        <span>{displayName}</span>
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/dashboard"
                                className="btn-primary py-2.5 px-5 text-sm rounded-xl font-bold"
                            >
                                <Heart className="w-4 h-4 fill-current" /> <span>Dashboard</span>
                            </Link>
                            <LogoutButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <LoginButton />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
