import React, { useState } from 'react';
import { InspectionBatch, OnionClass, DetectedOnion } from '../types/onion';
import {
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sprout,
  Ruler,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sliders,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface AnalysisResultsViewProps {
  batch: InspectionBatch;
  onNavigate: (view: string) => void;
  onSelectOnionForReview: (onion: DetectedOnion) => void;
}

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({
  batch,
  onNavigate,
  onSelectOnionForReview,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const { metrics } = batch;

  // Filter onions by clicked category
  const filteredOnions = batch.onions.filter((o) => {
    const effectiveClass =
      o.inspectorDecision === 'Overridden' && o.inspectorClass
        ? o.inspectorClass
        : o.predictedClass;
    if (activeCategoryFilter === 'All') return true;
    if (activeCategoryFilter === 'GradeA') return effectiveClass === 'Healthy';
    if (activeCategoryFilter === 'URS')
      return effectiveClass === 'Undersized' || effectiveClass === 'Discolored';
    if (activeCategoryFilter === 'Defective')
      return (
        effectiveClass === 'Damaged' ||
        effectiveClass === 'Rotten' ||
        effectiveClass === 'Sprouted'
      );
    return effectiveClass === activeCategoryFilter;
  });

  const getDefectColor = (cls: string) => {
    switch (cls) {
      case 'Healthy':
        return 'text-[#15803D] bg-[#DCFCE7] border-[#BBF7D0]';
      case 'Damaged':
        return 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]';
      case 'Rotten':
        return 'text-[#B91C1C] bg-[#FEE2E2] border-[#FECACA]';
      case 'Sprouted':
        return 'text-[#166534] bg-[#BBF7D0] border-[#86EFAC]';
      case 'Undersized':
        return 'text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]';
      case 'Discolored':
        return 'text-[#854D0E] bg-[#FEF9C3] border-[#FEF08A]';
      default:
        return 'text-[#334155] bg-[#F1F5F9] border-[#CBD5E1]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>Automated CV Inspection Results</span>
            <span aria-hidden="true">·</span>
            <span>Batch {batch.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Batch Quality Analysis & Defect Distribution
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            {batch.procurementCenter} · Farmer: {batch.supplierName} ({batch.supplierFarmerId})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('review')}
            className="px-3.5 py-2 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#15803D]" />
            <span>Human Inspector Review</span>
          </button>
          <button
            onClick={() => onNavigate('grading')}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Proceed to Batch Grading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Batch Summary Cards (Grade A, URS, Defective) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Bulbs */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-medium text-[#64748B]">Total Onions Analyzed</div>
          <div className="text-3xl font-bold font-mono text-[#0F172A] tabular-nums mt-1">
            {metrics.uniqueOnionsCount}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Deduplicated from {metrics.totalDetectedFrames} frames
          </div>
        </div>

        {/* Grade A */}
        <div
          onClick={() => setActiveCategoryFilter('GradeA')}
          className={`cursor-pointer bg-white p-4 rounded-lg border transition-all ${
            activeCategoryFilter === 'GradeA'
              ? 'border-[#15803D] ring-2 ring-[#15803D]/20 shadow-md'
              : 'border-[#E2E8F0] hover:border-[#15803D]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#15803D]">Grade A (Prime)</span>
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#15803D] tabular-nums mt-1">
            {metrics.gradeAPercent}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            {metrics.defectCounts.healthy} bulbs meet export standard
          </div>
        </div>

        {/* URS */}
        <div
          onClick={() => setActiveCategoryFilter('URS')}
          className={`cursor-pointer bg-white p-4 rounded-lg border transition-all ${
            activeCategoryFilter === 'URS'
              ? 'border-[#D97706] ring-2 ring-[#D97706]/20 shadow-md'
              : 'border-[#E2E8F0] hover:border-[#D97706]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#D97706]">URS (Substandard)</span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#D97706] tabular-nums mt-1">
            {metrics.ursPercent}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Undersized / Stained discountable
          </div>
        </div>

        {/* Defective */}
        <div
          onClick={() => setActiveCategoryFilter('Defective')}
          className={`cursor-pointer bg-white p-4 rounded-lg border transition-all ${
            activeCategoryFilter === 'Defective'
              ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20 shadow-md'
              : 'border-[#E2E8F0] hover:border-[#DC2626]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#DC2626]">Defective Total</span>
            <Flame className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#DC2626] tabular-nums mt-1">
            {metrics.defectivePercent}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Rot, sprout & mechanical cuts
          </div>
        </div>
      </div>

      {/* Donut Chart & Detailed Defect Tally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Donut & Ratios (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h2 className="text-sm font-bold text-[#0F172A]">Batch Ratio Visualization</h2>
            <p className="text-xs text-[#64748B]">Click category segments or cards to filter bulb gallery</p>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                {/* Grade A */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="4"
                  strokeDasharray={`${Math.round(metrics.gradeAPercent)} 100`}
                  strokeDashoffset="0"
                />
                {/* URS */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="4"
                  strokeDasharray={`${Math.round(metrics.ursPercent)} 100`}
                  strokeDashoffset={`-${Math.round(metrics.gradeAPercent)}`}
                />
                {/* Defective */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeDasharray={`${Math.round(metrics.defectivePercent)} 100`}
                  strokeDashoffset={`-${Math.round(metrics.gradeAPercent + metrics.ursPercent)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold font-mono text-[#0F172A] tabular-nums">
                  {metrics.gradeAPercent}%
                </span>
                <span className="text-[10px] uppercase font-bold text-[#15803D] tracking-wider">
                  Grade A Prime
                </span>
              </div>
            </div>
          </div>

          {/* Caliper sizing stats */}
          <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F8FAFC] p-2.5 rounded-md">
              <span className="text-[#64748B] block text-[11px]">Mean Equatorial Diameter</span>
              <span className="font-mono font-bold text-sm text-[#0F172A]">{metrics.averageDiameterMm} mm</span>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-md">
              <span className="text-[#64748B] block text-[11px]">Preliminary Grade</span>
              <span className="font-semibold text-xs text-[#15803D]">{batch.finalGrade.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Right: Specific Defect Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Specific Defect Categorization</h2>
              <p className="text-xs text-[#64748B]">Click any row to isolate corresponding bulbs in the sample grid</p>
            </div>
            <button
              onClick={() => setActiveCategoryFilter('All')}
              className="text-xs text-[#15803D] hover:underline font-semibold"
            >
              Clear Filter
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Damaged */}
            <div
              onClick={() => setActiveCategoryFilter('Damaged')}
              className={`cursor-pointer p-3 rounded-md border flex items-center justify-between transition-colors ${
                activeCategoryFilter === 'Damaged' ? 'bg-[#FEF3C7] border-[#D97706]' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#0F172A]">Mechanical Damage & Cuts</span>
                  <span className="text-[#64748B] block text-[11px]">Bruises, tunic lacerations, transit punctures</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#0F172A] tabular-nums">
                  {metrics.defectCounts.damaged} bulbs
                </span>
                <span className="text-[#64748B] block text-[11px] font-mono">
                  {Math.round((metrics.defectCounts.damaged / metrics.uniqueOnionsCount) * 1000) / 10}%
                </span>
              </div>
            </div>

            {/* Rotten */}
            <div
              onClick={() => setActiveCategoryFilter('Rotten')}
              className={`cursor-pointer p-3 rounded-md border flex items-center justify-between transition-colors ${
                activeCategoryFilter === 'Rotten' ? 'bg-[#FEE2E2] border-[#DC2626]' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#0F172A]">Visible Surface Rot</span>
                  <span className="text-[#64748B] block text-[11px]">Aspergillus niger black mold & neck softening</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#DC2626] tabular-nums">
                  {metrics.defectCounts.rotten} bulbs
                </span>
                <span className="text-[#64748B] block text-[11px] font-mono">
                  {Math.round((metrics.defectCounts.rotten / metrics.uniqueOnionsCount) * 1000) / 10}%
                </span>
              </div>
            </div>

            {/* Sprouted */}
            <div
              onClick={() => setActiveCategoryFilter('Sprouted')}
              className={`cursor-pointer p-3 rounded-md border flex items-center justify-between transition-colors ${
                activeCategoryFilter === 'Sprouted' ? 'bg-[#DCFCE7] border-[#15803D]' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
                  <Sprout className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#0F172A]">Apical Sprouting</span>
                  <span className="text-[#64748B] block text-[11px]">Emergent green vegetative shoot breaking collar</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#15803D] tabular-nums">
                  {metrics.defectCounts.sprouted} bulbs
                </span>
                <span className="text-[#64748B] block text-[11px] font-mono">
                  {Math.round((metrics.defectCounts.sprouted / metrics.uniqueOnionsCount) * 1000) / 10}%
                </span>
              </div>
            </div>

            {/* Undersized */}
            <div
              onClick={() => setActiveCategoryFilter('Undersized')}
              className={`cursor-pointer p-3 rounded-md border flex items-center justify-between transition-colors ${
                activeCategoryFilter === 'Undersized' ? 'bg-[#E0F2FE] border-[#0284C7]' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
                  <Ruler className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#0F172A]">Undersized Caliber (&lt;40mm)</span>
                  <span className="text-[#64748B] block text-[11px]">Below minimum commercial table procurement diameter</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#0284C7] tabular-nums">
                  {metrics.defectCounts.undersized} bulbs
                </span>
                <span className="text-[#64748B] block text-[11px] font-mono">
                  {Math.round((metrics.defectCounts.undersized / metrics.uniqueOnionsCount) * 1000) / 10}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Onions Gallery Grid */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">
              Detected Bulb Registry ({filteredOnions.length} Bulbs Shown)
            </h2>
            <p className="text-xs text-[#64748B]">Click any bulb to open the Individual Human-in-the-Loop review drawer</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Healthy', 'Damaged', 'Rotten', 'Sprouted', 'Undersized'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setActiveCategoryFilter(filterKey)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeCategoryFilter === filterKey
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredOnions.map((onion) => {
            const effectiveClass =
              onion.inspectorDecision === 'Overridden' && onion.inspectorClass
                ? onion.inspectorClass
                : onion.predictedClass;
            const badgeClass = getDefectColor(effectiveClass);

            return (
              <div
                key={onion.id}
                onClick={() => {
                  onSelectOnionForReview(onion);
                  onNavigate('review');
                }}
                className="cursor-pointer bg-white hover:border-[#15803D] hover:shadow-md transition-all p-2.5 rounded-lg border border-[#E2E8F0] text-center space-y-1.5 group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#1E293B] flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                  🌰
                </div>
                <div className="font-mono text-xs font-bold text-[#0F172A]">{onion.id}</div>
                <div className={`text-[10px] font-semibold px-1 py-0.5 rounded-xs border truncate ${badgeClass}`}>
                  {effectiveClass}
                </div>
                <div className="text-[10px] text-[#64748B] font-mono tabular-nums">
                  {onion.estimatedDiameterMm} mm
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
