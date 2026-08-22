import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrackType } from '../types';
import {
  Bot,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  X,
  ShieldCheck,
  Lock,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'security' | null>(null);

  const handleTrackClick = (track: TrackType) => {
    if (!user) {
      navigate(`/register?track=${encodeURIComponent(track)}`);
    } else {
      navigate(`/track-selection?track=${encodeURIComponent(track)}`);
    }
  };

  const handlePlatformClick = (path: string) => {
    if (!user && (path === '/dashboard' || path === '/profile' || path === '/history')) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">
              Interview<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            AI-powered mock interview practice with live voice recording, answer evaluation, and personalized career growth feedback.
          </p>
          <div className="flex items-center gap-3 pt-2 text-slate-500 dark:text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Twitter Feed"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="LinkedIn Community"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tracks Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-3 uppercase tracking-wider">
            Practice Tracks
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <button
                onClick={() => handleTrackClick('SDE')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Backend & Systems (SDE)</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('Frontend Engineer')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Frontend Engineering</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('Full Stack Engineer')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Full Stack Engineering</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('Data Scientist')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Data Science & AI</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('DevOps & Cloud')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>DevOps & Cloud Architect</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('Cybersecurity')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Cybersecurity Specialist</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('Product Manager')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Product Management</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTrackClick('HR/Behavioral')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>HR & Behavioral STAR</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
          </ul>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-3 uppercase tracking-wider">
            Platform Features
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <button
                onClick={() => handlePlatformClick('/track-selection')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Live Speech Recognition</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePlatformClick('/dashboard')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Gemini AI Evaluation</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePlatformClick('/profile')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Resume Skill Matching</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePlatformClick('/dashboard')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Score Analytics</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePlatformClick('/history')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5 group"
              >
                <span>Improvement Roadmaps</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
              </button>
            </li>
          </ul>
        </div>

        {/* AI Engine Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-3 uppercase tracking-wider">
            AI Engine
          </h4>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Gemini 3.6 Flash Engine
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Generates context-aware technical, situational, and follow-up questions tailored to your resume and target role.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} InterviewAI Platform. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-3 sm:mt-0 font-bold">
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            onClick={() => setActiveModal('security')}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Security
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link
            to="/admin"
            className="text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-extrabold"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
        </div>
      </div>

      {/* Interactive Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl font-black">Privacy Policy</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  At InterviewAI, your data privacy is paramount. Voice transcripts and resume data uploaded for mock interviews are processed in memory using secure Google Gemini AI endpoints and stored locally to present your historical performance analytics.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-medium">
                  <span className="font-bold block text-slate-900 dark:text-white">Key Guarantees:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Audio recordings are never saved permanently on external public servers.</li>
                    <li>Parsed resume data is strictly scoped to your individual account session.</li>
                    <li>You can permanently delete all account history at any time from your Profile settings.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <FileText className="w-6 h-6" />
                  <h3 className="text-xl font-black">Terms of Service</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  InterviewAI provides an AI-based practice tool intended for personal interview preparation and educational enhancement.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-medium">
                  <span className="font-bold block text-slate-900 dark:text-white">Service Guidelines:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Scores and feedback generated by Gemini AI are recommendations for self-improvement and do not guarantee employment offers.</li>
                    <li>Users agree not to submit unlawful, toxic, or offensive content during mock interview sessions.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeModal === 'security' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-6 h-6" />
                  <h3 className="text-xl font-black">Security Infrastructure</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Our application uses modern JWT token authentication, encrypted HTTPS communication channels, and server-side API proxying to keep AI API keys secure.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-medium">
                  <span className="font-bold block text-slate-900 dark:text-white">Protective Measures:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Server-side Gemini proxy preventing client-side API key exposure.</li>
                    <li>Bcrypt password hashing for user accounts.</li>
                    <li>Role-based access controls for candidate vs administrator access.</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
