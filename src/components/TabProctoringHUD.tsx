import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  CheckCircle2,
  XCircle,
  Monitor,
  Radio,
} from 'lucide-react';
import { ProctoringEvent, ProctoringReport } from '../types';

interface TabProctoringHUDProps {
  sessionId?: string;
  onProctoringUpdate?: (report: ProctoringReport) => void;
}

export const TabProctoringHUD: React.FC<TabProctoringHUDProps> = ({
  sessionId,
  onProctoringUpdate,
}) => {
  const [tabSwitches, setTabSwitches] = useState<number>(0);
  const [totalAwaySeconds, setTotalAwaySeconds] = useState<number>(0);
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [lastWarningDuration, setLastWarningDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isExamFullscreen, setIsExamFullscreen] = useState<boolean>(false);
  const [awayStartTime, setAwayStartTime] = useState<number | null>(null);

  // Real-time tab visibility and window blur detection
  useEffect(() => {
    let leaveTimestamp: number | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        leaveTimestamp = Date.now();
        setAwayStartTime(leaveTimestamp);
      } else {
        if (leaveTimestamp) {
          const duration = Math.max(1, Math.round((Date.now() - leaveTimestamp) / 1000));
          leaveTimestamp = null;
          setAwayStartTime(null);

          const newEvent: ProctoringEvent = {
            id: `evt-${Date.now()}`,
            type: 'tab_switch',
            timestamp: new Date().toLocaleTimeString(),
            durationSeconds: duration,
            details: `Candidate switched tabs or minimized window for ${duration}s`,
          };

          setTabSwitches((prev) => {
            const nextCount = prev + 1;
            setTotalAwaySeconds((total) => total + duration);
            setEvents((evts) => [newEvent, ...evts]);
            setLastWarningDuration(duration);
            setShowWarningModal(true);

            // Compute integrity score
            const integrityScore = Math.max(0, 100 - nextCount * 15 - Math.floor(duration / 3) * 5);
            const report: ProctoringReport = {
              tabSwitchCount: nextCount,
              totalTimeAwaySeconds: totalAwaySeconds + duration,
              fullscreenViolationsCount: 0,
              integrityScore,
              events: [newEvent, ...events],
              lastTabSwitchTime: new Date().toISOString(),
              activeScreenStatus: nextCount >= 3 ? 'flagged' : nextCount > 0 ? 'suspicious' : 'clean',
            };

            if (onProctoringUpdate) {
              onProctoringUpdate(report);
            }

            // Sync with backend if sessionId is present
            if (sessionId) {
              const activeToken = localStorage.getItem('interview_ai_token');
              if (activeToken) {
                fetch(`/api/sessions/${sessionId}/proctoring-event`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${activeToken}`,
                  },
                  body: JSON.stringify({ event: newEvent, proctoringReport: report }),
                }).catch(() => {});
              }
            }

            return nextCount;
          });
        }
      }
    };

    const handleWindowBlur = () => {
      if (!leaveTimestamp && document.visibilityState === 'visible') {
        leaveTimestamp = Date.now();
      }
    };

    const handleWindowFocus = () => {
      if (leaveTimestamp) {
        handleVisibilityChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [sessionId, totalAwaySeconds, events, onProctoringUpdate]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsExamFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsExamFullscreen(false)).catch(() => {});
    }
  };

  const integrityScore = Math.max(0, 100 - tabSwitches * 15 - Math.floor(totalAwaySeconds / 5) * 5);

  return (
    <>
      {/* Proctoring HUD Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                tabSwitches === 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : tabSwitches < 3
                  ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse'
                  : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-bounce'
              }`}
            >
              {tabSwitches === 0 ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                  Exam Tab & Focus Proctor
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                    tabSwitches === 0
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : tabSwitches < 3
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  {tabSwitches === 0 ? 'Tab Focused (Safe)' : `${tabSwitches} Tab Switch${tabSwitches > 1 ? 'es' : ''} Logged`}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Active Screen: <span className="font-bold text-slate-700 dark:text-slate-300">Interview Room</span> • Integrity Score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{integrityScore}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition flex items-center gap-1"
              title="Toggle Fullscreen Exam Mode"
            >
              {isExamFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isExamFullscreen ? 'Exit Fullscreen' : 'Fullscreen Exam'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span>{events.length} Events</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Audit Log */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h5 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Live Proctoring Event Log (Monitored in Real Time)
            </h5>

            {events.length === 0 ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-500 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No tab switches or outside window navigation detected. Perfect exam focus!</span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold">{evt.details}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Immediate Tab Switch Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl relative text-slate-900 dark:text-white">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 mx-auto flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-300 dark:border-rose-800">
                ⚠️ Tab Switch Detected
              </span>
              <h3 className="text-xl font-black">Exam Tab Switch Warning</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                You navigated away from this interview session for{' '}
                <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {lastWarningDuration} second{lastWarningDuration > 1 ? 's' : ''}
                </span>
                .
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-left text-xs space-y-1.5 font-medium">
              <span className="font-bold text-slate-900 dark:text-white block">Anti-Cheating Policy:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                <li>All tab changes, browser minimizing, and outside window focuses are recorded in your final candidate report.</li>
                <li>Multiple tab switches may decrease your candidate integrity score.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowWarningModal(false)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer"
            >
              I Understand — Return to Interview
            </button>
          </div>
        </div>
      )}
    </>
  );
};
