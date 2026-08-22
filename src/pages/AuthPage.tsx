import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  defaultMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const determineIsSignUp = () => {
    if (location.pathname === '/register' || location.pathname === '/signup') return true;
    if (location.pathname === '/login') return false;
    if (defaultMode) return defaultMode === 'signup';
    return searchParams.get('mode') === 'signup';
  };

  const [isSignUp, setIsSignUp] = useState<boolean>(determineIsSignUp());

  useEffect(() => {
    setIsSignUp(determineIsSignUp());
  }, [location.pathname, searchParams, defaultMode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Mirrors the server-side rules in server.ts so obviously invalid input is
  // caught instantly instead of round-tripping to the API first.
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || (isSignUp && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (isSignUp) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        setError('Password must contain at least one letter and one number.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const res = await signup(trimmedEmail, name.trim(), password);
        if (!res.success) {
          setError(res.error || 'Failed to sign up.');
        } else {
          navigate('/dashboard');
        }
      } else {
        const res = await login(trimmedEmail, password);
        if (!res.success) {
          setError(res.error || 'Failed to log in.');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 dark:bg-indigo-600/20 text-white dark:text-indigo-400 mb-3 shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isSignUp ? 'Create your InterviewAI account' : 'Welcome back to InterviewAI'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
            {isSignUp
              ? 'Join thousands of candidates mastering technical and behavioral mock interviews.'
              : 'Sign in to access your interview dashboard and session analytics.'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={isSignUp ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
              />
            </div>
            {isSignUp && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                At least 8 characters, with a letter and a number.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                Sign up free
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
