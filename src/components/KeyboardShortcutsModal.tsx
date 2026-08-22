import React from 'react';
import { X, Keyboard, Mic, Send, Volume2, Settings2, HelpCircle } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      key: 'Space',
      action: 'Start / Stop Mic Recording',
      description: 'Quickly toggle voice answer recording (when not typing in text box)',
      icon: <Mic className="w-4 h-4 text-rose-400" />,
    },
    {
      key: 'Ctrl + Enter',
      action: 'Submit Answer',
      description: 'Submit your spoken or written response for immediate AI grading',
      icon: <Send className="w-4 h-4 text-indigo-400" />,
    },
    {
      key: 'Alt + S',
      action: 'Read Aloud / Replay Question',
      description: 'Trigger AI interviewer text-to-speech reader',
      icon: <Volume2 className="w-4 h-4 text-amber-400" />,
    },
    {
      key: 'Alt + V',
      action: 'Voice Persona Settings',
      description: 'Open AI Voice Profile selector, speed, and pitch controls',
      icon: <Settings2 className="w-4 h-4 text-purple-400" />,
    },
    {
      key: 'Shift + ?',
      action: 'Toggle Keyboard Legend',
      description: 'Show or hide this power user keyboard shortcuts cheat sheet',
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Keyboard className="w-3.5 h-3.5" />
            Power User Workflow
          </div>
          <h2 className="text-xl font-black text-white">Global Keyboard Shortcuts</h2>
          <p className="text-xs text-slate-400">
            Control your mock interview hands-free without leaving your keyboard.
          </p>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2.5">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{s.action}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{s.description}</p>
                </div>
              </div>

              <kbd className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 text-[11px] font-mono font-bold whitespace-nowrap shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl transition text-xs border border-slate-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
