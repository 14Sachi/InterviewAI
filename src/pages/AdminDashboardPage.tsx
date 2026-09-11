import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminAnalytics, InterviewSession, User } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ShieldCheck,
  Users,
  Target,
  Trophy,
  Filter,
  HelpCircle,
  BarChart2,
  ListFilter,
  CheckCircle2,
  Lock,
  KeyRound,
  Download,
  RefreshCw,
  Search,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Trash2,
  X,
  Award,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface CandidateDetail {
  user: User;
  resume: {
    fileName: string;
    parsedSkills: string[];
    parsedExperience: string;
    uploadedAt: string;
  } | null;
  sessions: InterviewSession[];
}

export const AdminDashboardPage: React.FC = () => {
  const { user, token, isLoading: isAuthLoading, claimAdminRole, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'candidates' | 'analytics' | 'sessions' | 'questions'>('candidates');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [questionBank, setQuestionBank] = useState<any[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'registered' | 'guests'>('all');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('');

  // Selected Candidate Modal State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [candidateDetail, setCandidateDetail] = useState<CandidateDetail | null>(null);
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);

  // Owner Passkey Gate State
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      setIsRefreshing(true);
      const [resAnalytics, resUsers, resSessions, resBank] = await Promise.all([
        fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/sessions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/question-bank', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (resAnalytics.ok) setAnalytics((await resAnalytics.json()).analytics);
      if (resUsers.ok) setUsersList((await resUsers.json()).users);
      if (resSessions.ok) setSessionsList((await resSessions.json()).sessions);
      if (resBank.ok) setQuestionBank((await resBank.json()).questionBank);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setIsLoading(false);
    }
  }, [user, token, isAuthLoading]);

  const handleClaimOwnership = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasskeyError('');
    setIsClaiming(true);
    try {
      const res = await claimAdminRole(passkeyInput.trim() || 'admin123');
      if (res.success) {
        setPasskeyInput('');
        await fetchAdminData();
      } else {
        setPasskeyError(res.error || 'Invalid passkey');
      }
    } catch (err: any) {
      setPasskeyError(err.message || 'Verification error');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleViewCandidate = async (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsLoadingCandidate(true);
    try {
      const res = await fetch(`/api/admin/users/${candidateId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCandidateDetail(data);
      }
    } catch (err) {
      console.error('Error fetching candidate detail:', err);
    } finally {
      setIsLoadingCandidate(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete candidate ${userName}? This will remove all their sessions and resume data.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        if (selectedCandidateId === userId) {
          setSelectedCandidateId(null);
          setCandidateDetail(null);
        }
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm('Delete this interview session recording?')) return;
    try {
      const res = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSessionsList((prev) => prev.filter((s) => s.id !== sessionId));
        if (candidateDetail) {
          setCandidateDetail({
            ...candidateDetail,
            sessions: candidateDetail.sessions.filter((s) => s.id !== sessionId),
          });
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ users: usersList, sessions: sessionsList, exportedAt: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `interview_ai_candidates_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter candidates
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const isGuest = u.email.includes('@interview.ai') || u.name.includes('Guest');
    if (userFilter === 'registered' && isGuest) return false;
    if (userFilter === 'guests' && !isGuest) return false;

    return matchesSearch;
  });

  // Filter sessions
  const filteredSessions = sessionsList.filter((s) => {
    if (selectedTrackFilter && s.track !== selectedTrackFilter) return false;
    if (selectedDifficultyFilter && s.difficulty !== selectedDifficultyFilter) return false;
    return true;
  });

  // If user is not yet an admin, display the Owner Access Gate
  if (!isAuthLoading && user?.role !== 'admin') {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5" />
              Website Owner Portal
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Dashboard Access</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              This area is reserved exclusively for the platform owner to monitor enrolled candidates, interview transcripts, and performance analytics.
            </p>
          </div>

          {passkeyError && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-3 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{passkeyError}</span>
            </div>
          )}

          <form onSubmit={handleClaimOwnership} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Owner Passkey
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Enter admin passkey (e.g. admin123)"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isClaiming}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isClaiming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-amber-400" />}
              <span>Verify & Open Owner Dashboard</span>
            </button>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-2.5 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span className="font-semibold">Demo Passkey: <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded font-bold">admin123</code></span>
              <button
                type="button"
                onClick={() => {
                  setPasskeyInput('admin123');
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            <span>Logged in as: </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email || 'Guest Visitor'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-900 rounded-3xl p-8 h-36 w-full border border-slate-300 dark:border-slate-800" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-900 p-5 rounded-2xl h-24 w-full border border-slate-300 dark:border-slate-800" />
            ))}
          </div>
          <div className="bg-slate-200 dark:bg-slate-900 rounded-3xl h-96 w-full border border-slate-300 dark:border-slate-800" />
        </div>
      </div>
    );
  }

  const COLORS = ['#4f46e5', '#9333ea', '#10b981', '#ec4899', '#f59e0b', '#06b6d4'];
  const registeredUsersCount = usersList.filter((u) => !u.email.includes('@interview.ai') && !u.name.includes('Guest')).length;
  const guestUsersCount = usersList.length - registeredUsersCount;
  const completedSessionsCount = sessionsList.filter((s) => s.status === 'completed').length;
  const passRate = sessionsList.length > 0
    ? Math.round((sessionsList.filter((s) => (s.overallScore || 0) >= 70).length / sessionsList.length) * 100)
    : 0;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Executive Header Banner */}
        <div className="bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-slate-900 dark:to-indigo-950/50 border border-slate-800 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Website Owner & Admin Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Candidate Enrollments & Live Progress</h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Live monitoring of candidates, practice interview completions, transcripts, and AI evaluations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              title="Export JSON Data"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Records</span>
            </button>

            <button
              onClick={fetchAdminData}
              disabled={isRefreshing}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">Total Enrolled</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{usersList.length}</span>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {registeredUsersCount} registered • {guestUsersCount} guests
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">Interviews Conducted</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{sessionsList.length}</span>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {completedSessionsCount} fully completed
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">Avg Candidate Score</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analytics.avgOverallScore}%</span>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Pass Rate: {passRate}% (≥70%)
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">Role Track Presets</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">10</span>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                SDE, ML, Product, Security...
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: 'candidates', label: `Enrolled Candidates (${usersList.length})`, icon: Users },
            { id: 'sessions', label: `Session Records (${sessionsList.length})`, icon: ListFilter },
            { id: 'analytics', label: 'Charts & Velocity', icon: BarChart2 },
            { id: 'questions', label: 'Question Bank', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CANDIDATES DIRECTORY & PROGRESS */}
        {activeTab === 'candidates' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Enrolled Candidate Progress Directory
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click on any candidate to inspect their complete question transcripts and scores
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search candidate name / email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200/80 dark:border-slate-800">
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    All ({usersList.length})
                  </button>
                  <button
                    onClick={() => setUserFilter('registered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userFilter === 'registered' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Registered ({registeredUsersCount})
                  </button>
                  <button
                    onClick={() => setUserFilter('guests')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userFilter === 'guests' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Guests ({guestUsersCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3">Candidate</th>
                    <th className="py-3.5 px-3">Enrolled Date</th>
                    <th className="py-3.5 px-3">Resume Status</th>
                    <th className="py-3.5 px-3">Interviews</th>
                    <th className="py-3.5 px-3">Average Score</th>
                    <th className="py-3.5 px-3">Latest Activity</th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 font-medium">
                  {filteredUsers.map((u) => {
                    const isGuest = u.email.includes('@interview.ai') || u.name.includes('Guest');
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs text-white ${
                              u.role === 'admin' ? 'bg-amber-500' : 'bg-slate-900 dark:bg-indigo-600'
                            }`}>
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {u.role === 'admin' && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                                    Admin / Owner
                                  </span>
                                )}
                                {isGuest && (
                                  <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-bold">
                                    Guest
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-3">
                          {u.hasResume ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Parsed ({u.resumeSkills?.length || 0} skills)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">No resume</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {u.sessionCount} sessions ({u.completedCount || 0} finished)
                        </td>

                        <td className="py-3.5 px-3">
                          {u.completedCount > 0 ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold ${
                              u.avgScore >= 75
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                : u.avgScore >= 60
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
                            }`}>
                              {u.avgScore}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                          {new Date(u.lastActive).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleViewCandidate(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Dossier</span>
                            </button>

                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                title="Delete Candidate"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No candidates found matching the search query.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SESSION RECORDS & SCORECARDS */}
        {activeTab === 'sessions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Mock Interview Session Records ({sessionsList.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track individual mock interview sessions and jump directly to scorecards
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedTrackFilter}
                  onChange={(e) => setSelectedTrackFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-2.5 outline-none font-bold"
                >
                  <option value="">All Tracks</option>
                  <option value="SDE">SDE</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="HR/Behavioral">HR/Behavioral</option>
                </select>

                <select
                  value={selectedDifficultyFilter}
                  onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-2.5 outline-none font-bold"
                >
                  <option value="">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3">Session ID</th>
                    <th className="py-3.5 px-3">Candidate</th>
                    <th className="py-3.5 px-3">Track & Preset</th>
                    <th className="py-3.5 px-3">Difficulty</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Overall Score</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 font-medium">
                  {filteredSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                        {s.id.substring(0, 10)}...
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{s.candidateName}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{s.candidateEmail}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{s.track}</span>
                        {s.companyPreset && (
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                            {s.companyPreset}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-bold">
                        {s.difficulty}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          s.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-black text-indigo-600 dark:text-indigo-300">
                        {s.overallScore !== undefined ? `${s.overallScore}%` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status === 'completed' && (
                            <Link
                              to={`/results/${s.id}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                            >
                              <span>View Scorecard</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDeleteSession(s.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete Session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSessions.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No interview sessions recorded under this filter yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL ANALYTICS & CHARTS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate signups over time */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-xs">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Candidate Registrations
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">New user signups over time</p>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.signupsOverTime} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sessions per day */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-xs">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Daily Interview Velocity
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Practice sessions initiated per day</p>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.sessionsPerDay} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#9333ea" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track popularity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-xs">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Role Track Popularity
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Distribution of chosen tracks</p>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.trackPopularity}
                      dataKey="count"
                      nameKey="track"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      label={({ track }) => track.substring(0, 10)}
                    >
                      {analytics.trackPopularity.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUESTION BANK */}
        {activeTab === 'questions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Track Question Bank & Calibration Repository
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Curated technical, behavioral, and system design prompts evaluated by Gemini 3.7 Flash
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionBank.map((q, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-extrabold uppercase border border-indigo-200/60 dark:border-indigo-500/30">
                      {q.track} • {q.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">{q.type}</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">"{q.questionText}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATE PROGRESS DOSSIER MODAL / DRAWER */}
        {selectedCandidateId && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                    {candidateDetail?.user.name.substring(0, 2).toUpperCase() || 'CA'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {candidateDetail?.user.name}’s Progress Dossier
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{candidateDetail?.user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCandidateId(null);
                    setCandidateDetail(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingCandidate || !candidateDetail ? (
                <div className="py-16 text-center text-xs text-slate-500 animate-pulse">
                  Loading candidate transcripts and history...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Candidate Resume & Skills Card */}
                  {candidateDetail.resume ? (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          Parsed Resume: {candidateDetail.resume.fileName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Uploaded {new Date(candidateDetail.resume.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {candidateDetail.resume.parsedSkills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold border border-indigo-200/60 dark:border-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-500 text-center">
                      No resume uploaded by this candidate yet.
                    </div>
                  )}

                  {/* Interview Sessions History with Transcripts */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      Completed & Attempted Sessions ({candidateDetail.sessions.length})
                    </h4>

                    {candidateDetail.sessions.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        Candidate has not started any mock interview sessions yet.
                      </div>
                    ) : (
                      candidateDetail.sessions.map((session, idx) => (
                        <div
                          key={session.id}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/60 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  #{idx + 1} {session.track}
                                </span>
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-bold">
                                  {session.difficulty}
                                </span>
                                {session.companyPreset && (
                                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-200 dark:border-indigo-800">
                                    {session.companyPreset}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {new Date(session.createdAt).toLocaleString()} • {session.questions?.length || 0} Questions
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {session.proctoring && (
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Integrity</span>
                                  <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                                    session.proctoring.tabSwitchCount === 0
                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                  }`}>
                                    {session.proctoring.tabSwitchCount === 0 ? '100% Focus' : `${session.proctoring.tabSwitchCount} Tab Sw.`}
                                  </span>
                                </div>
                              )}
                              {session.overallScore !== undefined && (
                                <div className="text-right">
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Score</span>
                                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                    {session.overallScore}%
                                  </span>
                                </div>
                              )}
                              {session.status === 'completed' && (
                                <Link
                                  to={`/results/${session.id}`}
                                  className="p-2 rounded-lg bg-slate-900 text-white dark:bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-colors"
                                  title="View Full Scorecard"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Questions & Candidate Answers Transcript */}
                          <div className="space-y-3">
                            {session.questions?.map((q, qIdx) => (
                              <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    Q{qIdx + 1}: {q.questionText}
                                  </span>
                                  {q.answer && (
                                    <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded shrink-0">
                                      Tech: {q.answer.technicalScore}% • Comm: {q.answer.communicationScore}%
                                    </span>
                                  )}
                                </div>

                                {q.answer ? (
                                  <div className="space-y-1.5 text-xs">
                                    <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 italic">
                                      "{q.answer.transcriptText}"
                                    </p>
                                    {q.answer.aiFeedback && (
                                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                        💡 <span className="font-semibold text-slate-700 dark:text-slate-300">AI Feedback:</span> {q.answer.aiFeedback}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                                    Pending response from candidate
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
