import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InterviewSession } from '../types';
import { PreparationTips } from '../components/PreparationTips';
import { WeeklyTipNotificationCard } from '../components/WeeklyTipNotificationCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  PlayCircle,
  History,
  Trophy,
  Target,
  Sparkles,
  ArrowUpRight,
  Clock,
  ChevronRight,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
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
        }
      } catch (err) {
        console.error('Failed to fetch dashboard sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user, token, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="bg-slate-200 dark:bg-slate-900/80 rounded-3xl p-8 h-48 w-full flex flex-col justify-between border border-slate-300 dark:border-slate-800" />
        
        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-200 dark:bg-slate-900 p-5 rounded-2xl h-24 w-full border border-slate-300 dark:border-slate-800" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-200 dark:bg-slate-900 rounded-2xl h-72 w-full border border-slate-300 dark:border-slate-800" />
          <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-900 rounded-2xl h-72 w-full border border-slate-300 dark:border-slate-800" />
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter(
    (s) => s.status === 'completed' && s.overallScore !== undefined
  );

  const avgScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((acc, s) => acc + (s.overallScore || 0), 0) /
            completedSessions.length
        )
      : 0;

  // Chart Data: score trend over time (chronological order)
  const chartData = [...completedSessions]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((s, idx) => ({
      sessionNum: `Round #${idx + 1}`,
      date: new Date(s.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: s.overallScore || 0,
      track: s.track,
    }));

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Quick Action */}
      <div className="bg-slate-900 text-white dark:bg-gradient-to-r dark:from-indigo-900/60 dark:via-purple-900/40 dark:to-slate-900 border border-slate-800 dark:border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-indigo-500/20 text-indigo-200 dark:text-indigo-300 text-xs font-semibold border border-white/10 dark:border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Interview Ready Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-medium">
              You've completed <span className="font-bold text-white">{completedSessions.length}</span> practice sessions with an average performance score of <span className="font-bold text-emerald-400">{avgScore}%</span>.
            </p>
          </div>

          <Link
            to="/track-selection"
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white font-extrabold rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm shrink-0"
          >
            <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-emerald-400" />
            Start New Interview Session
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Total Sessions
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{sessions.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Completed
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{completedSessions.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Average Score
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{avgScore}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Performance Status
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {avgScore >= 80 ? 'Interview Ready' : avgScore >= 60 ? 'Developing' : 'Getting Started'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Preparation Tips Section */}
      <PreparationTips />

      {/* Main Grid: Score Trend Mini-Chart & Recent Sessions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Trend Mini Chart (1 col on large) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Score Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Historical performance across practice rounds</p>
            </div>
          </div>

          <div className="h-56 w-full mt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                            <p className="font-bold text-indigo-300">{data.sessionNum} ({data.date})</p>
                            <p className="text-slate-300"><span className="font-semibold text-white">Track:</span> {data.track}</p>
                            <p className="font-black text-emerald-400 text-sm">Score: {data.score}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Target (80%)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Performance Score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, fill: '#6366f1', stroke: '#312e81', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-medium">
                <p>No completed interviews yet.</p>
                <Link to="/track-selection" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-1">
                  Start your first round →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sessions Table (2 cols on large) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl flex flex-col shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Recent Practice Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click any session to view its full transcript and critique</p>
            </div>

            <Link
              to="/history"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
            >
              View All History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {sessions.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Track</th>
                    <th className="py-3 px-3">Difficulty</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
                  {sessions.slice(0, 5).map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => navigate(s.status === 'completed' ? `/results/${s.id}` : `/interview/${s.id}`)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition font-medium"
                    >
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                        <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200/80 dark:border-indigo-500/20 mr-2">
                          {s.track}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{s.difficulty}</td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-3">
                        {s.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-transparent px-2 py-0.5 rounded text-[11px] font-bold">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-transparent px-2 py-0.5 rounded text-[11px] font-bold animate-pulse">
                            In Progress
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-sm">
                        {s.overallScore !== undefined ? (
                          <span className="text-indigo-600 dark:text-indigo-300">{s.overallScore}%</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-500 text-sm font-medium">
                <p>No interview sessions recorded yet.</p>
                <Link
                  to="/track-selection"
                  className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Start First Session
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Practice Email Coaching Tip Card */}
      <WeeklyTipNotificationCard />
    </div>
  </div>
);
};
