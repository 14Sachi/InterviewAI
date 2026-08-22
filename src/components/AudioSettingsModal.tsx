import React, { useState, useEffect, useRef } from 'react';
import { Mic, Sliders, Volume2, Check, X, RefreshCw, Radio } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    localStorage.getItem('preferred_mic_device_id') || ''
  );
  const [sensitivity, setSensitivity] = useState<number>(
    Number(localStorage.getItem('mic_sensitivity')) || 50
  );
  const [isTesting, setIsTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopTest();
      return;
    }

    loadDevices();
  }, [isOpen]);

  const loadDevices = async () => {
    try {
      // Request mic permission first to get labels
      await navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      }).catch(() => {});

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter((d) => d.kind === 'audioinput');
      setDevices(audioInputs);

      if (!selectedDeviceId && audioInputs.length > 0) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.error('Failed to list audio devices:', err);
    }
  };

  const startTest = async () => {
    try {
      stopTest();
      const constraints: MediaStreamConstraints = {
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
        // Normalize 0 - 100
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
      setIsTesting(true);
    } catch (err) {
      console.error('Error starting audio test:', err);
    }
  };

  const stopTest = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsTesting(false);
    setAudioLevel(0);
  };

  const handleSave = () => {
    localStorage.setItem('preferred_mic_device_id', selectedDeviceId);
    localStorage.setItem('mic_sensitivity', sensitivity.toString());
    stopTest();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
        <button
          onClick={() => {
            stopTest();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Audio & Microphone Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Calibrate microphone input & voice sensitivity thresholds
            </p>
          </div>
        </div>

        {/* Input Device Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Preferred Microphone</span>
            <button
              type="button"
              onClick={loadDevices}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Refresh List
            </button>
          </label>
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {devices.length === 0 ? (
              <option value="">Default Microphone</option>
            ) : (
              devices.map((device, idx) => (
                <option key={device.deviceId || idx} value={device.deviceId}>
                  {device.label || `Microphone ${idx + 1}`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Sensitivity Adjustment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Voice Recording Sensitivity ({sensitivity}%)
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

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Higher sensitivity captures quieter speech, while lower gate reduces background noise.
          </p>
        </div>

        {/* Live Test Bar */}
        <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isTesting ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              Live Microphone Test
            </span>

            <button
              type="button"
              onClick={isTesting ? stopTest : startTest}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isTesting
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {isTesting ? 'Stop Test' : 'Test Microphone'}
            </button>
          </div>

          {/* Level Indicator Bar */}
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
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
            {/* Sensitivity marker threshold line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white z-10 shadow-xs"
              style={{ left: `${sensitivity}%` }}
              title={`Sensitivity Threshold (${sensitivity}%)`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              stopTest();
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
