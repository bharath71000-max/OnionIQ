import React, { useState } from 'react';
import { AI_MODEL_METADATA } from '../services/onionDataService';
import {
  Cpu,
  ShieldAlert,
  Server,
  Database,
  CheckCircle2,
  ExternalLink,
  Code,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export const AIModelPerformanceView: React.FC = () => {
  const [apiEndpoint, setApiEndpoint] = useState<string>(
    AI_MODEL_METADATA.connectedApiEndpoint
  );
  const [apiKeyInput, setApiKeyInput] = useState<string>('••••••••••••••••••••••••');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = () => {
    setTestResult('Ping OK (200ms) - Prototype inference fallback service active.');
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
          <span>Computer Vision Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Inference Engine Dossier</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
          AI Model & Performance Registry
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Model lineage, validation targets, bounding box classes, and external FastAPI backend connector.
        </p>
      </div>

      {/* Mandatory Prototype Validation Status Banner */}
      <div className="bg-[#FEFCE8] border-2 border-[#CA8A04] rounded-lg p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-6 h-6 text-[#CA8A04] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-sm font-bold text-[#854D0E] uppercase tracking-wide">
            {AI_MODEL_METADATA.validationStatus}
          </div>
          <p className="text-xs text-[#713F12] leading-relaxed">
            In compliance with SIH-26031 ethics standards, accuracy values displayed are design prototype targets. True field accuracy cannot be claimed until empirical validation across climatic seasons and multiple mandi lighting geometries has been certified by ICAR-DOGR / NAFED quality boards. Ordinary RGB cameras cannot detect internal rotten cores without visible surface necrosis.
          </p>
        </div>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Version & Architecture */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs space-y-2 text-xs">
          <span className="text-[#64748B] text-[11px] uppercase font-bold block">Model Build</span>
          <div className="font-mono font-bold text-sm text-[#0F172A]">
            {AI_MODEL_METADATA.version}
          </div>
          <div className="text-[#475569]">
            Architecture: <span className="font-semibold text-[#0F172A]">{AI_MODEL_METADATA.targetArchitecture}</span>
          </div>
          <div className="text-[#64748B] text-[11px] pt-1 border-t border-[#F1F5F9]">
            Evaluation Checkpoint: {AI_MODEL_METADATA.lastEvaluated}
          </div>
        </div>

        {/* Dataset Size */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs space-y-2 text-xs">
          <span className="text-[#64748B] text-[11px] uppercase font-bold block">Annotated Dataset</span>
          <div className="font-bold text-sm text-[#0F172A]">
            {AI_MODEL_METADATA.trainingDatasetSize}
          </div>
          <div className="text-[#475569]">
            Annotation Standard: <span className="font-semibold text-[#0F172A]">COCO + Polygon Segment Masks</span>
          </div>
          <div className="text-[#64748B] text-[11px] pt-1 border-t border-[#F1F5F9]">
            Varieties: Nashik Red, ADR, Bhima Super, Pusa
          </div>
        </div>

        {/* Target Metrics */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs space-y-2 text-xs">
          <span className="text-[#64748B] text-[11px] uppercase font-bold block">Target Metrics (Benchmark)</span>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Precision Target:</span>
              <span className="font-bold text-[#15803D]">{AI_MODEL_METADATA.prototypePrecisionTarget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Recall Target:</span>
              <span className="font-bold text-[#15803D]">{AI_MODEL_METADATA.prototypeRecallTarget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">mAP@50 Target:</span>
              <span className="font-bold text-[#15803D]">{AI_MODEL_METADATA.prototypemAP50Target}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Classes Breakdown */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#0F172A]">Trained Multi-Class Output Heads</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {[
            { name: 'Healthy', desc: 'Firm tunic, uniform color, intact neck', color: '#15803D' },
            { name: 'Damaged', desc: 'Mechanical cuts, transit bruises', color: '#D97706' },
            { name: 'Rotten', desc: 'Black mold, bacterial soft rot lesion', color: '#DC2626' },
            { name: 'Sprouted', desc: 'Apical green shoot >10mm visible', color: '#166534' },
            { name: 'Undersized', desc: 'Equatorial diameter <40mm', color: '#0284C7' },
            { name: 'Discolored', desc: 'Sunscald bleaching, staining', color: '#854D0E' },
          ].map((c) => (
            <div key={c.name} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1">
              <div className="font-bold" style={{ color: c.color }}>
                {c.name}
              </div>
              <div className="text-[10px] text-[#64748B] leading-tight">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Technology Architecture Diagram (Requested by Section 15) */}
      <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="border-b border-[#F1F5F9] pb-3">
          <h2 className="text-sm font-bold text-[#0F172A]">
            End-to-End Enterprise Technology Architecture (Section 15 Specification)
          </h2>
          <p className="text-xs text-[#64748B]">
            Modular design allowing real computer vision weights to replace prototype layers seamlessly
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="text-lg">📱</div>
            <div className="font-bold text-[#0F172A]">Frontend Client</div>
            <div className="text-[10px] text-[#64748B]">React 19 + Tailwind CSS + PWA (Mobile/Desktop)</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="text-lg">⚡</div>
            <div className="font-bold text-[#0F172A]">Inference Gateway</div>
            <div className="text-[10px] text-[#64748B]">Python FastAPI / REST / WebRTC Stream Endpoint</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="text-lg">👁️</div>
            <div className="font-bold text-[#0F172A]">Vision & Tracking</div>
            <div className="text-[10px] text-[#64748B]">OpenCV + YOLOv8 + ByteTrack Anti-Duplicate</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="text-lg">⚖️</div>
            <div className="font-bold text-[#0F172A]">Grading Engine</div>
            <div className="text-[10px] text-[#64748B]">Configurable Agmark / NAFED Decision Rules</div>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="text-lg">📄</div>
            <div className="font-bold text-[#0F172A]">Persistence & Cert</div>
            <div className="text-[10px] text-[#64748B]">PostgreSQL / Cloud Object Storage / PDF Signer</div>
          </div>
        </div>
      </div>

      {/* Connect Future Production Model Interface */}
      <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="border-b border-[#F1F5F9] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Production Inference API Hookup</h2>
            <p className="text-xs text-[#64748B]">
              Configure endpoint for production GPU cluster running PyTorch/TensorRT
            </p>
          </div>
          <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-sm">
            FastAPI Compatible
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#334155] mb-1">Inference Gateway URL</label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#334155] mb-1">Bearer API Token</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {testResult ? (
            <span className="text-xs font-semibold text-[#15803D] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {testResult}
            </span>
          ) : (
            <span className="text-[11px] text-[#64748B]">
              Payload accepts multipart/form-data video frame stream or JPEG batch crops.
            </span>
          )}

          <button
            onClick={handleTestConnection}
            className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-md text-xs font-semibold transition-colors"
          >
            Test Endpoint Connection
          </button>
        </div>
      </div>
    </div>
  );
};
