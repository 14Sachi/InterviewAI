import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InterviewSession, TrackType } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  History,
  Search,
  Filter,
  TrendingUp,
  ChevronRight,
  Sparkles,
  PlayCircle,
  FileText,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
          setFilteredSessions(data.sessions || []);
        }
      } catch (err) {
        console.error('Failed to load history sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user, token, navigate]);

  // Filter effect
  useEffect(() => {
    let result = sessions;
    if (selectedTrack !== 'ALL') {
      result = result.filter((s) => s.track === selectedTrack);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.track.toLowerCase().includes(term) ||
          s.difficulty.toLowerCase().includes(term) ||
          (s.jobDescription && s.jobDescription.toLowerCase().includes(term))
      );
    }
    setFilteredSessions(result);
  }, [searchTerm, selectedTrack, sessions]);

  // Chart Data: chronologically ordered scores
  const chartData = [...sessions]
    .filter((s) => s.status === 'completed' && s.overallScore !== undefined)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((s) => ({
      date: new Date(s.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: s.overallScore || 0,
      track: s.track,
    }));

  if (isLoading) {
    return (
      <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-900 rounded-2xl w-full border border-slate-300 dark:border-slate-800" />
        <div className="h-64 bg-slate-200 dark:bg-slate-900 rounded-3xl w-full border border-slate-300 dark:border-slate-800" />
        <div className="h-16 bg-slate-200 dark:bg-slate-900 rounded-2xl w-full border border-slate-300 dark:border-slate-800" />
        <div className="h-80 bg-slate-200 dark:bg-slate-900 rounded-3xl w-full border border-slate-300 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2 border border-indigo-200/80 dark:border-indigo-500/30">
            <History className="w-3.5 h-3.5" />
            Interview Practice Log
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Interview Session History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Review your past mock sessions and track score progression</p>
        </div>

        <Link
          to="/track-selection"
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
        >
          <PlayCircle className="w-4 h-4 text-emerald-400" />
          Start New Practice Round
        </Link>
      </div>

      {/* Score Trend Line Chart Across All Sessions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Overall Performance Trend Over Time
        </h3>

        <div className="h-56 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-medium">
              Complete more sessions to render historical progress trend line.
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history by role or stack..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-slate-900 dark:focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-2.5 outline-none focus:border-slate-900 dark:focus:border-indigo-500 font-bold"
          >
            <option value="ALL">All Tracks</option>
            <option value="SDE">Software Engineer (SDE)</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Product Manager">Product Manager</option>
            <option value="HR/Behavioral">HR / Behavioral</option>
          </select>
        </div>
      </div>

      {/* Sessions History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs overflow-x-auto">
        {filteredSessions.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Track Role</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 font-medium">
              {filteredSessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                    <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded border border-indigo-200/80 dark:border-indigo-500/20 mr-2 font-bold">
                      {s.track}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-bold">{s.difficulty}</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4">
                    {s.status === 'completed' ? (
                      <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded text-[11px] font-extrabold border border-emerald-200/60 dark:border-transparent">
                        Completed
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded text-[11px] font-extrabold border border-amber-200/60 dark:border-transparent animate-pulse">
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-black text-indigo-700 dark:text-indigo-300 text-sm">
                    {s.overallScore !== undefined ? `${s.overallScore}%` : '—'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={s.status === 'completed' ? `/results/${s.id}` : `/interview/${s.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-indigo-600/20 text-slate-900 dark:text-indigo-300 hover:bg-slate-900 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      <span>{s.status === 'completed' ? 'View Feedback' : 'Resume'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm space-y-3 font-medium">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p>No matching interview history found.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
};
