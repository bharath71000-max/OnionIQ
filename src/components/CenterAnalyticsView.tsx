import React from 'react';
import { MOCK_CENTERS_STATS } from '../services/onionDataService';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Flame,
  Sprout,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CenterAnalyticsViewProps {
  onNavigate: (view: string) => void;
}

export const CenterAnalyticsView: React.FC<CenterAnalyticsViewProps> = ({
  onNavigate,
}) => {
  const totalCenterInspections = MOCK_CENTERS_STATS.reduce((acc, c) => acc + c.totalInspections, 0);
  const totalCenterOnions = MOCK_CENTERS_STATS.reduce((acc, c) => acc + c.totalOnions, 0);
  const avgSystemGradeA =
    Math.round(
      (MOCK_CENTERS_STATS.reduce((acc, c) => acc + c.avgGradeAPercent, 0) /
        MOCK_CENTERS_STATS.length) *
        10
    ) / 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>Mandi Central Control Room</span>
            <span aria-hidden="true">·</span>
            <span>Regional Comparative Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Procurement Mandi Performance Benchmarks
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor lot quality variations across major onion trading belts in Maharashtra, Madhya Pradesh, and Karnataka.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-3.5 py-2 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold self-start sm:self-auto"
        >
          Return to Dashboard
        </button>
      </div>

      {/* High-level system cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] block font-medium">Federation Mandi Volume</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A] tabular-nums mt-1">
            {totalCenterInspections} Lots · {(totalCenterOnions / 1000).toFixed(1)}k Bulbs
          </div>
          <div className="text-[11px] text-[#15803D] mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 6 Operational Mandi Hubs
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] block font-medium">System Mean Grade A Standard</span>
          <div className="text-2xl font-bold font-mono text-[#15803D] tabular-nums mt-1">
            {avgSystemGradeA}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Target benchmark: &ge; 70% for national buffer procurement
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] block font-medium">Active Mandi Field Inspectors</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A] tabular-nums mt-1">
            30 Certified Inspectors
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Standardized optical grading protocol active
          </div>
        </div>
      </div>

      {/* Centers Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_CENTERS_STATS.map((center) => (
          <div
            key={center.centerName}
            className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-5 space-y-4 hover:border-[#15803D]/60 transition-colors"
          >
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">{center.centerName}</h3>
                <span className="text-xs text-[#64748B]">{center.location}</span>
              </div>
              <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-xs">
                ONLINE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F8FAFC] p-2.5 rounded-md">
                <span className="text-[#64748B] text-[11px] block">Grade A Prime Rate</span>
                <span className="text-lg font-bold font-mono text-[#15803D] tabular-nums">
                  {center.avgGradeAPercent}%
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-md">
                <span className="text-[#64748B] text-[11px] block">Overall Defect Rate</span>
                <span className="text-lg font-bold font-mono text-[#D97706] tabular-nums">
                  {center.avgDefectPercent}%
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-md">
                <span className="text-[#64748B] text-[11px] block">Rot Prevalence</span>
                <span className="text-sm font-semibold font-mono text-[#DC2626] tabular-nums">
                  {center.avgRotPercent}%
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-md">
                <span className="text-[#64748B] text-[11px] block">Sprout Prevalence</span>
                <span className="text-sm font-semibold font-mono text-[#15803D] tabular-nums">
                  {center.avgSproutPercent}%
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
              <span>Field Staff: {center.activeInspectors} Inspectors</span>
              <span className="font-mono">{center.totalInspections} Batches Scanned</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
