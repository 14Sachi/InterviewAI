import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PreparationTips } from '../components/PreparationTips';
import {
  Sparkles,
  Bot,
  Mic,
  BarChart3,
  BrainCircuit,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Play,
  Volume2,
  Terminal,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Target,
  TrendingUp,
  Briefcase,
  Award,
  CheckCircle,
  HelpCircle,
  Building2,
  Clock,
  Sparkle
} from 'lucide-react';

interface TrackDemo {
  id: string;
  name: string;
  badge: string;
  question: string;
  sampleAnswer: string;
  technicalScore: number;
  commScore: number;
  sentimentScore: number;
  critique: string;
  audioDuration: string;
  tags: string[];
}

const DEMO_TRACKS: TrackDemo[] = [
  {
    id: 'sde',
    name: 'SDE & Backend',
    badge: 'FAANG Level L5',
    question: 'How would you architect a distributed rate limiter that handles 50,000 requests/sec with Redis cluster failover?',
    sampleAnswer: 'I recommend the sliding window log algorithm with Redis sorted sets. For high concurrency, pipeline commands using Lua scripts to ensure atomic execution...',
    technicalScore: 94,
    commScore: 91,
    sentimentScore: 95,
    critique: 'Excellent breakdown of atomic Lua scripts to eliminate race conditions. Mentioned memory overhead tradeoffs clearly.',
    audioDuration: '01:14',
    tags: ['Redis', 'Distributed Systems', 'Sliding Window', 'Atomic Scripts']
  },
  {
    id: 'system_design',
    name: 'System Design',
    badge: 'Staff Engineer',
    question: 'Design a global video live streaming chat system like Twitch with sub-second latency and 10M concurrent viewers.',
    sampleAnswer: 'We decouple chat into fan-out clusters using WebSockets, edge proxies via CDN, and a Kafka backplane partitioned by Channel ID...',
    technicalScore: 96,
    commScore: 89,
    sentimentScore: 92,
    critique: 'Superb partitioning strategy with Kafka and edge caching. Good awareness of backpressure handling during viral stream spikes.',
    audioDuration: '01:42',
    tags: ['WebSockets', 'Kafka', 'Edge Caching', 'Fan-out Architecture']
  },
  {
    id: 'aiml',
    name: 'AI & ML Engineering',
    badge: 'Research & Applied',
    question: 'How do you mitigate catastrophic forgetting when fine-tuning an LLM with LoRA on domain-specific biomedical text?',
    sampleAnswer: 'We retain a replay buffer of general domain instructions, set lower learning rates for rank adaptation matrices, and monitor perplexity on validation holdouts...',
    technicalScore: 93,
    commScore: 92,
    sentimentScore: 90,
    critique: 'Accurate explanation of Low-Rank Adaptation hyperparameters and replay regularization. Very structured response.',
    audioDuration: '01:05',
    tags: ['LoRA', 'Catastrophic Forgetting', 'PEFT', 'Perplexity']
  },
  {
    id: 'behavioral',
    name: 'Behavioral & Leadership',
    badge: 'STAR Method',
    question: 'Tell me about a high-stakes disagreement with a Principal Architect on project direction and how you navigated it.',
    sampleAnswer: 'Situation: We faced a debate between gRPC vs GraphQL for our core microservice. Task: I needed to align the team without delaying our Q3 launch. Action: Built a reproducible benchmark suite...',
    technicalScore: 90,
    commScore: 98,
    sentimentScore: 96,
    critique: 'Flawless STAR framing. Focused on data-driven consensus rather than personal opinion, showing strong executive maturity.',
    audioDuration: '01:28',
    tags: ['STAR Method', 'Conflict Resolution', 'Data-Driven', 'Executive Comms']
  }
];

const FAANG_COMPANIES = [
  { name: 'Google', role: 'L4/L5 SWE & SRE', color: 'from-blue-500 to-emerald-500' },
  { name: 'Meta', role: 'E4/E5 Fullstack & AI', color: 'from-blue-600 to-indigo-600' },
  { name: 'Amazon', role: 'SDE II & Bar Raiser', color: 'from-amber-500 to-orange-600' },
  { name: 'Microsoft', role: 'Senior Cloud & Systems', color: 'from-cyan-500 to-blue-600' },
  { name: 'Apple', role: 'Core OS & Hardware SW', color: 'from-slate-600 to-slate-800' },
  { name: 'Netflix', role: 'Senior Distributed Eng', color: 'from-rose-600 to-red-700' },
  { name: 'Uber', role: 'Staff Real-Time Infra', color: 'from-slate-800 to-slate-950' },
  { name: 'OpenAI', role: 'Applied AI & Platform', color: 'from-teal-500 to-emerald-600' },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDemo, setSelectedDemo] = useState<TrackDemo>(DEMO_TRACKS[0]);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Salary Calculator State
  const [yearsExp, setYearsExp] = useState<number>(4);
  const [selectedTargetRole, setSelectedTargetRole] = useState<'SDE' | 'Staff' | 'AI' | 'PM'>('SDE');

  const calculateTargetSalary = () => {
    const base = {
      SDE: 130000 + yearsExp * 16000,
      Staff: 180000 + yearsExp * 22000,
      AI: 150000 + yearsExp * 20000,
      PM: 140000 + yearsExp * 17000,
    }[selectedTargetRole];
    return Math.round(base);
  };

  const calculateReadinessDays = () => {
    return Math.max(7, Math.round(28 - yearsExp * 2));
  };

  const faqs = [
    {
      q: 'How does InterviewAI simulate real voice interviews?',
      a: 'InterviewAI leverages browser Speech-to-Text with low-latency Web Audio capture and Google Gemini multimodal reasoning. The AI listens to your voice answers, transcribes them with high fidelity, and generates dynamic follow-up probing questions just like a senior human interviewer.'
    },
    {
      q: 'Can I upload my actual resume and target job descriptions?',
      a: 'Yes! You can upload your PDF or DOCX resume or paste any job description. InterviewAI automatically analyzes your specific tech stack, frameworks, and past projects to generate ultra-relevant questions and identify potential resume gaps.'
    },
    {
      q: 'What interview tracks and roles are supported?',
      a: 'We support 10 specialized tracks: Software Development (Backend, Frontend, Full Stack), System Design, Data Science, AI/ML Engineering, DevOps & Cloud, Cybersecurity, Product Management, QA & Test Automation, and HR/Behavioral STAR method.'
    },
    {
      q: 'Are the questions customized for specific companies like Google or Amazon?',
      a: 'Absolutely. You can select company presets (FAANG, Tier-1 Tech, High-Growth Unicorns, Seed Startups). For Amazon, questions incorporate Leadership Principles; for Google, deep algorithmic and scalability rigor.'
    },
    {
      q: 'Can I export my scorecard and improvement roadmap?',
      a: 'Yes, after every interview round you receive an in-depth scorecard with radar analytics, speech pace feedback, model answers with sample code, and a downloadable professional PDF report you can save or share.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
        {/* Background glow & mesh effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/15 dark:bg-indigo-600/25 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/15 dark:bg-pink-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/10 dark:bg-cyan-600/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400"></span>
            </span>
            <span>Next-Gen AI Mock Interview Platform</span>
            <span className="bg-indigo-100 dark:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">v2.5 Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl mx-auto text-slate-900 dark:text-white">
            Land Your Dream Tech Job with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              Real-Time AI Voice Coaching
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Practice realistic mock interviews tailored to your exact role, target company, and uploaded resume. Get instant speech transcription critiques, live follow-up grilling, and personalized study roadmaps.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/track-selection' : '/register'}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-base group"
            >
              <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>{user ? 'Enter Interview Room' : 'Start Free Mock Interview'}</span>
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#interactive-demo"
              className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 text-base"
            >
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Explore Live Interactive Demo</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-6 sm:gap-8 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>10 Role Tracks (SDE, System Design, AI)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Low-Latency Voice Speech Recognition</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>AI Resume & JD Skill Matcher</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Exportable Scorecards & PDF Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Companies Banner */}
      <section className="py-8 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            Curated Question Banks & Rubrics for Top Tier Tech
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {FAANG_COMPANIES.map((company, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 text-center shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all hover:scale-105"
              >
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block">{company.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate mt-0.5">{company.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mock Preview Simulator */}
      <section id="interactive-demo" className="py-20 bg-white dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Cockpit Simulator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Experience the Live Interview Room
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
              Click through different interview tracks below to test how our AI interviewer listens, evaluates, and provides instant scoring critiques.
            </p>
          </div>

          {/* Track Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {DEMO_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedDemo(track);
                  setIsPlayingDemo(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedDemo.id === track.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{track.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  selectedDemo.id === track.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {track.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Simulated Interview Cockpit Box */}
          <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            {/* Cockpit Window Header */}
            <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  AI Cockpit — Track: {selectedDemo.name} ({selectedDemo.badge})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live AI Evaluator Connected
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Question Box */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" />
                    AI Interviewer Prompt
                  </span>
                  <button
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs"
                  >
                    {isPlayingDemo ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-300" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingDemo ? 'Playing AI Voice...' : 'Listen to Prompt'}</span>
                  </button>
                </div>
                <p className="text-base sm:text-lg font-bold text-white leading-snug">
                  "{selectedDemo.question}"
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedDemo.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[11px] font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Candidate Voice Transcript & Waveform */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                      Live Candidate Voice Transcription
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{selectedDemo.audioDuration} / 02:00</span>
                  </div>

                  {/* Audio Equalizer Simulation */}
                  <div className="h-12 bg-slate-900/90 rounded-xl flex items-center justify-center gap-1.5 px-4 border border-slate-800">
                    {[35, 75, 45, 95, 60, 100, 55, 85, 40, 95, 70, 45, 65, 80, 50, 90, 45, 70, 30, 85].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full animate-pulse"
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 italic font-medium leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                    "{selectedDemo.sampleAnswer}"
                  </p>
                </div>

                {/* Instant Evaluation Card */}
                <div className="md:col-span-5 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Instant AI Critique
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Passed
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-xl font-black text-indigo-400">{selectedDemo.technicalScore}</span>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Technical</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-xl font-black text-purple-400">{selectedDemo.commScore}</span>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Clarity</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-xl font-black text-emerald-400">{selectedDemo.sentimentScore}</span>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Confidence</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
                      "{selectedDemo.critique}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300 font-semibold">
                    <span>Probing follow-up unlocked</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Salary & Readiness Assessment Tool */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-8 sm:p-12 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Career & Salary Calculator</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Calculate Your Potential Compensation Bump
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Candidates who complete 4+ mock interview rounds with structured AI feedback improve their offer negotiation power by an average of 25-40%.
              </p>

              {/* Sliders and Selectors */}
              <div className="space-y-5 pt-2">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-300">Years of Experience:</span>
                    <span className="text-amber-400 font-mono">{yearsExp} {yearsExp === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>1 Year (Junior)</span>
                    <span>5 Years (Senior)</span>
                    <span>15+ Years (Staff/Principal)</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-300 block mb-2">Target Role Level:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'SDE', label: 'Senior SWE' },
                      { id: 'Staff', label: 'Staff / Architect' },
                      { id: 'AI', label: 'AI / ML Engineer' },
                      { id: 'PM', label: 'Product Lead' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedTargetRole(role.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          selectedTargetRole === role.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Target Card */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 block mb-1">
                  Projected Market Total Compensation
                </span>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                  ${calculateTargetSalary().toLocaleString()}<span className="text-xl text-slate-400 font-normal">/yr</span>
                </div>
                <span className="text-xs text-slate-400 block mt-1 font-medium">Includes Base Salary + Equity + Bonus Tier</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Prep Time</span>
                  <span className="text-lg font-extrabold text-white">{calculateReadinessDays()} Days</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">at 3 sessions/wk</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Confidence Lift</span>
                  <span className="text-lg font-extrabold text-amber-300">+92%</span>
                  <span className="text-[10px] text-slate-400 block font-medium">STAR mastery</span>
                </div>
              </div>

              <Link
                to={user ? '/track-selection' : '/register'}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start Tailored Prep Track</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Built for Elite Career Acceleration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need to Ace Any Interview
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
            From technical whiteboarding and algorithm edge cases to behavioral leadership rubrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-7 rounded-3xl hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Voice & Speech Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                Record real-time answers using high-frequency audio visualizers. Gemini analyzes speaking pace, filler words, technical keyword density, and structural clarity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1.5">
              <span>Speech-to-Text Powered</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-7 rounded-3xl hover:border-purple-400 dark:hover:border-purple-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Contextual Follow-up Grilling</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                Unlike static question banks, our AI remembers your previous answers and generates tailored follow-up inquiries to test depth, edge cases, and architectural tradeoffs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 gap-1.5">
              <span>Dynamic Reasoning</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-7 rounded-3xl hover:border-emerald-400 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume & JD Skill Matching</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                Upload your resume and paste target job descriptions. The system identifies skill overlaps and crafts targeted scenarios that match your exact stack.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1.5">
              <span>PDF & DOCX Support</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Strategy & Warmup Section */}
      <section id="prep-tips" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PreparationTips />
      </section>

      {/* Candidate Testimonials & Success Stories */}
      <section className="py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Proven Results from Top Candidates
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium">
              Over 12,000+ mock interviews completed across Google, Meta, Amazon, Apple, and high-growth unicorns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                "The follow-up questions in the SDE track were insanely realistic. When I gave a high-level answer on database concurrency, InterviewAI pressed me on isolation levels and deadlock detection — exactly what happened in my Meta E5 loop."
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">David Kim</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">L5 Senior SWE @ Meta</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  $240k Offer
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                "Uploading my resume and pasting the job description made every single question tailored to my actual stack. The STAR framework critiques helped me turn 5-minute rambles into crisp, impactful 90-second answers."
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">Maya Lin</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Principal PM @ Stripe</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  $285k Offer
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                "The speech transcription feedback and visual radar scores were eye-opening. I practiced 6 rounds over a weekend and felt 10x more confident walking into my AWS System Design round."
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">Marcus Vance</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Solutions Architect @ AWS</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  $215k Offer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 dark:text-white gap-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <span>{faq.q}</span>
                {activeFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {activeFaq === index && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-slate-900 text-white dark:bg-gradient-to-r dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Zero Setup Required • Free Instant Access</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Ace Your Next Tech Interview?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Start a free practice session today. Get instant voice feedback, score breakdowns, and concrete tips before your high-stakes real round.
          </p>
          <div className="pt-2">
            <Link
              to={user ? '/track-selection' : '/register'}
              className="inline-flex items-center gap-2.5 px-9 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{user ? 'Enter Interview Room' : 'Start Free Practice Round'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
