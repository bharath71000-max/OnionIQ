import React, { useState } from 'react';
import { InspectionBatch, DetectedOnion, OnionClass } from '../types/onion';
import { OnionDataService } from '../services/onionDataService';
import {
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface IndividualOnionReviewViewProps {
  batch: InspectionBatch;
  selectedOnionId?: string;
  onUpdateBatch: (updatedBatch: InspectionBatch) => void;
  onNavigate: (view: string) => void;
}

export const IndividualOnionReviewView: React.FC<IndividualOnionReviewViewProps> = ({
  batch,
  selectedOnionId,
  onUpdateBatch,
  onNavigate,
}) => {
  const [activeOnionId, setActiveOnionId] = useState<string>(
    selectedOnionId || (batch.onions[0]?.id ?? '#001')
  );
  const [filterClass, setFilterClass] = useState<string>('All');
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [overrideSelection, setOverrideSelection] = useState<OnionClass | null>(null);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const activeOnion = batch.onions.find((o) => o.id === activeOnionId) || batch.onions[0];

  const handleDecision = (
    decision: DetectedOnion['inspectorDecision'],
    overrideClass?: OnionClass
  ) => {
    if (!activeOnion) return;

    const chosenClass = overrideClass || overrideSelection || activeOnion.predictedClass;
    const updated = OnionDataService.updateOnionDecision(
      batch.id,
      activeOnion.id,
      decision,
      decision === 'Overridden' ? chosenClass : undefined,
      remarksInput || activeOnion.inspectorRemarks
    );

    if (updated) {
      onUpdateBatch(updated);
      setSaveNotification(`Bulb ${activeOnion.id} marked as ${decision}. Metrics updated.`);
      setTimeout(() => setSaveNotification(null), 3000);
    }
  };

  const onionClasses: OnionClass[] = [
    'Healthy',
    'Damaged',
    'Rotten',
    'Sprouted',
    'Undersized',
    'Discolored',
  ];

  const getEffectiveClass = (o: DetectedOnion): OnionClass => {
    return o.inspectorDecision === 'Overridden' && o.inspectorClass
      ? o.inspectorClass
      : o.predictedClass;
  };

  const filteredOnions = batch.onions.filter((o) => {
    if (filterClass === 'All') return true;
    return getEffectiveClass(o) === filterClass;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>Human-in-the-Loop Verification</span>
            <span aria-hidden="true">·</span>
            <span>Batch {batch.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Individual Detected Bulb Audit
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Validate computer-vision detections, override misclassifications, and record inspector remarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('results')}
            className="px-3 py-2 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Summary</span>
          </button>
          <button
            onClick={() => onNavigate('grading')}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Proceed to Final Grading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {saveNotification && (
        <div className="bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] p-3 rounded-md text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Onion Thumbnails List / Selector (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <span className="font-bold text-sm text-[#0F172A]">
              Bulb Registry ({batch.onions.length})
            </span>
            <div className="flex items-center gap-1">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="text-xs border border-[#CBD5E1] rounded-md px-2 py-1 bg-[#F8FAFC]"
              >
                <option value="All">All Classes</option>
                {onionClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scrollable List of detected onions */}
          <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1">
            {filteredOnions.map((o) => {
              const effectiveClass = getEffectiveClass(o);
              const isSelected = o.id === activeOnion?.id;

              return (
                <div
                  key={o.id}
                  onClick={() => {
                    setActiveOnionId(o.id);
                    setRemarksInput(o.inspectorRemarks || '');
                    setOverrideSelection(null);
                  }}
                  className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#F0FDF4] border-[#15803D] ring-2 ring-[#15803D]/20 shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-lg text-white">
                      🌰
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0F172A]">{o.id}</span>
                        <span className="text-[10px] text-[#64748B]">Track #{o.trackId}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#15803D]">
                        {effectiveClass}
                        {o.inspectorDecision === 'Overridden' && (
                          <span className="text-[10px] text-[#D97706] ml-1.5 font-normal">
                            (Inspector Override)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-[#0F172A] tabular-nums">
                      {o.estimatedDiameterMm} mm
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      {Math.round(o.confidence * 100)}% conf
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Single Onion Inspection & Review Panel (7 cols) */}
        {activeOnion ? (
          <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <span className="text-xs font-semibold text-[#15803D] uppercase">Individual Inspection</span>
                <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">
                  Bulb {activeOnion.id} Analysis Dossier
                </h2>
              </div>
              <span className="font-mono text-xs text-[#64748B]">Track #{activeOnion.trackId}</span>
            </div>

            {/* Visual Frame Crop & Key Caliper Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-4/3 bg-[#0F172A] rounded-lg overflow-hidden flex items-center justify-center border border-[#334155] shadow-inner">
                <div
                  style={{ backgroundColor: activeOnion.cropColor }}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl border-2 border-white/40"
                >
                  🌰
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-sm">
                  Optical Crop View
                </div>
                <div className="absolute bottom-2 right-2 bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  {activeOnion.estimatedDiameterMm} mm Caliper
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">AI Model Prediction:</span>
                  <span className="font-bold text-[#0F172A]">{activeOnion.predictedClass}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Model Target Confidence:</span>
                  <span className="font-mono font-semibold text-[#0F172A]">
                    {Math.round(activeOnion.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Size Category:</span>
                  <span className="font-medium text-[#0F172A]">{activeOnion.sizeCategory}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Inspector Audit Status:</span>
                  <span className="font-bold text-[#15803D]">{activeOnion.inspectorDecision}</span>
                </div>

                <div className="pt-1">
                  <span className="text-[#64748B] block text-[11px] font-semibold mb-1">
                    Visible Optical Diagnostics:
                  </span>
                  <p className="text-[11px] text-[#334155] leading-relaxed bg-white p-2 rounded-sm border border-[#E2E8F0]">
                    {activeOnion.visibleIndicators}
                  </p>
                </div>
              </div>
            </div>

            {/* Inspector Decision Station */}
            <div className="bg-[#F0FDF4] p-5 rounded-lg border border-[#BBF7D0] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">
                  Inspector Review & Classification Decision
                </span>
                <span className="text-[11px] text-[#166534]">
                  Human verification required for official procurement
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleDecision('Confirmed')}
                  className="bg-[#15803D] hover:bg-[#166534] text-white py-2.5 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm AI Result</span>
                </button>

                <button
                  onClick={() => handleDecision('Uncertain')}
                  className="bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#334155] py-2.5 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#64748B]" />
                  <span>Flag as Uncertain</span>
                </button>

                <div className="relative">
                  <select
                    value={overrideSelection || getEffectiveClass(activeOnion)}
                    onChange={(e) => {
                      const newCls = e.target.value as OnionClass;
                      setOverrideSelection(newCls);
                      handleDecision('Overridden', newCls);
                    }}
                    className="w-full bg-[#FEF3C7] border border-[#D97706] text-[#B45309] font-bold py-2.5 px-3 rounded-md text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="" disabled>
                      Override Classification...
                    </option>
                    {onionClasses.map((c) => (
                      <option key={c} value={c}>
                        Override: {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inspector Remarks input */}
              <div>
                <label className="block text-xs font-semibold text-[#166534] mb-1">
                  Inspector Audit Note / Physical Touch Verification:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Firm scales confirmed upon physical squeeze; superficial dust stain only."
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                    className="flex-1 bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
                  />
                  <button
                    onClick={() => handleDecision(activeOnion.inspectorDecision, overrideSelection || undefined)}
                    className="px-3 py-1.5 bg-[#15803D] text-white rounded-md text-xs font-semibold hover:bg-[#166534]"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <span>Batch statistics automatically update upon each inspector decision.</span>
              <button
                onClick={() => onNavigate('grading')}
                className="text-[#15803D] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Proceed to Batch Grading</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white p-12 text-center text-[#94A3B8] rounded-lg border border-[#E2E8F0]">
            Select a bulb from the left column to audit.
          </div>
        )}
      </div>
    </div>
  );
};
