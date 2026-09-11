import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Sparkles,
  FlipHorizontal,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Bot,
  User as UserIcon,
  ShieldCheck,
  Eye,
  Smile,
  Volume2,
  Sliders,
  Settings,
  Radio,
} from 'lucide-react';
import { VoiceProfile } from './TtsVoiceSettingsModal';

interface CameraVideoStageProps {
  isRecording: boolean;
  isSpeaking: boolean;
  selectedVoiceProfile: VoiceProfile;
  trackName: string;
  difficulty: string;
  companyPreset?: string;
  candidateName?: string;
  onToggleMicRecording?: () => void;
  onOpenDeviceSettings?: () => void;
}

export type ViewLayoutMode = 'dual-grid' | 'candidate-focus' | 'pip' | 'compact';

export const CameraVideoStage: React.FC<CameraVideoStageProps> = ({
  isRecording,
  isSpeaking,
  selectedVoiceProfile,
  trackName,
  difficulty,
  companyPreset,
  candidateName = 'Candidate',
  onToggleMicRecording,
  onOpenDeviceSettings,
}) => {
  const [isCameraOn, setIsCameraOn] = useState<boolean>(() => {
    return localStorage.getItem('interview_camera_enabled') !== 'false';
  });
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'normal' | 'studio' | 'soft'>('normal');
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('dual-grid');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');

  // Real-time microphone audio visualizer state
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio Analyser refs
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Load available camera devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
        if (videoInputs.length > 0 && !selectedVideoDeviceId) {
          setSelectedVideoDeviceId(videoInputs[0].deviceId);
        }
      } catch (err) {
        console.warn('Could not enumerate video devices:', err);
      }
    };
    getDevices();
  }, []);

  // Initialize or stop video stream based on isCameraOn state
  useEffect(() => {
    if (!isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      return;
    }

    let isSubscribed = true;

    const startCamera = async () => {
      try {
        setCameraError(null);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: selectedVideoDeviceId
            ? { deviceId: { exact: selectedVideoDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
            : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isSubscribed) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.warn('Autoplay failed or was prevented:', err);
          });
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        console.error('Camera stream error:', err);
        setHasCameraPermission(false);
        setCameraError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Camera permission was denied. You can enable camera in your browser settings or continue in voice-only mode.'
            : 'Unable to access your webcam. Check device connection.'
        );
      }
    };

    startCamera();

    return () => {
      isSubscribed = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isCameraOn, selectedVideoDeviceId]);

  // Real-time Mic Level Analyser for Candidate Tile
  useEffect(() => {
    let isSubscribed = true;

    const setupMicMeter = async () => {
      try {
        if (isMicMuted) {
          setMicAudioLevel(0);
          setIsUserSpeaking(false);
          return;
        }

        const preferredMicId = localStorage.getItem('preferred_mic_device_id');
        const constraints: MediaStreamConstraints = {
          audio: preferredMicId ? { deviceId: { exact: preferredMicId } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isSubscribed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        micStreamRef.current = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateMeter = () => {
          if (!isSubscribed) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          const level = Math.min(100, Math.round((average / 128) * 100));
          setMicAudioLevel(level);
          setIsUserSpeaking(level > 12);
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };

        updateMeter();
      } catch (err) {
        console.warn('Could not initialize microphone meter:', err);
      }
    };

    setupMicMeter();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [isMicMuted]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      const next = !prev;
      localStorage.setItem('interview_camera_enabled', String(next));
      return next;
    });
  };

  const toggleMicMute = () => {
    setIsMicMuted((prev) => !prev);
  };

  const cycleFilter = () => {
    setFilterMode((prev) => (prev === 'normal' ? 'studio' : prev === 'studio' ? 'soft' : 'normal'));
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'studio':
        return 'contrast-105 brightness-105 saturate-110 shadow-indigo-500/20';
      case 'soft':
        return 'blur-[0.3px] brightness-105 contrast-95';
      default:
        return '';
    }
  };

  if (layoutMode === 'compact') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">{selectedVoiceProfile.name} (AI Coach)</span>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-bold">
                {isSpeaking ? 'Speaking' : isRecording ? 'Recording Voice' : isUserSpeaking ? 'Speaking' : 'Listening'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Live Voice Interviewer • {trackName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mic Mute / Audio level indicator */}
          <button
            onClick={toggleMicMute}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isMicMuted
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
            title="Mute/Unmute Mic"
          >
            {isMicMuted ? <MicOff className="w-4 h-4 text-rose-500" /> : <Mic className="w-4 h-4 text-emerald-500" />}
            <span className="hidden sm:inline">{isMicMuted ? 'Muted' : 'Mic Active'}</span>
          </button>

          <button
            onClick={toggleCamera}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isCameraOn
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {isCameraOn ? <Camera className="w-4 h-4 text-emerald-500" /> : <CameraOff className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
          </button>

          <button
            onClick={() => setLayoutMode('dual-grid')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition"
            title="Expand Full Video Stage"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Stage Bar: Layout & Status */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300">
            <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Mock Interview Live Stage</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-[10px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            PROCTORING & MIC ACTIVE
          </span>
        </div>

        {/* Layout Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setLayoutMode('dual-grid')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] ${
              layoutMode === 'dual-grid'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Split Stage: AI Coach + Candidate side-by-side"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dual Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('candidate-focus')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] ${
              layoutMode === 'candidate-focus'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Focus on Candidate Webcam"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speaker Focus</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('compact')}
            className="p-1.5 rounded-lg font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            title="Minimize to Compact Bar"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Video Stage Grid */}
      <div
        className={`grid gap-4 transition-all duration-300 ${
          layoutMode === 'dual-grid'
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {/* ======================================================== */}
        {/* TILE 1: AI Mock Interviewer Persona Tile */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 p-6 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-lg text-white">
          {/* Top Badges */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-extrabold backdrop-blur-md">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                AI Interviewer • {selectedVoiceProfile.name}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border backdrop-blur-md ${
                isSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : isRecording
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSpeaking ? 'bg-emerald-400' : isRecording ? 'bg-amber-400' : 'bg-slate-400'
                }`}
              />
              {isSpeaking ? 'Speaking Question' : isRecording ? 'Listening to You' : 'Evaluating Context'}
            </span>
          </div>

          {/* Center Persona Avatar & Dynamic Soundwaves */}
          <div className="flex flex-col items-center justify-center my-auto py-4 z-10">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing energy rings when AI is speaking */}
              {isSpeaking && (
                <>
                  <div className="absolute w-32 h-32 rounded-full bg-indigo-500/20 animate-ping opacity-60 pointer-events-none" />
                  <div className="absolute w-28 h-28 rounded-full bg-purple-500/30 animate-pulse pointer-events-none" />
                </>
              )}

              {/* Bot Persona Circle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 border-2 border-white/20 relative z-10 transition-transform duration-300 hover:scale-105">
                <Bot className={`w-10 h-10 sm:w-12 sm:h-12 text-white ${isSpeaking ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <div className="mt-4 text-center space-y-1">
              <h4 className="font-extrabold text-base text-white flex items-center justify-center gap-1.5">
                <span>{selectedVoiceProfile.gender === 'Female' ? 'Dr. ' : 'Lead '}{selectedVoiceProfile.name}</span>
                <span className="text-[10px] text-indigo-300 font-mono font-normal">({selectedVoiceProfile.accent})</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium max-w-xs line-clamp-1">
                {companyPreset ? `${companyPreset} Hiring Specialist` : `${trackName} • ${difficulty} Level`}
              </p>
            </div>

            {/* Simulated Live Equalizer Bars */}
            <div className="flex items-center gap-1 mt-3 h-5">
              {[...Array(9)].map((_, i) => {
                const heights = isSpeaking
                  ? ['h-2', 'h-4', 'h-5', 'h-3', 'h-5', 'h-4', 'h-5', 'h-3', 'h-2']
                  : isRecording
                  ? ['h-1', 'h-2', 'h-3', 'h-2', 'h-3', 'h-2', 'h-2', 'h-1', 'h-1']
                  : ['h-1', 'h-1', 'h-1', 'h-1', 'h-1', 'h-1', 'h-1', 'h-1', 'h-1'];
                return (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-150 ${heights[i]}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Info Footnote */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 z-10">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STAR & Technical Scoring
            </span>
            <span className="font-mono text-slate-400">{trackName}</span>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ======================================================== */}
        {/* TILE 2: Candidate Live Webcam Stream, Mic VU Meter & Proctoring */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-lg group">
          {/* Camera Video Stream Element */}
          {isCameraOn ? (
            <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isMirrored ? '-scale-x-100' : ''
                } ${getFilterStyle()}`}
              />

              {/* Centering Facial Frame Guide (Subtle Proctoring HUD) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
                <div className="w-44 h-56 border border-dashed border-white/40 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-indigo-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-indigo-400" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-indigo-400" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-indigo-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                <CameraOff className="w-9 h-9 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-white">Camera is Off</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Turn on your camera to simulate a realistic video interview.
              </p>
              <button
                type="button"
                onClick={toggleCamera}
                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Turn Camera On</span>
              </button>
            </div>
          )}

          {/* Camera Error Banner */}
          {cameraError && isCameraOn && (
            <div className="absolute top-14 left-4 right-4 bg-rose-950/90 border border-rose-800 text-rose-200 p-2.5 rounded-xl text-[11px] font-medium z-20 backdrop-blur-md">
              {cameraError}
            </div>
          )}

          {/* Overlay Top Badges */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 border border-white/10 text-white text-xs font-bold backdrop-blur-md shadow-xs">
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{candidateName} (You)</span>
              </span>

              {/* Voice Activity Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md transition-all ${
                  isMicMuted
                    ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                    : isUserSpeaking || isRecording
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/70 border-white/10 text-slate-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isMicMuted ? 'bg-rose-500' : isUserSpeaking || isRecording ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'
                  }`}
                />
                <span>{isMicMuted ? 'Mic Muted' : isRecording ? 'Recording Voice' : isUserSpeaking ? 'Speaking...' : 'Listening'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isCameraOn && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  HD 720p
                </span>
              )}
            </div>
          </div>

          {/* Live Mic VU Level Meter Bar inside Candidate Tile */}
          {!isMicMuted && (
            <div className="relative z-10 px-4 py-1">
              <div className="h-1.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/10 backdrop-blur-md">
                <div
                  className={`h-full transition-all duration-75 rounded-full ${
                    micAudioLevel > 70
                      ? 'bg-rose-500'
                      : micAudioLevel > 20
                      ? 'bg-gradient-to-r from-emerald-500 to-indigo-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(2, micAudioLevel)}%` }}
                />
              </div>
            </div>
          )}

          {/* Overlay Bottom Controls Bar */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Camera Toggle Button */}
              <button
                type="button"
                onClick={toggleCamera}
                className={`p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold backdrop-blur-md ${
                  isCameraOn
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                }`}
                title="Toggle Camera (Alt + C)"
              >
                {isCameraOn ? <Camera className="w-4 h-4 text-emerald-400" /> : <CameraOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCameraOn ? 'Cam On' : 'Cam Off'}</span>
              </button>

              {/* Microphone Mute / Facility Toggle Button */}
              <button
                type="button"
                onClick={toggleMicMute}
                className={`p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold backdrop-blur-md ${
                  !isMicMuted
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                }`}
                title="Mute / Unmute Microphone (Alt + M)"
              >
                {!isMicMuted ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{!isMicMuted ? 'Mic Live' : 'Muted'}</span>
              </button>

              {/* Mirror Toggle */}
              {isCameraOn && (
                <button
                  type="button"
                  onClick={() => setIsMirrored((prev) => !prev)}
                  className={`p-2.5 rounded-xl border backdrop-blur-md transition text-xs font-bold ${
                    isMirrored
                      ? 'bg-indigo-600/80 border-indigo-400/40 text-white'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Flip Video Mirror"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
              )}

              {/* Filter / Lighting Mode */}
              {isCameraOn && (
                <button
                  type="button"
                  onClick={cycleFilter}
                  className={`p-2.5 rounded-xl border backdrop-blur-md transition text-xs font-bold flex items-center gap-1 ${
                    filterMode !== 'normal'
                      ? 'bg-purple-600/80 border-purple-400/40 text-white'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={`Studio Filter Mode: ${filterMode}`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-[10px] hidden md:inline uppercase">{filterMode}</span>
                </button>
              )}
            </div>

            {/* Quick Device Settings button */}
            {onOpenDeviceSettings && (
              <button
                type="button"
                onClick={onOpenDeviceSettings}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition text-xs font-bold flex items-center gap-1"
                title="Camera & Microphone Hardware Settings"
              >
                <Settings className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
