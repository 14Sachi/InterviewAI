import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sliders,
  Volume2,
  Check,
  X,
  RefreshCw,
  Radio,
  Camera,
  Video,
  FlipHorizontal,
  Sparkles,
} from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mic' | 'camera'>('camera');

  // Mic states
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>(
    localStorage.getItem('preferred_mic_device_id') || ''
  );
  const [sensitivity, setSensitivity] = useState<number>(
    Number(localStorage.getItem('mic_sensitivity')) || 50
  );
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Camera states
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>(
    localStorage.getItem('preferred_camera_device_id') || ''
  );
  const [isTestingCamera, setIsTestingCamera] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  // Refs
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micAnimFrameRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopAllTests();
      return;
    }

    loadAllDevices();
    startCameraTest();
  }, [isOpen]);

  const loadAllDevices = async () => {
    try {
      // Request permissions to populate device labels
      await navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch(() => {});

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter((d) => d.kind === 'audioinput');
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');

      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);

      if (!selectedAudioDeviceId && audioInputs.length > 0) {
        setSelectedAudioDeviceId(audioInputs[0].deviceId);
      }
      if (!selectedVideoDeviceId && videoInputs.length > 0) {
        setSelectedVideoDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.error('Failed to list devices:', err);
    }
  };

  // Camera preview test
  const startCameraTest = async (deviceId?: string) => {
    try {
      setCameraPermissionError(null);
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      const targetDevice = deviceId || selectedVideoDeviceId;
      const constraints: MediaStreamConstraints = {
        video: targetDevice
          ? { deviceId: { exact: targetDevice }, width: { ideal: 640 }, height: { ideal: 480 } }
          : { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoStreamRef.current = stream;
      setIsTestingCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera preview failed:', err);
      setCameraPermissionError('Webcam access was not granted. Please check browser permissions.');
      setIsTestingCamera(false);
    }
  };

  // Mic test
  const startMicTest = async (deviceId?: string) => {
    try {
      stopMicTest();
      const targetDevice = deviceId || selectedAudioDeviceId;
      const constraints: MediaStreamConstraints = {
        audio: targetDevice ? { deviceId: { exact: targetDevice } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);
        micAnimFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
      setIsTestingMic(true);
    } catch (err) {
      console.error('Error starting audio test:', err);
    }
  };

  const stopMicTest = () => {
    if (micAnimFrameRef.current) {
      cancelAnimationFrame(micAnimFrameRef.current);
      micAnimFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsTestingMic(false);
    setAudioLevel(0);
  };

  const stopAllTests = () => {
    stopMicTest();
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((t) => t.stop());
      videoStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleSave = () => {
    localStorage.setItem('preferred_mic_device_id', selectedAudioDeviceId);
    localStorage.setItem('preferred_camera_device_id', selectedVideoDeviceId);
    localStorage.setItem('mic_sensitivity', sensitivity.toString());
    stopAllTests();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-slate-900 dark:text-white">
        <button
          onClick={() => {
            stopAllTests();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Camera & Audio Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Configure webcam stream, microphone selection & audio levels
            </p>
          </div>
        </div>

        {/* Tabs: Camera vs Microphone */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Webcam & Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('mic');
              if (!isTestingMic) startMicTest();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'mic'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Microphone & Levels</span>
          </button>
        </div>

        {/* Tab 1: Camera Settings */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            {/* Live Video Preview Box */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-48 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isMirrored ? '-scale-x-100' : ''}`}
              />

              {cameraPermissionError && (
                <div className="absolute inset-0 bg-slate-950/85 p-4 flex flex-col items-center justify-center text-center text-xs text-rose-300">
                  <p>{cameraPermissionError}</p>
                </div>
              )}

              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={() => setIsMirrored((prev) => !prev)}
                  className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] font-bold text-white border border-slate-700 backdrop-blur-md flex items-center gap-1"
                >
                  <FlipHorizontal className="w-3 h-3" />
                  <span>Mirror: {isMirrored ? 'On' : 'Off'}</span>
                </button>
              </div>
            </div>

            {/* Video Device Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Selected Camera</span>
                <button
                  type="button"
                  onClick={loadAllDevices}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </label>

              <select
                value={selectedVideoDeviceId}
                onChange={(e) => {
                  setSelectedVideoDeviceId(e.target.value);
                  startCameraTest(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {videoDevices.length === 0 ? (
                  <option value="">Default Front Camera</option>
                ) : (
                  videoDevices.map((device, idx) => (
                    <option key={device.deviceId || idx} value={device.deviceId}>
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Microphone Settings */}
        {activeTab === 'mic' && (
          <div className="space-y-4">
            {/* Audio Device Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Preferred Microphone</span>
                <button
                  type="button"
                  onClick={loadAllDevices}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </label>
              <select
                value={selectedAudioDeviceId}
                onChange={(e) => {
                  setSelectedAudioDeviceId(e.target.value);
                  startMicTest(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {audioDevices.length === 0 ? (
                  <option value="">Default Microphone</option>
                ) : (
                  audioDevices.map((device, idx) => (
                    <option key={device.deviceId || idx} value={device.deviceId}>
                      {device.label || `Microphone ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Sensitivity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Voice Sensitivity ({sensitivity}%)
                </label>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {sensitivity > 75 ? 'High Gain' : sensitivity > 35 ? 'Balanced' : 'Low Gate'}
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Live Audio Meter */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Radio className={`w-3.5 h-3.5 ${isTestingMic ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                  Live Mic Level
                </span>

                <button
                  type="button"
                  onClick={isTestingMic ? stopMicTest : () => startMicTest()}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    isTestingMic
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isTestingMic ? 'Stop Test' : 'Test Audio'}
                </button>
              </div>

              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-75 rounded-full ${
                    audioLevel > 80
                      ? 'bg-rose-500'
                      : audioLevel > 40
                      ? 'bg-emerald-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              stopAllTests();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
