import React, { useState } from 'react';
import { GradingThresholds } from '../types/onion';
import { OnionDataService, DEFAULT_GRADING_THRESHOLDS } from '../services/onionDataService';
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [thresholds, setThresholds] = useState<GradingThresholds>(
    OnionDataService.getThresholds()
  );
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  const handleSave = () => {
    OnionDataService.updateThresholds(thresholds);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleResetDefaults = () => {
    setThresholds({ ...DEFAULT_GRADING_THRESHOLDS });
    OnionDataService.updateThresholds(DEFAULT_GRADING_THRESHOLDS);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
          <span>Regulatory Policy Engine</span>
          <span aria-hidden="true">·</span>
          <span>Admin Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
          Configurable Quality Standards & Grading Rules
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Authorized administrators can calibrate maximum defect ceilings and minimum caliper thresholds to align with official government procurement circulars.
        </p>
      </div>

      {savedNotification && (
        <div className="bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] p-3.5 rounded-md text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Grading engine parameters updated and saved to local registry.</span>
        </div>
      )}

      {/* Thresholds Form */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-6">
        <div className="border-b border-[#F1F5F9] pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F172A]">Grade Threshold Constants</h2>
          <span className="text-xs text-[#64748B]">Last updated: {thresholds.lastUpdatedAt}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* Reference Standard Name */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#334155] mb-1">
              Applicable Standard Reference / Gazette Circular
            </label>
            <input
              type="text"
              value={thresholds.standardReference}
              onChange={(e) =>
                setThresholds({ ...thresholds, standardReference: e.target.value })
              }
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          {/* Grade A Max Defect % */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Grade A Maximum Total Defect Ceiling (%)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="25"
              value={thresholds.gradeAMaxDefectPercent}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  gradeAMaxDefectPercent: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
            <span className="text-[10px] text-[#64748B] block mt-1">
              Lots with higher aggregate visible defects drop to Grade B or URS.
            </span>
          </div>

          {/* Grade A Min Diameter mm */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Grade A Minimum Equatorial Diameter (mm)
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="70"
              value={thresholds.gradeAMinDiameterMm}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  gradeAMinDiameterMm: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
            />
            <span className="text-[10px] text-[#64748B] block mt-1">
              Standard commercial table onion lower caliper boundary.
            </span>
          </div>

          {/* Grade A Max Rot % */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Grade A Maximum Surface Rot Tolerance (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={thresholds.gradeAMaxRotPercent}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  gradeAMaxRotPercent: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold text-[#DC2626] focus:outline-hidden focus:border-[#15803D]"
            />
            <span className="text-[10px] text-[#64748B] block mt-1">
              Critical for buffer storage; fungal spores spread rapidly in ventilated godowns.
            </span>
          </div>

          {/* Grade A Max Sprout % */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              Grade A Maximum Sprout Tolerance (%)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={thresholds.gradeAMaxSproutPercent}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  gradeAMaxSproutPercent: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold text-[#15803D] focus:outline-hidden focus:border-[#15803D]"
            />
            <span className="text-[10px] text-[#64748B] block mt-1">
              Emergent green shoots indicate dormancy break and reduced shelf-life.
            </span>
          </div>

          {/* URS Max Defect % */}
          <div>
            <label className="block font-semibold text-[#334155] mb-1">
              URS (Substandard / Discounted) Upper Ceiling (%)
            </label>
            <input
              type="number"
              step="1"
              min="10"
              max="40"
              value={thresholds.ursMaxDefectPercent}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  ursMaxDefectPercent: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold text-[#D97706] focus:outline-hidden focus:border-[#15803D]"
            />
            <span className="text-[10px] text-[#64748B] block mt-1">
              Threshold above which lot is completely rejected for procurement.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Official Agmark Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-2 rounded-md font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Configured Thresholds</span>
          </button>
        </div>
      </div>
    </div>
  );
};
