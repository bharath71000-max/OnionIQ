import React, { useState } from 'react';
import { InspectionBatch } from '../types/onion';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Download,
  SlidersHorizontal,
} from 'lucide-react';

interface InspectionHistoryViewProps {
  batches: InspectionBatch[];
  onSelectBatch: (batch: InspectionBatch) => void;
  onNavigate: (view: string) => void;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = ({
  batches,
  onSelectBatch,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCenter =
      selectedCenter === 'All' || b.procurementCenter.includes(selectedCenter);

    const matchesGrade =
      selectedGrade === 'All' || b.finalGrade.includes(selectedGrade);

    return matchesSearch && matchesCenter && matchesGrade;
  });

  const centers = Array.from(
    new Set(batches.map((b) => b.procurementCenter.split(',')[0].trim()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>Audit Trail & Records</span>
            <span aria-hidden="true">·</span>
            <span>Historical Register</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Inspection History & Certificate Archive
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Query past batch assessments, verify inspector decisions, and export compliance reports.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-inspection')}
          className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          + New Inspection
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Batch ID, Report ID, Farmer Name, or Inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#15803D]"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Building2 className="w-3.5 h-3.5" />
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
            >
              <option value="All">All Mandi Centers</option>
              {centers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
            >
              <option value="All">All Grades</option>
              <option value="Grade A">Grade A (Prime)</option>
              <option value="Grade B">Grade B (Domestic Table)</option>
              <option value="URS">URS (Substandard)</option>
              <option value="Rejected">Lot Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-4">Report & Batch ID</th>
                <th className="py-3.5 px-4">Procurement Center</th>
                <th className="py-3.5 px-4">Farmer / Ingest Lot</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4 text-right">Sample (Unique)</th>
                <th className="py-3.5 px-4 text-right">Grade A %</th>
                <th className="py-3.5 px-4 text-right">Defect %</th>
                <th className="py-3.5 px-4">Final Grade</th>
                <th className="py-3.5 px-4">Inspector & Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
              {filteredBatches.map((b) => {
                const gradeBadge =
                  b.finalGrade.includes('Grade A')
                    ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                    : b.finalGrade.includes('Grade B')
                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                    : 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]';

                return (
                  <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-[#0F172A]">{b.id}</div>
                      <div className="text-[10px] text-[#64748B]">{b.reportId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#0F172A]">{b.procurementCenter.split(',')[0]}</div>
                      <div className="text-[10px] text-[#64748B]">{b.onionVariety}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#0F172A]">{b.supplierName}</div>
                      <div className="text-[10px] font-mono text-[#64748B]">{b.supplierFarmerId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] font-mono tabular-nums whitespace-nowrap">
                      {b.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-[#0F172A]">
                      {b.metrics.uniqueOnionsCount} bulbs
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-[#15803D]">
                      {b.metrics.gradeAPercent}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-[#DC2626]">
                      {b.metrics.defectivePercent}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold border ${gradeBadge}`}>
                        {b.finalGrade.split(' ')[0]} {b.finalGrade.split(' ')[1] || ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#0F172A]">{b.inspectorName.split(' ')[0]}</div>
                      <div className="text-[10px] text-[#15803D] flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {b.verificationStatus.split(' ')[0]}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectBatch(b);
                            onNavigate('review');
                          }}
                          title="Review individual detected bulbs"
                          className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-sm font-medium text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Audit</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBatch(b);
                            onNavigate('report');
                          }}
                          title="View Official Certificate"
                          className="px-2 py-1 bg-[#15803D]/10 hover:bg-[#15803D]/20 text-[#15803D] rounded-sm font-medium text-xs flex items-center gap-1"
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

        {filteredBatches.length === 0 && (
          <div className="p-8 text-center text-xs text-[#94A3B8]">
            No inspection batches found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
