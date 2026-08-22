import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Sparkles, Send, CheckCircle2, RefreshCw, AlertCircle, Eye, Calendar, Bell } from 'lucide-react';

export const WeeklyTipNotificationCard: React.FC = () => {
  const { token, user } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [weakCategory, setWeakCategory] = useState<string>('');
  const [tipData, setTipData] = useState<{
    subject: string;
    category: string;
    headline: string;
    coreTip: string;
    actionableExercise: string;
    sampleAnswerSnippet: string;
  } | null>(null);

  const [isSendingTest, setIsSendingTest] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const fetchWeeklyTip = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications/weekly-tip', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled);
        setWeakCategory(data.weakCategory);
        setTipData(data.tip);
      }
    } catch (err) {
      console.error('Failed to load weekly tip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyTip();
  }, [token]);

  const handleSendTestEmail = async () => {
    if (!token) return;
    setIsSendingTest(true);
    setDispatchMessage(null);
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category: weakCategory }),
      });
      if (res.ok) {
        const data = await res.json();
        setDispatchMessage(data.message);
      }
    } catch (err) {
      console.error('Failed to dispatch test email:', err);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Automated Weekly Interview Practice Tip
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Tailored weekly email coaching based on your weakest interview category
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              enabled
                ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{enabled ? 'Subscribed (Weekly)' : 'Emails Paused'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Analyzing recent session analytics & compiling practice tip...</p>
        </div>
      ) : tipData ? (
        <div className="space-y-5">
          {/* Identified Weak Category Banner */}
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-0.5">
                Target Growth Category:
              </span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-amber-200">
                {weakCategory}
              </p>
            </div>

            <button
              onClick={fetchWeeklyTip}
              className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 text-amber-900 dark:text-amber-200 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Tip</span>
            </button>
          </div>

          {/* Generated Email Content Card */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Subject Line:</span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{tipData.subject}</h4>
              </div>

              <button
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-100 transition"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>{showEmailPreview ? 'Hide Full Email' : 'Preview Email'}</span>
              </button>
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">
              "{tipData.headline}"
            </p>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              <p>{tipData.coreTip}</p>
            </div>

            {/* Action Exercise */}
            <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-xl space-y-1.5">
              <span className="text-[10px] font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
                ⚡ 5-Minute Actionable Practice Exercise:
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {tipData.actionableExercise}
              </p>
            </div>

            {/* Full Email Modal or Drawer View */}
            {showEmailPreview && (
              <div className="p-4 bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-3 mt-2 shadow-inner">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>To: {user?.email || 'user@example.com'}</span>
                  <span>•</span>
                  <span>From: tips@prepai.master</span>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-200 space-y-3 font-medium">
                  <p>Hi {user?.name || 'Candidate'},</p>
                  <p>{tipData.coreTip}</p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">Gold-Standard Answer Template:</p>
                  <blockquote className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border-l-4 border-indigo-500 italic text-[11px]">
                    {tipData.sampleAnswerSnippet}
                  </blockquote>
                  <p className="text-[11px] text-slate-500">Keep practicing! You've got this!</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Dispatch Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTest}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              {isSendingTest ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isSendingTest ? 'Dispatching Test Email...' : 'Send Test Tip Email Now'}</span>
            </button>

            {dispatchMessage && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {dispatchMessage}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
