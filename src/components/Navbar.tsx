import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AudioSettingsModal } from './AudioSettingsModal';
import {
  Sparkles,
  Bot,
  LayoutDashboard,
  PlayCircle,
  History,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Sliders,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
              <Bot className="w-5 h-5 text-indigo-400 dark:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Interview<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1 tracking-wider uppercase">
                Mock Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/dashboard')
                      ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/track-selection"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/track-selection')
                      ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-emerald-500" />
                  <span>Role Tracks</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-extrabold">
                    10 Roles
                  </span>
                </Link>

                <Link
                  to="/history"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/history')
                      ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <History className="w-4 h-4 text-purple-500" />
                  Session History
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/profile')
                      ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-pink-500" />
                  Profile & Resume
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive('/admin')
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1">
                <a
                  href="#features"
                  className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                >
                  Features
                </a>

                <Link
                  to="/track-selection"
                  className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Interview Tracks</span>
                  <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-extrabold border border-indigo-200 dark:border-indigo-800">
                    FAANG
                  </span>
                </Link>

                <a
                  href="#features"
                  className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                >
                  Company Presets
                </a>

                <a
                  href="#features"
                  className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                >
                  Practice Tips
                </a>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsAudioSettingsOpen(true)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Audio & Microphone Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{user.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{user.role}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Dashboard
              </Link>
              <Link
                to="/track-selection"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
              >
                <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Start New Interview
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
              >
                <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
              >
                <UserIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-semibold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
      {/* Audio & Mic Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
      />
    </nav>
  );
};
