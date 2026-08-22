import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Resume } from '../types';
import { WeeklyTipNotificationCard } from '../components/WeeklyTipNotificationCard';
import {
  User as UserIcon,
  Mail,
  Lock,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldAlert,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, token, updateUserInContext, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');

  const [resume, setResume] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchResume = async () => {
      try {
        const res = await fetch('/api/resume/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResume(data.resume);
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      }
    };

    fetchResume();
  }, [user, token, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
      } else {
        updateUserInContext(data.user);
        setMessage('Profile updated successfully!');
        setNewPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const text = await file.text();
      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResume(data.resume);
        setMessage('Resume analyzed and updated!');
      } else {
        setError('Failed to process resume');
      }
    } catch (err: any) {
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        logout();
        navigate('/');
      } else {
        setError('Failed to delete account');
      }
    } catch (err) {
      setError('Network error during deletion');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Profile & Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your personal credentials and uploaded resume data</p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2.5 font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Personal Credentials
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white font-medium outline-none focus:border-slate-900 dark:focus:border-indigo-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white font-medium outline-none focus:border-slate-900 dark:focus:border-indigo-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white font-medium outline-none focus:border-slate-900 dark:focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Update Credentials'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Resume Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Uploaded Candidate Resume
        </h2>

        {resume ? (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm block">{resume.fileName}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <label className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-900 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition shadow-xs">
                Replace Resume
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-400 block mb-2">Parsed Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {resume.parsedSkills.map((s, i) => (
                  <span key={i} className="bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-400 block mb-1">Parsed Experience Summary:</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic font-medium">{resume.parsedExperience}</p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {isUploading ? 'Analyzing resume with Gemini AI...' : 'No resume uploaded yet. Upload a resume to automatically extract skills.'}
            </p>
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleResumeUpload}
              disabled={isUploading}
              className="block w-full max-w-xs mx-auto text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white dark:file:bg-indigo-600 dark:file:text-white cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Automated Weekly Interview Practice Tip Section */}
      <WeeklyTipNotificationCard />

      {/* Danger Zone: Delete Account */}
      <div className="bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Deleting your account permanently wipes all your interview session history, transcripts, and scores.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-rose-100 dark:bg-rose-600/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl transition"
          >
            Delete Account...
          </button>
        ) : (
          <div className="p-4 bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-500 rounded-xl space-y-3">
            <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Are you sure? This action cannot be undone.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-500 shadow-xs"
              >
                Confirm Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};
