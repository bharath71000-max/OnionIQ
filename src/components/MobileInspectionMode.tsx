import React, { useState, useEffect, useRef } from 'react';
import { InspectionBatch, DetectedOnion, OnionClass } from '../types/onion';
import {
  AIInferenceEngine,
  TrackingFrameState,
} from '../services/aiInferenceEngine';
import {
  calculateBatchMetrics,
  evaluateFinalGrade,
  DEFAULT_GRADING_THRESHOLDS,
  generateSampleDetectedOnions,
} from '../services/onionDataService';
import {
  Camera,
  Upload,
  Play,
  Pause,
  ArrowRight,
  ShieldAlert,
  X,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface MobileInspectionModeProps {
  onCloseMobileMode: () => void;
  onNavigateToResults: (batch: InspectionBatch) => void;
}

export const MobileInspectionMode: React.FC<MobileInspectionModeProps> = ({
  onCloseMobileMode,
  onNavigateToResults,
}) => {
  const [batchId] = useState<string>(
    `BATCH-MOBI-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [detectedFrames, setDetectedFrames] = useState<number>(142);
  const [uniqueOnions, setUniqueOnions] = useState<number>(32);
  const [defectCount, setDefectCount] = useState<number>(5);
  const [activeTracks, setActiveTracks] = useState<TrackingFrameState['activeTracks']>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [detectedOnions, setDetectedOnions] = useState<DetectedOnion[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Start tracking simulation
    const cancel = AIInferenceEngine.simulateVideoTracking(
      50,
      32,
      (state) => {
        setDetectedFrames(state.detectedFrameCount);
        setUniqueOnions(state.uniqueOnionCount);
        setActiveTracks(state.activeTracks);

        const defects = state.activeTracks.filter(
          (t) => t.predictedClass !== 'Healthy'
        ).length;
        setDefectCount(defects);

        if (state.isComplete) {
          setIsFinished(true);
        }
      },
      (finalOnions) => {
        setDetectedOnions(finalOnions);
        const defs = finalOnions.filter((o) => o.predictedClass !== 'Healthy').length;
        setDefectCount(defs);
      }
    );

    return () => {
      cancel();
    };
  }, []);

  const handleFinish = () => {
    const onions = detectedOnions.length > 0 ? detectedOnions : generateSampleDetectedOnions(32);
    const metrics = calculateBatchMetrics(onions, detectedFrames);
    const thresholds = DEFAULT_GRADING_THRESHOLDS;
    const finalGrade = evaluateFinalGrade(metrics, thresholds);

    const newBatch: InspectionBatch = {
      id: batchId,
      reportId: `RPT-ONION-${Math.floor(10000 + Math.random() * 90000)}`,
      procurementCenter: 'Lasalgaon APMC Mandi, Nashik',
      inspectorName: 'Field Mobile Inspector',
      inspectorRole: 'Field Officer Mobile App',
      supplierFarmerId: 'FARM-MH-MOBI',
      supplierName: 'Mandi Direct Yard Lot',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      onionVariety: 'Nashik Red',
      sampleSizeKg: 10.0,
      location: 'Field Platform 1',
      notes: 'Captured via One-Handed Mobile Field Mode.',
      status: 'Pending Review',
      verificationStatus: 'AI Assessment Only',
      metrics,
      onions,
      finalGrade,
      gradingRulesApplied: thresholds,
      inspectorRemarks: `Mobile field inspection: ${metrics.uniqueOnionsCount} onions tracked.`,
      captureSource: 'live_camera',
      previewImageUrl: '/src/assets/images/onion_inspection_tray_1790704349459.jpg',
    };

    onNavigateToResults(newBatch);
  };

  const getClassColor = (cls: OnionClass) => {
    switch (cls) {
      case 'Healthy':
        return '#15803D';
      case 'Damaged':
        return '#D97706';
      case 'Rotten':
        return '#DC2626';
      case 'Sprouted':
        return '#16A34A';
      case 'Undersized':
        return '#0284C7';
      case 'Discolored':
        return '#EAB308';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col justify-between max-w-md mx-auto select-none">
      {/* TOP ZONE: ONIONIQ & Batch ID */}
      <div className="p-4 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🌰</span>
            <span className="text-lg font-black tracking-tight text-white">ONIONIQ</span>
            <span className="text-[10px] font-bold bg-[#15803D] text-white px-1.5 py-0.2 rounded-xs ml-1">
              FIELD
            </span>
          </div>
          <div className="text-xs font-mono text-[#FDE047] font-semibold">{batchId}</div>
        </div>

        <button
          onClick={onCloseMobileMode}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* CENTER ZONE: Camera/Video Preview with AI Overlays */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {/* Inspection Image Feed Background */}
        <img
          src="/src/assets/images/onion_inspection_tray_1790704349459.jpg"
          alt="Mobile Inspection Tray"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Reticle guide line */}
        <div className="absolute inset-4 border border-dashed border-white/30 rounded-lg pointer-events-none" />

        {/* Bounding Boxes Overlay */}
        {activeTracks.map((track) => {
          const color = getClassColor(track.predictedClass);
          return (
            <div
              key={track.trackId}
              style={{
                left: `${track.box.x}%`,
                top: `${track.box.y}%`,
                width: `${track.box.width}%`,
                height: `${track.box.height}%`,
                borderColor: color,
              }}
              className="absolute border-2 rounded-xs pointer-events-none"
            >
              <div
                style={{ backgroundColor: color }}
                className="text-[9px] font-mono text-white px-1 py-0.2 rounded-b-xs self-start"
              >
                {track.onionId} · {track.predictedClass}
              </div>
            </div>
          );
        })}

        {/* Prototype Watermark */}
        <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-sm text-[10px] font-mono">
          Prototype Analysis Mode
        </div>
      </div>

      {/* BOTTOM ZONE: Stats and Large One-Handed Action Buttons */}
      <div className="p-4 bg-[#0F172A] border-t border-white/10 space-y-3">
        {/* Quick Tally Display */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="text-[10px] uppercase text-white/60 block">Onions Detected</span>
            <span className="text-xl font-bold font-mono text-[#22C55E] tabular-nums">
              {uniqueOnions} <span className="text-xs font-normal text-white/60">bulbs</span>
            </span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="text-[10px] uppercase text-white/60 block">Defects Identified</span>
            <span className="text-xl font-bold font-mono text-[#EF4444] tabular-nums">
              {defectCount} <span className="text-xs font-normal text-white/60">units</span>
            </span>
          </div>
        </div>

        {/* Bottom One-Handed Action Buttons */}
        <div className="space-y-2">
          {/* Primary View Results CTA */}
          <button
            onClick={handleFinish}
            className="w-full bg-[#15803D] hover:bg-[#166534] active:scale-98 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View Results ({uniqueOnions} Onions)</span>
          </button>

          {/* Secondary Action Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className="py-2.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center justify-center gap-1.5"
            >
              {isAnalyzing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAnalyzing ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => alert('Snapshot captured from camera feed.')}
              className="py-2.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture</span>
            </button>

            <label className="cursor-pointer py-2.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={() => alert('File uploaded for analysis.')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="text-[10px] text-white/50 text-center">
          Visible RGB surface detection. Internal rot requires cut verification.
        </div>
      </div>
    </div>
  );
};
