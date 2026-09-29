import React from 'react';
import { InspectionBatch, UserRole } from '../types/onion';
import { OnionDataService, MOCK_CENTERS_STATS } from '../services/onionDataService';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sprout,
  Ruler,
  TrendingUp,
  Building,
  ArrowRight,
  ShieldAlert,
  FileText,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface DashboardViewProps {
  batches: InspectionBatch[];
  currentRole: UserRole;
  onSelectBatch: (batch: InspectionBatch) => void;
  onNavigate: (view: string) => void;
  onStartNewInspection: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  batches,
  currentRole,
  onSelectBatch,
  onNavigate,
  onStartNewInspection,
}) => {
  const metrics = OnionDataService.getDashboardMetrics();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>National Agricultural Cooperative Marketing Federation</span>
            <span aria-hidden="true">·</span>
            <span>APMC Mandi Quality Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Onion Quality Assessment & Procurement Console
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-3xl">
            AI-assisted non-destructive visible surface inspection across procurement mandis. Standardizing grading, reducing farmer disputes, and eliminating subjective manual errors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartNewInspection}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2.5 rounded-md font-semibold text-sm shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>+ Start New Inspection</span>
          </button>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-md p-3.5 flex items-start gap-3 text-xs text-[#854D0E]">
        <ShieldAlert className="w-5 h-5 shrink-0 text-[#CA8A04] mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-[#713F12]">Important Operational Limitation: </strong>
          OnionIQ performs non-destructive optical surface assessment using high-resolution video and imaging. Visible defects (external fungal black mold, mechanical cuts, apical sprouting, and equatorial size) are classified automatically. Internal defects that exhibit zero external epidermal signs require destructive cut testing.
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Inspections */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Total Inspections</span>
            <Layers className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] mt-2 font-mono tabular-nums">
            {metrics.totalInspections}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Across 6 regional mandis
          </div>
        </div>

        {/* Onions Analyzed */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Onions Evaluated</span>
            <span className="text-sm">🌰</span>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] mt-2 font-mono tabular-nums">
            {metrics.totalOnions.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Anti-duplicate tracked
          </div>
        </div>

        {/* Grade A % */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Grade A (Prime)</span>
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-2xl font-bold text-[#15803D] mt-2 font-mono tabular-nums">
            {metrics.gradeAPercent}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Buffer & export standard
          </div>
        </div>

        {/* URS % */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">URS (Substandard)</span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-bold text-[#D97706] mt-2 font-mono tabular-nums">
            {metrics.ursPercent}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Under-sized / Discounted
          </div>
        </div>

        {/* Defective % */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Defective Rate</span>
            <Flame className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#DC2626] mt-2 font-mono tabular-nums">
            {metrics.defectivePercent}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Rot, sprout & transit cut
          </div>
        </div>
      </div>

      {/* Secondary Defect Counts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-[#64748B]">Rotten Bulbs Detected</div>
            <div className="text-base font-bold text-[#0F172A] font-mono tabular-nums">
              {metrics.rottenOnionsCount} <span className="text-xs font-normal text-[#64748B]">units</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-[#64748B]">Sprouted Bulbs</div>
            <div className="text-base font-bold text-[#0F172A] font-mono tabular-nums">
              {metrics.sproutedOnionsCount} <span className="text-xs font-normal text-[#64748B]">units</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-[#64748B]">Mechanical Damage</div>
            <div className="text-base font-bold text-[#0F172A] font-mono tabular-nums">
              {metrics.damagedOnionsCount} <span className="text-xs font-normal text-[#64748B]">units</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-[#64748B]">Undersized (&lt;40mm)</div>
            <div className="text-base font-bold text-[#0F172A] font-mono tabular-nums">
              {metrics.undersizedOnionsCount} <span className="text-xs font-normal text-[#64748B]">units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution & Defect Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Batch Quality Distribution</h2>
              <p className="text-xs text-[#64748B]">Aggregated ratio based on official Agmark criteria</p>
            </div>
            <span className="text-xs text-[#15803D] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded-xs">
              Live Feed
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                {/* Grade A Segment (73.8%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="4"
                  strokeDasharray="65 100"
                  strokeDashoffset="0"
                />
                {/* URS Segment (16.3%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="4"
                  strokeDasharray="16 100"
                  strokeDashoffset="-65"
                />
                {/* Defective Segment (9.9%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeDasharray="10 100"
                  strokeDashoffset="-81"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-[#0F172A] font-mono tabular-nums">73.8%</span>
                <span className="text-[10px] uppercase font-semibold text-[#15803D] tracking-wider">Grade A Avg</span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div className="space-y-3 w-full max-w-xs text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-xs bg-[#15803D]" />
                  <span className="font-medium text-[#334155]">Grade A (Prime / Export)</span>
                </div>
                <span className="font-mono font-semibold tabular-nums text-[#0F172A]">73.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-xs bg-[#D97706]" />
                  <span className="font-medium text-[#334155]">URS (Under-sized / Substandard)</span>
                </div>
                <span className="font-mono font-semibold tabular-nums text-[#0F172A]">16.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-xs bg-[#DC2626]" />
                  <span className="font-medium text-[#334155]">Defective (Rot / Sprout / Cut)</span>
                </div>
                <span className="font-mono font-semibold tabular-nums text-[#0F172A]">9.9%</span>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
                Grading engine threshold target: &lt;6% defectives for Grade A certified buffer stock.
              </div>
            </div>
          </div>
        </div>

        {/* Visible Defect Breakdown Bar Chart */}
        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Visible Defect Breakdown</h2>
              <p className="text-xs text-[#64748B]">Proportion of detected surface defects across all batches</p>
            </div>
            <button
              onClick={() => onNavigate('settings')}
              className="text-xs font-semibold text-[#15803D] hover:underline flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Thresholds</span>
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Damaged */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-[#334155]">Mechanical Damage & Transit Cuts</span>
                <span className="font-mono font-semibold tabular-nums text-[#0F172A]">4.8% ({metrics.damagedOnionsCount} bulbs)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#D97706] h-2.5 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            {/* Rotten */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-[#334155]">Visible Surface Rot (Black Mold / Neck Rot)</span>
                <span className="font-mono font-semibold tabular-nums text-[#DC2626]">2.6% ({metrics.rottenOnionsCount} bulbs)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#DC2626] h-2.5 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            {/* Sprouted */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-[#334155]">Apical Sprouting (&gt;10mm green shoot)</span>
                <span className="font-mono font-semibold tabular-nums text-[#15803D]">1.7% ({metrics.sproutedOnionsCount} bulbs)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#15803D] h-2.5 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            {/* Undersized */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-[#334155]">Undersized Caliber (&lt;40mm diameter)</span>
                <span className="font-mono font-semibold tabular-nums text-[#0284C7]">7.2% ({metrics.undersizedOnionsCount} bulbs)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#0284C7] h-2.5 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            Note: Computer vision classifies surface fungal sporulation, peel peeling, and green shoot emergence.
          </div>
        </div>
      </div>

      {/* Procurement Center Quick Comparison */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Procurement Mandi Comparison</h2>
            <p className="text-xs text-[#64748B]">Batch acceptance and quality variance by mandi yard</p>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-semibold text-[#15803D] hover:underline flex items-center gap-1"
          >
            <span>Full Mandi Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-3">Procurement Center</th>
                <th className="py-2.5 px-3">State / District</th>
                <th className="py-2.5 px-3 text-right">Inspections</th>
                <th className="py-2.5 px-3 text-right">Grade A Rate</th>
                <th className="py-2.5 px-3 text-right">Defect Rate</th>
                <th className="py-2.5 px-3 text-right">Rot Rate</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
              {MOCK_CENTERS_STATS.slice(0, 4).map((center, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{center.centerName}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{center.location}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{center.totalInspections}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#15803D] tabular-nums">
                    {center.avgGradeAPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#D97706] tabular-nums">
                    {center.avgDefectPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#DC2626] tabular-nums">
                    {center.avgRotPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Recent Onion Batch Inspections</h2>
            <p className="text-xs text-[#64748B]">Latest AI inspections and inspector-verified batches</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-[#15803D] hover:underline flex items-center gap-1"
          >
            <span>View All Batches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Center & Farmer</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Analyzed (Unique)</th>
                <th className="py-3 px-3 text-right">Grade A</th>
                <th className="py-3 px-3 text-right">Defects</th>
                <th className="py-3 px-3">Assigned Grade</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
              {batches.map((batch) => {
                const gradeBadge =
                  batch.finalGrade.includes('Grade A')
                    ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                    : batch.finalGrade.includes('Grade B')
                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                    : 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]';

                return (
                  <tr key={batch.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-semibold font-mono text-[#0F172A]">
                      {batch.id}
                      <div className="text-[10px] text-[#64748B] font-sans">{batch.reportId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#0F172A]">{batch.procurementCenter.split(',')[0]}</div>
                      <div className="text-[11px] text-[#64748B]">{batch.supplierName}</div>
                    </td>
                    <td className="py-3 px-3 text-[#64748B] font-mono tabular-nums">{batch.timestamp}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-[#0F172A]">
                      {batch.metrics.uniqueOnionsCount} bulbs
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-[#15803D]">
                      {batch.metrics.gradeAPercent}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#DC2626]">
                      {batch.metrics.defectivePercent}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold border ${gradeBadge}`}>
                        {batch.finalGrade.split(' ')[0]} {batch.finalGrade.split(' ')[1] || ''}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-[#475569] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                        {batch.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectBatch(batch);
                            onNavigate('review');
                          }}
                          title="Review individual detected onions"
                          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-sm font-medium text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Review</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectBatch(batch);
                            onNavigate('report');
                          }}
                          title="View Official Digital Quality Certificate"
                          className="px-2.5 py-1 bg-[#15803D]/10 hover:bg-[#15803D]/20 text-[#15803D] rounded-sm font-medium text-xs flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Report</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
