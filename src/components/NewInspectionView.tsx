import React, { useState } from 'react';
import {
  PROCUREMENT_CENTERS,
  ONION_VARIETIES,
} from '../services/onionDataService';
import {
  Camera,
  Upload,
  PlayCircle,
  Lightbulb,
  Sparkles,
  Info,
  Calendar,
  User,
  Scale,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';

interface NewInspectionViewProps {
  onStartCapture: (config: {
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
  }) => void;
  onNavigate: (view: string) => void;
}

export const NewInspectionView: React.FC<NewInspectionViewProps> = ({
  onStartCapture,
  onNavigate,
}) => {
  const currentTimestamp = new Date();
  const defaultBatchId = `BATCH-${currentTimestamp.getFullYear()}-${String(
    currentTimestamp.getMonth() + 1
  ).padStart(2, '0')}${String(currentTimestamp.getDate()).padStart(2, '0')}-${Math.floor(
    100 + Math.random() * 900
  )}`;

  const [batchId, setBatchId] = useState(defaultBatchId);
  const [procurementCenter, setProcurementCenter] = useState(PROCUREMENT_CENTERS[0]);
  const [inspectorName, setInspectorName] = useState('Rajesh Deshmukh (Inspector Group A)');
  const [farmerId, setFarmerId] = useState('FARM-MH-5832');
  const [farmerName, setFarmerName] = useState('Dattatraya Shinde');
  const [variety, setVariety] = useState(ONION_VARIETIES[0]);
  const [sampleSizeKg, setSampleSizeKg] = useState<number>(10.0);
  const [location, setLocation] = useState('Weighment Bay 2, APMC Main Yard');
  const [notes, setNotes] = useState('Late kharif harvest arrival. Uniform curing observed, minimal field soil.');

  const handleSubmit = (mode: 'camera' | 'upload' | 'demo') => {
    onStartCapture({
      batchId,
      procurementCenter,
      inspectorName,
      farmerId,
      farmerName,
      variety,
      sampleSizeKg,
      location,
      notes,
      mode,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
          <span>Procurement Ingest Workflow</span>
          <span aria-hidden="true">·</span>
          <span>Step 1 of 4</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
          Initiate Batch Quality Inspection
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Register lot provenance and enter sample metrics before commencing AI non-destructive optical scan.
        </p>
      </div>

      {/* Mandatory Inspection Guidance Banner */}
      <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg p-4 flex items-start gap-3.5">
        <Lightbulb className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
        <div className="text-xs text-[#065F46] leading-relaxed">
          <strong className="font-semibold text-[#064E3B] text-sm block mb-0.5">
            Standard Operating Protocol for Accurate Visual Grading:
          </strong>
          Place onions in a single visible layer under adequate diffuse illumination. Avoid multi-layer stacking or deep overlaps so the AI object detector can isolate individual bulb silhouettes and measure diameters accurately. Ensure outer scales are dry with loose dry dirt dusted off.
        </div>
      </div>

      {/* Primary Form Card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-5">
        <div className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2 flex items-center justify-between">
          <span>Batch & Provenance Details</span>
          <span className="text-xs text-[#64748B] font-normal">All fields compliant with Mandi e-NAM register</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Batch ID */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Lot / Batch Identification
            </label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D]"
            />
          </div>

          {/* Procurement Center */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Procurement Center / APMC Mandi
            </label>
            <select
              value={procurementCenter}
              onChange={(e) => setProcurementCenter(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            >
              {PROCUREMENT_CENTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Farmer ID */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Supplier / Farmer Registration ID
            </label>
            <input
              type="text"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          {/* Farmer Name */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Farmer / Grower Full Name
            </label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          {/* Onion Variety */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Onion Cultivar / Commercial Variety
            </label>
            <select
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            >
              {ONION_VARIETIES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Sample Size (kg) */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Sample Net Weight (Kilograms)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="1"
                max="100"
                value={sampleSizeKg}
                onChange={(e) => setSampleSizeKg(parseFloat(e.target.value) || 10)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
              />
              <span className="absolute right-3 top-2 text-[#94A3B8] font-medium text-xs">KG</span>
            </div>
          </div>

          {/* Inspector Name */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Designated Quality Inspector
            </label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Inspection Bay / Physical Station
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          {/* Remarks/Notes */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#334155] mb-1">
              Preliminary Inspector Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>
        </div>
      </div>

      {/* Capture Options Selection */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#0F172A]">Choose Inspection Feed Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Live Camera / Mobile */}
          <div
            onClick={() => handleSubmit('camera')}
            className="group cursor-pointer bg-white hover:border-[#15803D] hover:shadow-md transition-all p-5 rounded-lg border border-[#E2E8F0] space-y-3 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#15803D] transition-colors">
                Live Camera Ingest
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Open smartphone or mounted industrial inspection camera. Stream live feed over the sample tray.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#15803D]">
              <span>Launch Camera Feed</span>
              <span>→</span>
            </div>
          </div>

          {/* Option 2: Upload Video or Image */}
          <div
            onClick={() => handleSubmit('upload')}
            className="group cursor-pointer bg-white hover:border-[#15803D] hover:shadow-md transition-all p-5 rounded-lg border border-[#E2E8F0] space-y-3 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                Upload Video or Photo
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Upload recorded MP4/MOV conveyor footage or high-resolution batch photo for offline CV batch evaluation.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#2563EB]">
              <span>Select Local File</span>
              <span>→</span>
            </div>
          </div>

          {/* Option 3: Run Demo Inspection */}
          <div
            onClick={() => handleSubmit('demo')}
            className="group cursor-pointer bg-linear-to-br from-[#F0FDF4] to-[#FEFCE8] hover:border-[#15803D] hover:shadow-md transition-all p-5 rounded-lg border-2 border-[#15803D]/40 space-y-3 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-[#15803D] flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#15803D] transition-colors">
                  Run Demo Inspection
                </h3>
                <span className="text-[10px] font-bold bg-[#15803D] text-white px-1.5 py-0.2 rounded-xs">
                  READY
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                Instant simulation with realistic 32-bulb tracking, defect isolation, frame association, and automated grading.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#15803D]">
              <span>Simulate Full Pipeline</span>
              <span>⚡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
