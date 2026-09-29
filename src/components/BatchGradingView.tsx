import React, { useState } from 'react';
import { InspectionBatch, UserRole } from '../types/onion';
import {
  OnionDataService,
  DEFAULT_GRADING_THRESHOLDS,
} from '../services/onionDataService';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Scale,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Check,
} from 'lucide-react';

interface BatchGradingViewProps {
  batch: InspectionBatch;
  currentRole: UserRole;
  onUpdateBatch: (updatedBatch: InspectionBatch) => void;
  onNavigate: (view: string) => void;
}

export const BatchGradingView: React.FC<BatchGradingViewProps> = ({
  batch,
  currentRole,
  onUpdateBatch,
  onNavigate,
}) => {
  const [officerRemarks, setOfficerRemarks] = useState<string>(
    batch.officerRemarks || 'Verified against procurement quality schedule. Approved for buffer stock depot ingest.'
  );
  const [approvedNotification, setApprovedNotification] = useState<boolean>(false);

  const thresholds = batch.gradingRulesApplied || DEFAULT_GRADING_THRESHOLDS;
  const { metrics } = batch;

  const rotPercent =
    Math.round((metrics.defectCounts.rotten / metrics.uniqueOnionsCount) * 1000) / 10;
  const sproutPercent =
    Math.round((metrics.defectCounts.sprouted / metrics.uniqueOnionsCount) * 1000) / 10;
  const damagePercent =
    Math.round((metrics.defectCounts.damaged / metrics.uniqueOnionsCount) * 1000) / 10;

  const handleApproveBatch = () => {
    const updated: InspectionBatch = {
      ...batch,
      status: 'Approved',
      verificationStatus: 'Countersigned by Officer',
      officerRemarks,
      approvedBy:
        currentRole === 'officer'
          ? 'Pravin Jadhav (Procurement Officer, NAFED)'
          : 'Quality Council Board',
      approvedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    OnionDataService.updateBatch(updated);
    onUpdateBatch(updated);
    setApprovedNotification(true);
    setTimeout(() => {
      onNavigate('report');
    }, 1200);
  };

  const getGradeStyle = (grade: string) => {
    if (grade.includes('Grade A')) {
      return {
        bg: 'bg-[#DCFCE7]',
        border: 'border-[#15803D]',
        text: 'text-[#15803D]',
        badge: 'bg-[#15803D] text-white',
      };
    }
    if (grade.includes('Grade B')) {
      return {
        bg: 'bg-[#FEF3C7]',
        border: 'border-[#D97706]',
        text: 'text-[#B45309]',
        badge: 'bg-[#D97706] text-white',
      };
    }
    return {
      bg: 'bg-[#FEE2E2]',
      border: 'border-[#DC2626]',
      text: 'text-[#B91C1C]',
      badge: 'bg-[#DC2626] text-white',
    };
  };

  const gradeStyle = getGradeStyle(batch.finalGrade);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>Regulatory Decision Engine</span>
            <span aria-hidden="true">·</span>
            <span>Batch {batch.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Batch Grading Engine & Formal Classification
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cross-referencing computer vision telemetry against configured Agmark / NAFED procurement thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('review')}
            className="px-3 py-2 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bulb Review</span>
          </button>
        </div>
      </div>

      {approvedNotification && (
        <div className="bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] p-4 rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
          <span>Batch certified and countersigned! Redirecting to Digital Quality Report...</span>
        </div>
      )}

      {/* Required Prompt Formula Block */}
      <div className="bg-linear-to-r from-[#F0FDF4] via-white to-[#FEFCE8] p-5 rounded-lg border border-[#CBD5E1] shadow-xs">
        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
          Mathematical Grading Logic Matrix:
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="p-3 bg-white rounded-md border border-[#E2E8F0] shadow-2xs flex-1 w-full">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">1. AI Surface Assessment</div>
            <div className="text-sm font-bold text-[#0F172A] mt-1">
              Defects: <span className="font-mono text-[#DC2626]">{metrics.defectivePercent}%</span> · Caliper:{' '}
              <span className="font-mono text-[#15803D]">{metrics.averageDiameterMm}mm</span>
            </div>
            <div className="text-[11px] text-[#64748B]">Rot: {rotPercent}% · Sprout: {sproutPercent}%</div>
          </div>

          <span className="text-xl font-black text-[#64748B]">+</span>

          <div className="p-3 bg-white rounded-md border border-[#E2E8F0] shadow-2xs flex-1 w-full">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">2. Configured Standard</div>
            <div className="text-sm font-bold text-[#0F172A] mt-1">{thresholds.standardReference}</div>
            <div className="text-[11px] text-[#64748B]">
              Max Defect: {thresholds.gradeAMaxDefectPercent}% · Min Caliper: {thresholds.gradeAMinDiameterMm}mm
            </div>
          </div>

          <span className="text-xl font-black text-[#64748B]">=</span>

          <div className={`p-3 rounded-md border-2 shadow-2xs flex-1 w-full ${gradeStyle.bg} ${gradeStyle.border}`}>
            <div className="text-[10px] uppercase font-bold opacity-80">3. Final Batch Grade</div>
            <div className={`text-base font-extrabold mt-1 ${gradeStyle.text}`}>
              {batch.finalGrade}
            </div>
            <div className="text-[11px] opacity-90">Official procurement classification</div>
          </div>
        </div>
      </div>

      {/* Threshold Comparison Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <h2 className="text-base font-bold text-[#0F172A]">Threshold Compliance Audit</h2>
          <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-sm">
            Ruleset: {thresholds.standardReference}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-3">Quality Parameter</th>
                <th className="py-2.5 px-3">Observed Batch Value</th>
                <th className="py-2.5 px-3">Grade A Maximum Ceiling</th>
                <th className="py-2.5 px-3">Compliance Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
              {/* Total Defectives */}
              <tr>
                <td className="py-2.5 px-3 font-medium">Aggregate Defective Rate</td>
                <td className="py-2.5 px-3 font-mono font-bold tabular-nums">
                  {metrics.defectivePercent}%
                </td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-[#64748B]">
                  &le; {thresholds.gradeAMaxDefectPercent}%
                </td>
                <td className="py-2.5 px-3">
                  {metrics.defectivePercent <= thresholds.gradeAMaxDefectPercent ? (
                    <span className="text-[#15803D] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passes Ceiling
                    </span>
                  ) : (
                    <span className="text-[#D97706] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Exceeds Grade A Ceiling
                    </span>
                  )}
                </td>
              </tr>

              {/* Surface Rot */}
              <tr>
                <td className="py-2.5 px-3 font-medium">Visible Surface Rot (Black Mold / Soft Rot)</td>
                <td className="py-2.5 px-3 font-mono font-bold tabular-nums">
                  {rotPercent}% ({metrics.defectCounts.rotten} bulbs)
                </td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-[#64748B]">
                  &le; {thresholds.gradeAMaxRotPercent}%
                </td>
                <td className="py-2.5 px-3">
                  {rotPercent <= thresholds.gradeAMaxRotPercent ? (
                    <span className="text-[#15803D] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Safe for Buffer Storage
                    </span>
                  ) : (
                    <span className="text-[#DC2626] font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> High Rot Risk
                    </span>
                  )}
                </td>
              </tr>

              {/* Sprouting */}
              <tr>
                <td className="py-2.5 px-3 font-medium">Apical Vegetative Sprouting</td>
                <td className="py-2.5 px-3 font-mono font-bold tabular-nums">
                  {sproutPercent}% ({metrics.defectCounts.sprouted} bulbs)
                </td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-[#64748B]">
                  &le; {thresholds.gradeAMaxSproutPercent}%
                </td>
                <td className="py-2.5 px-3">
                  {sproutPercent <= thresholds.gradeAMaxSproutPercent ? (
                    <span className="text-[#15803D] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dormant Scales
                    </span>
                  ) : (
                    <span className="text-[#D97706] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Active Sprouting
                    </span>
                  )}
                </td>
              </tr>

              {/* Mean Caliper Diameter */}
              <tr>
                <td className="py-2.5 px-3 font-medium">Average Bulb Diameter (Equatorial)</td>
                <td className="py-2.5 px-3 font-mono font-bold tabular-nums">
                  {metrics.averageDiameterMm} mm
                </td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-[#64748B]">
                  &ge; {thresholds.gradeAMinDiameterMm} mm
                </td>
                <td className="py-2.5 px-3">
                  {metrics.averageDiameterMm >= thresholds.gradeAMinDiameterMm ? (
                    <span className="text-[#15803D] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Commercial Table Size
                    </span>
                  ) : (
                    <span className="text-[#0284C7] font-semibold flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" /> Sub-Sized Caliber
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Procurement Officer Sign-Off Station */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <span className="font-bold text-sm text-[#0F172A]">
            Officer Quality Certification & Final Authorization
          </span>
          <span className="text-xs text-[#64748B]">Acting as: {currentRole}</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Procurement Officer Ingest Remarks / Price Slab Order:
          </label>
          <textarea
            rows={2}
            value={officerRemarks}
            onChange={(e) => setOfficerRemarks(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md p-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-[#64748B]">
            Authorizing records cryptographic batch stamp and generates digital certificate.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2.5 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md font-semibold text-xs transition-colors"
            >
              Preview Draft Report
            </button>

            <button
              onClick={handleApproveBatch}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-2.5 rounded-md font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FileCheck className="w-4 h-4" />
              <span>Approve & Finalize Digital Quality Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
