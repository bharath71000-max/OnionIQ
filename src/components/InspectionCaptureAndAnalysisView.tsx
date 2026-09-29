import React, { useState, useEffect, useRef } from 'react';
import {
  DetectedOnion,
  InspectionBatch,
  OnionClass,
} from '../types/onion';
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
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sprout,
  Ruler,
  ShieldAlert,
  ArrowRight,
  Eye,
  Sliders,
  Layers,
  Activity,
  Maximize2,
} from 'lucide-react';

interface InspectionCaptureAndAnalysisViewProps {
  initialConfig: {
    batchId: string;
    procurementCenter: string;
    inspectorName: string;
    farmerId: string;
    farmerName: string;
    variety: string;
    sampleSizeKg: number;
    location: string;
    notes: string;
    mode: 'camera' | 'upload' | 'demo';
  };
  onCompleteAnalysis: (batch: InspectionBatch) => void;
  onCancel: () => void;
}

export const InspectionCaptureAndAnalysisView: React.FC<
  InspectionCaptureAndAnalysisViewProps
> = ({ initialConfig, onCompleteAnalysis, onCancel }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [totalFrames] = useState<number>(60);
  const [detectedFrameCount, setDetectedFrameCount] = useState<number>(14);
  const [uniqueOnionCount, setUniqueOnionCount] = useState<number>(8);
  const [activeTracks, setActiveTracks] = useState<
    TrackingFrameState['activeTracks']
  >([]);
  const [isAnalysisFinished, setIsAnalysisFinished] = useState<boolean>(false);
  const [detectedOnionsList, setDetectedOnionsList] = useState<DetectedOnion[]>([]);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showConfidence, setShowConfidence] = useState<boolean>(true);
  const [selectedOnion, setSelectedOnion] = useState<DetectedOnion | null>(null);
  const [isUsingRealWebcam, setIsUsingRealWebcam] = useState<boolean>(
    initialConfig.mode === 'camera'
  );
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isGeminiProcessing, setIsGeminiProcessing] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<number>(1);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera or demo simulation
  useEffect(() => {
    let cancelSimulation: (() => void) | undefined;

    if (initialConfig.mode === 'camera') {
      startWebcam();
    }

    // Start video tracking simulation
    cancelSimulation = AIInferenceEngine.simulateVideoTracking(
      60,
      32,
      (state) => {
        setCurrentFrame(state.currentFrame);
        setDetectedFrameCount(state.detectedFrameCount);
        setUniqueOnionCount(state.uniqueOnionCount);
        setActiveTracks(state.activeTracks);

        if (state.currentFrame < 15) setPipelineStep(1);
        else if (state.currentFrame < 30) setPipelineStep(2);
        else if (state.currentFrame < 45) setPipelineStep(3);
        else setPipelineStep(4);

        if (state.isComplete) {
          setIsAnalysisFinished(true);
          setPipelineStep(5);
        }
      },
      (finalOnions) => {
        setDetectedOnionsList(finalOnions);
        if (finalOnions.length > 0) {
          setSelectedOnion(finalOnions[0]);
        }
      }
    );

    return () => {
      if (cancelSimulation) cancelSimulation();
      stopWebcam();
    };
  }, [initialConfig.mode]);

  const startWebcam = async () => {
    try {
      setWebcamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsUsingRealWebcam(true);
    } catch (err: any) {
      console.warn('Webcam permission denied or unavailable, fallback to inspection tray visualizer:', err);
      setWebcamError('Camera feed not accessible in this environment. Using standard optical simulation tray.');
      setIsUsingRealWebcam(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCaptureSnapshotWithGemini = async () => {
    setIsGeminiProcessing(true);
    try {
      // Create a canvas snapshot or use fallback sample tray
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current && isUsingRealWebcam) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      } else if (ctx) {
        // Draw synthetic inspection tray
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#15803D';
        ctx.font = '20px sans-serif';
        ctx.fillText('OnionIQ Standard Inspection Sample', 40, 50);
      }
      const base64 = canvas.toDataURL('image/jpeg', 0.85);

      const result = await AIInferenceEngine.analyzeImageWithGemini(base64);
      setDetectedOnionsList(result.detectedOnions);
      setUniqueOnionCount(result.detectedOnions.length);
      setDetectedFrameCount(Math.round(result.detectedOnions.length * 1.15));
      setIsAnalysisFinished(true);
      if (result.detectedOnions.length > 0) {
        setSelectedOnion(result.detectedOnions[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeminiProcessing(false);
    }
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setIsGeminiProcessing(true);
      const result = await AIInferenceEngine.analyzeImageWithGemini(dataUrl, file.type || 'image/jpeg');
      setDetectedOnionsList(result.detectedOnions);
      setUniqueOnionCount(result.detectedOnions.length);
      setDetectedFrameCount(Math.round(result.detectedOnions.length * 1.15));
      setIsAnalysisFinished(true);
      if (result.detectedOnions.length > 0) {
        setSelectedOnion(result.detectedOnions[0]);
      }
      setIsGeminiProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFinishAndProceed = () => {
    const onionsToUse =
      detectedOnionsList.length > 0
        ? detectedOnionsList
        : generateSampleDetectedOnions(32);

    const metrics = calculateBatchMetrics(onionsToUse, detectedFrameCount);
    const thresholds = DEFAULT_GRADING_THRESHOLDS;
    const finalGrade = evaluateFinalGrade(metrics, thresholds);

    const reportId = `RPT-ONION-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBatch: InspectionBatch = {
      id: initialConfig.batchId,
      reportId,
      procurementCenter: initialConfig.procurementCenter,
      inspectorName: initialConfig.inspectorName,
      inspectorRole: 'Agricultural Quality Inspector',
      supplierFarmerId: initialConfig.farmerId,
      supplierName: initialConfig.farmerName,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      onionVariety: initialConfig.variety,
      sampleSizeKg: initialConfig.sampleSizeKg,
      location: initialConfig.location,
      notes: initialConfig.notes,
      status: 'Pending Review',
      verificationStatus: 'AI Assessment Only',
      metrics,
      onions: onionsToUse,
      finalGrade,
      gradingRulesApplied: thresholds,
      inspectorRemarks: `Optical non-destructive scan complete. ${metrics.uniqueOnionsCount} individual bulbs tracked across ${metrics.totalDetectedFrames} frames. Surface defect breakdown: ${metrics.defectivePercent}% total defects.`,
      captureSource: isUsingRealWebcam
        ? 'live_camera'
        : initialConfig.mode === 'upload'
        ? 'uploaded_video'
        : 'demo_simulation',
      previewImageUrl: '/src/assets/images/onion_inspection_tray_1790704349459.jpg',
    };

    onCompleteAnalysis(newBatch);
  };

  const getClassColor = (cls: OnionClass) => {
    switch (cls) {
      case 'Healthy':
        return { border: '#15803D', bg: '#DCFCE7', text: '#15803D', badge: 'bg-[#DCFCE7] text-[#15803D]' };
      case 'Damaged':
        return { border: '#D97706', bg: '#FEF3C7', text: '#B45309', badge: 'bg-[#FEF3C7] text-[#B45309]' };
      case 'Rotten':
        return { border: '#DC2626', bg: '#FEE2E2', text: '#B91C1C', badge: 'bg-[#FEE2E2] text-[#B91C1C]' };
      case 'Sprouted':
        return { border: '#16A34A', bg: '#BBF7D0', text: '#166534', badge: 'bg-[#BBF7D0] text-[#166534]' };
      case 'Undersized':
        return { border: '#0284C7', bg: '#E0F2FE', text: '#0369A1', badge: 'bg-[#E0F2FE] text-[#0369A1]' };
      case 'Discolored':
        return { border: '#EAB308', bg: '#FEF9C3', text: '#854D0E', badge: 'bg-[#FEF9C3] text-[#854D0E]' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D] uppercase tracking-wider">
            <span>Video Ingest & Real-Time Tracking</span>
            <span aria-hidden="true">·</span>
            <span>Batch {initialConfig.batchId}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight mt-0.5">
            AI Multi-Object Detection & Tracking Viewport
          </h1>
          <p className="text-xs text-[#64748B]">
            {initialConfig.procurementCenter} · Variety: {initialConfig.variety} · Sample: {initialConfig.sampleSizeKg} kg
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] rounded-md text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleFinishAndProceed}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Proceed to Review & Grading</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mandatory Statutory Accuracy & Method Disclaimer */}
      <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-md p-3 flex items-start gap-2.5 text-xs text-[#854D0E]">
        <ShieldAlert className="w-4 h-4 shrink-0 text-[#CA8A04] mt-0.5" />
        <div className="leading-snug">
          <strong className="font-semibold text-[#713F12]">Model Target Protocol: </strong>
          Visible surface assessment. Non-destructive RGB camera frames do not guarantee detection of internal hidden rot unless surface fungal sporulation, neck softenings, or scale lesion symptoms are apparent. Accuracy metrics represent prototype evaluation targets awaiting formal field validation.
        </div>
      </div>

      {/* Main Viewport + Live Tracking Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Video Viewport & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Viewport Frame */}
          <div className="relative bg-[#0F172A] rounded-lg overflow-hidden border border-[#334155] aspect-16/9 flex items-center justify-center shadow-lg select-none">
            {/* Real Webcam Video element if active */}
            {isUsingRealWebcam && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Standard Optical Inspection Tray Image Background (when webcam not active) */}
            {!isUsingRealWebcam && (
              <img
                src="/src/assets/images/onion_inspection_tray_1790704349459.jpg"
                alt="Onion inspection tray"
                className="absolute inset-0 w-full h-full object-cover opacity-90 filter brightness-95"
              />
            )}

            {/* Subtle Grid Scanning Reticle */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Real-time Bounding Boxes Overlay */}
            {showBoxes &&
              activeTracks.map((track) => {
                const colors = getClassColor(track.predictedClass);
                const isSelected = selectedOnion?.id === track.onionId;

                return (
                  <div
                    key={track.trackId}
                    onClick={() => {
                      const found = detectedOnionsList.find(
                        (o) => o.id === track.onionId
                      );
                      if (found) setSelectedOnion(found);
                    }}
                    style={{
                      left: `${track.box.x}%`,
                      top: `${track.box.y}%`,
                      width: `${track.box.width}%`,
                      height: `${track.box.height}%`,
                      borderColor: isSelected ? '#FFFFFF' : colors.border,
                      boxShadow: isSelected
                        ? '0 0 0 2px #FFFFFF, 0 0 12px rgba(255,255,255,0.8)'
                        : `0 0 0 1px ${colors.border}88`,
                    }}
                    className="absolute border-2 rounded-xs cursor-pointer transition-all duration-100 flex flex-col justify-start"
                  >
                    {/* Bounding Box Tag */}
                    <div
                      style={{ backgroundColor: colors.border }}
                      className="text-white text-[9px] sm:text-[10px] font-mono px-1 py-0.2 rounded-b-xs whitespace-nowrap self-start shadow-xs flex items-center gap-1 font-semibold"
                    >
                      <span>{track.onionId}</span>
                      <span className="opacity-80">·</span>
                      <span>{track.predictedClass}</span>
                      {showConfidence && (
                        <span className="opacity-90">
                          {Math.round(track.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Corner Status HUD */}
            <div className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-xs border border-white/20 px-2.5 py-1.5 rounded-md text-white text-[11px] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>
                {isUsingRealWebcam ? 'LIVE CAMERA (30 FPS)' : 'PROTOTYPE SIMULATION'}
              </span>
              <span className="text-white/40">|</span>
              <span>FRAME {currentFrame}/{totalFrames}</span>
            </div>

            {/* Prototype Watermark Notice */}
            <div className="absolute top-3 right-3 bg-[#D97706]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              Prototype Demonstration
            </div>

            {/* Gemini Processing Loader Overlay */}
            {isGeminiProcessing && (
              <div className="absolute inset-0 bg-[#0F172A]/80 flex flex-col items-center justify-center text-white space-y-3 z-30">
                <div className="w-10 h-10 border-3 border-[#15803D] border-t-transparent rounded-full animate-spin" />
                <div className="text-xs font-semibold">Running Multimodal Surface Defect Inference...</div>
                <div className="text-[11px] text-white/70">Segmenting individual bulbs & classifying visible pathology</div>
              </div>
            )}

            {/* Bottom Ingest HUD */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#0F172A]/85 backdrop-blur-xs border border-white/20 p-2.5 rounded-md flex flex-wrap items-center justify-between text-white text-xs gap-2">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-white/60 text-[10px] uppercase block">Cumulative Detected</span>
                  <span className="font-mono font-bold text-sm text-[#FDE047] tabular-nums">
                    {detectedFrameCount} frames
                  </span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <span className="text-white/60 text-[10px] uppercase block">Unique Bulbs Tracked</span>
                  <span className="font-mono font-bold text-sm text-[#22C55E] tabular-nums">
                    {uniqueOnionCount} onions
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-2 py-1 rounded-sm text-[11px] font-medium border ${
                    showBoxes
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-transparent border-white/20 text-white/60'
                  }`}
                >
                  Boxes: {showBoxes ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setShowConfidence(!showConfidence)}
                  className={`px-2 py-1 rounded-sm text-[11px] font-medium border ${
                    showConfidence
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-transparent border-white/20 text-white/60'
                  }`}
                >
                  Scores
                </button>
              </div>
            </div>
          </div>

          {/* Controls Bar & Source Actions */}
          <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-semibold rounded-md flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
              </button>

              <button
                onClick={handleCaptureSnapshotWithGemini}
                disabled={isGeminiProcessing}
                className="px-3 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white font-semibold rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture & AI Analyze Frame</span>
              </button>

              <label className="cursor-pointer px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-semibold rounded-md flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Batch Photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleUploadFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 font-mono text-[#64748B]">
              <span>Tracking Model:</span>
              <span className="font-semibold text-[#0F172A]">YOLOv8 + ByteTrack</span>
            </div>
          </div>

          {/* Pipeline Stage Execution Strip */}
          <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Automated Computer Vision Pipeline Stages:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { step: 1, label: '1. Frame Ingest', desc: '30fps RGB normalization' },
                { step: 2, label: '2. Bulb Detection', desc: 'YOLOv8 multi-class' },
                { step: 3, label: '3. Object Tracking', desc: 'ByteTrack anti-duplicate' },
                { step: 4, label: '4. Caliper Sizing', desc: 'Equatorial diameter (mm)' },
                { step: 5, label: '5. Defect Grading', desc: 'Agmark rule engine' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-2 rounded-md border ${
                    pipelineStep >= s.step
                      ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8]'
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="text-[10px] opacity-80">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Onion Detail & Defect Tally (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Tracking Deduplication Statistics */}
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-bold text-sm text-[#0F172A]">Temporal Anti-Duplicate Count</span>
              <Activity className="w-4 h-4 text-[#15803D]" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                <div className="text-[11px] text-[#64748B]">Raw Detections</div>
                <div className="text-xl font-bold font-mono text-[#0F172A] tabular-nums mt-0.5">
                  {detectedFrameCount}
                </div>
                <div className="text-[10px] text-[#94A3B8]">Across video frames</div>
              </div>

              <div className="bg-[#F0FDF4] p-2.5 rounded-md border border-[#BBF7D0]">
                <div className="text-[11px] text-[#15803D] font-medium">Unique Count</div>
                <div className="text-xl font-bold font-mono text-[#15803D] tabular-nums mt-0.5">
                  {uniqueOnionCount}
                </div>
                <div className="text-[10px] text-[#166534]">Deduplicated onions</div>
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] leading-relaxed">
              Spatial association maintains persistent IDs as conveyor or camera moves, preventing double-counting the same onion bulb.
            </div>
          </div>

          {/* Selected Detected Onion Inspector Card */}
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <span className="font-bold text-sm text-[#0F172A]">
                {selectedOnion ? `Selected Bulb ${selectedOnion.id}` : 'Select a Bounding Box'}
              </span>
              {selectedOnion && (
                <span className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold ${getClassColor(selectedOnion.predictedClass).badge}`}>
                  {selectedOnion.predictedClass}
                </span>
              )}
            </div>

            {selectedOnion ? (
              <div className="space-y-3 text-xs">
                {/* Visual Bulb Crop Preview */}
                <div className="relative h-28 bg-[#1E293B] rounded-md overflow-hidden flex items-center justify-center border border-[#334155]">
                  <div
                    style={{ backgroundColor: selectedOnion.cropColor }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30"
                  >
                    🌰
                  </div>
                  <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                    Track #{selectedOnion.trackId}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Confidence Target:</span>
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {Math.round(selectedOnion.confidence * 100)}% (Prototype)
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Equatorial Diameter:</span>
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {selectedOnion.estimatedDiameterMm} mm
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Size Classification:</span>
                    <span className="font-medium text-[#0F172A]">
                      {selectedOnion.sizeCategory}
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[#64748B] block mb-1">Visible Surface Indicators:</span>
                    <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#334155] leading-relaxed">
                      {selectedOnion.visibleIndicators}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                Click any detected bounding box on the camera viewport to view classification details.
              </div>
            )}
          </div>

          {/* Quick Finish CTA Button */}
          <button
            onClick={handleFinishAndProceed}
            className="w-full bg-[#15803D] hover:bg-[#166534] text-white py-3 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Finish Scan & Review Batch ({uniqueOnionCount} Onions)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
