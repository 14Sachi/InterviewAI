import React from 'react';
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
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-500/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-indigo-950/80 border border-slate-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Next-Gen AI Mock Interview Platform</span>
            <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full text-[10px]">v2.5</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto text-slate-900 dark:text-white">
            Ace Your Tech Interviews with <br />
            <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              Real-Time AI Voice Coaching
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Practice realistic mock interviews tailored to your role, difficulty, and uploaded resume. Get instant score breakdowns, speech transcript critiques, and personalized improvement roadmaps powered by Gemini.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/track-selection' : '/register'}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              {user ? 'Start Practicing Now' : 'Start Free Practice Session'}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <a
              href="#demo-preview"
              className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-base"
            >
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Explore Interactive Demo
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold flex-wrap">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              SDE, Data Science, Cyber & PM Tracks
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Live Speech-to-Text & Feedback
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Resume Skill & JD Matching
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mock Preview Section */}
      <section id="demo-preview" className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              The Interview Room Experience
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto font-medium">
              Simulate live technical and behavioral interviews with real-time speech capture and intelligent follow-up questions.
            </p>
          </div>

          {/* Mockup Card */}
          <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 ml-2">InterviewAI Room — Session #SDE-2026</span>
              </div>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-500/30">
                Question 2 of 4
              </span>
            </div>

            <div className="space-y-6">
              {/* Question Banner */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  <BrainCircuit className="w-4 h-4" />
                  SYSTEM DESIGN • INTERMEDIATE
                </div>
                <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  "How do you structure a RESTful API with database pagination and Redis rate limiting to handle 50,000 requests per minute safely?"
                </p>
              </div>

              {/* Answer Recording Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      Live Microphone Active
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">00:42 / 02:00</span>
                  </div>

                  {/* Audio Wave Visualizer Simulation */}
                  <div className="h-12 bg-slate-100 dark:bg-slate-950 rounded-lg flex items-center justify-center gap-1 px-4 my-2 border border-slate-200 dark:border-slate-800">
                    {[40, 70, 30, 90, 60, 100, 50, 80, 40, 90, 70, 30, 60, 80, 50, 90, 40].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-1 bg-indigo-600 dark:bg-gradient-to-t dark:from-indigo-500 dark:to-purple-400 rounded-full animate-pulse"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 font-medium">
                    "I would implement cursor-based pagination to avoid deep OFFSET query overhead..."
                  </p>
                </div>

                {/* Instant Evaluation Teaser */}
                <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-500/30 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider block mb-2">
                      Instant AI Critique
                    </span>
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">92</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Technical</span>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">88</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Communication</span>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">90</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Sentiment</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      "Strong explanation of Redis sliding window algorithm and cursor pagination tradeoffs. Very clear."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Strategy & Warmup Section */}
      <section id="prep-tips" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PreparationTips />
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Built for Serious Career Growth
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Everything you need to practice, evaluate, and refine your interviewing skills before high-stakes real interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Voice & Audio Recording</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Record answers using your browser microphone with live audio visualizers. Gemini transcribes and evaluates spoken clarity.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contextual Probing</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Our AI listens to your answer history and generates sharp follow-up questions when responses are missing key edge cases.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Resume & JD Matching</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Upload your PDF/DOCX resume or paste a job description. Questions adapt to target your specific technical stack.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-600/20 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Score Radar Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Track overall progress over time with radial progress metrics, category breakdowns, and score trend charts.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Improvement Roadmaps</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Receive a concrete list of focus areas and suggested practice topics to complete before your next practice round.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Multi-Track Curriculums</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Comprehensive coverage across Software Engineering, Data Science, Cybersecurity, Product Management, and HR Behavioral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Candidate Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-xs">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium">
                "The follow-up questions in the SDE track were insanely realistic. When I gave a vague answer on database locks, InterviewAI pressed me on isolation levels — just like my actual FAANG interview."
              </p>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">David Kim</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Senior Fullstack Engineer</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-xs">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium">
                "Uploading my resume and pasting the job description made every single question tailored to my actual stack. My confidence went from 50% to 90% in one weekend."
              </p>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">Maya Lin</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lead Product Manager</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-xs">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium">
                "The speech transcription feedback pointed out that I talked too fast during behavioral questions. The STAR framework suggestions helped me structure concise 2-minute answers."
              </p>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">Marcus Vance</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cybersecurity Specialist</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-slate-900 text-white dark:bg-gradient-to-r dark:from-indigo-900 dark:via-purple-900 dark:to-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Land Your Dream Offer?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto font-medium">
            Start practicing with InterviewAI today. Experience realistic questions, instant voice transcripts, and personalized feedback.
          </p>
          <Link
            to={user ? '/track-selection' : '/auth?mode=signup'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 font-extrabold text-base rounded-xl hover:bg-slate-100 transition shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            {user ? 'Go to Interview Room' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
};
