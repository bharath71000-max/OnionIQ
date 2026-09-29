import React, { useState } from 'react';
import { InspectionBatch } from '../types/onion';
import {
  Printer,
  Share2,
  Download,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Building,
  Calendar,
  User,
  Scale,
  Copy,
  Check,
  Award,
} from 'lucide-react';

interface QualityReportViewProps {
  batch: InspectionBatch;
  onNavigate: (view: string) => void;
}

export const QualityReportView: React.FC<QualityReportViewProps> = ({
  batch,
  onNavigate,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { metrics } = batch;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    const summary = `OnionIQ Quality Assessment Certificate\nReport ID: ${batch.reportId}\nBatch: ${batch.id}\nGrade: ${batch.finalGrade}\nGrade A: ${metrics.gradeAPercent}%\nDefects: ${metrics.defectivePercent}%\nCenter: ${batch.procurementCenter}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = 'Bulb_ID,Track_ID,Class,Confidence,Diameter_MM,Size_Category,Inspector_Decision\n';
    const rows = batch.onions
      .map((o) => {
        const effClass =
          o.inspectorDecision === 'Overridden' && o.inspectorClass
            ? o.inspectorClass
            : o.predictedClass;
        return `${o.id},${o.trackId},${effClass},${o.confidence},${o.estimatedDiameterMm},"${o.sizeCategory}",${o.inspectorDecision}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${batch.reportId}_onion_inspection.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rotPercent =
    Math.round((metrics.defectCounts.rotten / metrics.uniqueOnionsCount) * 1000) / 10;
  const sproutPercent =
    Math.round((metrics.defectCounts.sprouted / metrics.uniqueOnionsCount) * 1000) / 10;
  const damagePercent =
    Math.round((metrics.defectCounts.damaged / metrics.uniqueOnionsCount) * 1000) / 10;
  const undersizedPercent =
    Math.round((metrics.defectCounts.undersized / metrics.uniqueOnionsCount) * 1000) / 10;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-semibold text-[#475569] hover:text-[#0F172A] flex items-center gap-1.5 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Console Dashboard</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyShareLink}
            className="px-3 py-1.5 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary' : 'Share Certificate'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-1.5 rounded-md text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="bg-white p-8 sm:p-12 rounded-lg border border-[#CBD5E1] shadow-md space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Certificate Header */}
        <div className="border-b-2 border-[#15803D] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌰</span>
              <span className="text-2xl font-black tracking-tight text-[#0F172A]">
                ONIONIQ
              </span>
              <span className="text-xs font-bold bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-xs ml-2">
                GOVERNMENT PROCUREMENT GRADE
              </span>
            </div>
            <div className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
              AI-Powered Non-Destructive Onion Quality Assessment
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">
              Directorate of Agricultural Marketing & Price Support Procurement Division
            </div>
          </div>

          <div className="text-right sm:text-right font-mono text-xs">
            <div className="font-bold text-[#0F172A] text-sm">
              REPORT: <span className="text-[#15803D]">{batch.reportId}</span>
            </div>
            <div className="text-[#64748B]">LOT: {batch.id}</div>
            <div className="text-[10px] text-[#94A3B8] mt-1">
              Issued: {batch.timestamp}
            </div>
          </div>
        </div>

        {/* Certificate Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs">
          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-bold block">Procurement Mandi</span>
            <span className="font-semibold text-[#0F172A] block mt-0.5">{batch.procurementCenter}</span>
            <span className="text-[10px] text-[#64748B]">{batch.location}</span>
          </div>

          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-bold block">Farmer / Lot Ingest</span>
            <span className="font-semibold text-[#0F172A] block mt-0.5">{batch.supplierName}</span>
            <span className="text-[10px] font-mono text-[#64748B]">{batch.supplierFarmerId}</span>
          </div>

          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-bold block">Cultivar & Sample</span>
            <span className="font-semibold text-[#0F172A] block mt-0.5">{batch.onionVariety}</span>
            <span className="text-[10px] text-[#64748B] font-mono">{batch.sampleSizeKg} kg sample net</span>
          </div>

          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-bold block">Assigned Inspector</span>
            <span className="font-semibold text-[#0F172A] block mt-0.5">{batch.inspectorName}</span>
            <span className="text-[10px] text-[#15803D] font-medium">{batch.verificationStatus}</span>
          </div>
        </div>

        {/* Final Grade Badge Announcement */}
        <div className="p-6 rounded-lg bg-linear-to-r from-[#F0FDF4] to-[#FEFCE8] border-2 border-[#15803D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#15803D] flex items-center justify-center text-white shadow-md shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#15803D] uppercase tracking-wider">
                Official Certified Classification
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {batch.finalGrade}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                Evaluation standard: {batch.gradingRulesApplied?.standardReference || 'Agmark / NAFED Norms'}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="text-xs font-semibold text-[#64748B]">Analyzed Sample Count</div>
            <div className="text-2xl font-bold font-mono text-[#0F172A] tabular-nums">
              {metrics.uniqueOnionsCount} <span className="text-xs font-normal text-[#64748B]">bulbs</span>
            </div>
            <div className="text-[10px] text-[#15803D] font-medium">100% Anti-duplicate tracked</div>
          </div>
        </div>

        {/* Primary Quality Telemetry Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
            Quality Telemetry & Defect Percentages
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F0FDF4] rounded-md border border-[#BBF7D0]">
              <span className="text-[11px] font-semibold text-[#166534] block">Grade A (Prime)</span>
              <span className="text-2xl font-bold font-mono text-[#15803D] tabular-nums mt-0.5 block">
                {metrics.gradeAPercent}%
              </span>
              <span className="text-[10px] text-[#166534]">{metrics.defectCounts.healthy} healthy bulbs</span>
            </div>

            <div className="p-3 bg-[#FEF3C7] rounded-md border border-[#FDE68A]">
              <span className="text-[11px] font-semibold text-[#B45309] block">URS (Substandard)</span>
              <span className="text-2xl font-bold font-mono text-[#D97706] tabular-nums mt-0.5 block">
                {metrics.ursPercent}%
              </span>
              <span className="text-[10px] text-[#B45309]">Discountable / Table B</span>
            </div>

            <div className="p-3 bg-[#FEE2E2] rounded-md border border-[#FECACA]">
              <span className="text-[11px] font-semibold text-[#B91C1C] block">Defective Total</span>
              <span className="text-2xl font-bold font-mono text-[#DC2626] tabular-nums mt-0.5 block">
                {metrics.defectivePercent}%
              </span>
              <span className="text-[10px] text-[#B91C1C]">Rot, cut & sprout</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
              <span className="text-[11px] font-semibold text-[#334155] block">Mean Caliper</span>
              <span className="text-2xl font-bold font-mono text-[#0F172A] tabular-nums mt-0.5 block">
                {metrics.averageDiameterMm} mm
              </span>
              <span className="text-[10px] text-[#64748B]">Equatorial diameter</span>
            </div>
          </div>

          {/* Specific Defect Breakdown Table */}
          <div className="pt-2">
            <table className="w-full text-xs text-left border border-[#E2E8F0] rounded-md overflow-hidden">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2 px-3">Defect Category</th>
                  <th className="py-2 px-3">Diagnostic Manifestation</th>
                  <th className="py-2 px-3 text-right">Bulb Count</th>
                  <th className="py-2 px-3 text-right">Batch Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
                <tr>
                  <td className="py-2 px-3 font-semibold text-[#D97706]">Mechanical Cuts & Damage</td>
                  <td className="py-2 px-3 text-[#64748B]">Tunic split, lateral impact bruising, peel abrasion</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums">{metrics.defectCounts.damaged}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">{damagePercent}%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-[#DC2626]">Visible Surface Rot</td>
                  <td className="py-2 px-3 text-[#64748B]">Aspergillus niger black mold & soft neck depression</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums">{metrics.defectCounts.rotten}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-[#DC2626]">{rotPercent}%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-[#15803D]">Apical Sprouting</td>
                  <td className="py-2 px-3 text-[#64748B]">Emergent green vegetative shoot breaking tunic collar</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums">{metrics.defectCounts.sprouted}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">{sproutPercent}%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-[#0284C7]">Undersized Caliber (&lt;40mm)</td>
                  <td className="py-2 px-3 text-[#64748B]">Substandard bulb diameter for commercial Grade A table</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums">{metrics.defectCounts.undersized}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">{undersizedPercent}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Inspection Sample Frame Snapshot */}
        <div className="space-y-2 break-inside-avoid">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Sample Visual Ingest & Detection Snapshot
          </h3>
          <div className="relative aspect-16/9 bg-[#0F172A] rounded-lg overflow-hidden border border-[#CBD5E1]">
            <img
              src="/src/assets/images/onion_inspection_tray_1790704349459.jpg"
              alt="Optical sample detection frame"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-mono px-2 py-1 rounded-xs">
              Optical Ingest Sample: {metrics.uniqueOnionsCount} bulbs segmented | Non-destructive RGB
            </div>
            <div className="absolute top-2 right-2 bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
              AI-ASSISTED AUDIT CERTIFIED
            </div>
          </div>
        </div>

        {/* Remarks & Signatures Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E2E8F0] break-inside-avoid">
          {/* Inspector Signature Box */}
          <div className="space-y-2 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
              1. Quality Inspector Assessment Remarks
            </span>
            <p className="text-xs text-[#334155] italic leading-relaxed">
              "{batch.inspectorRemarks}"
            </p>
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#0F172A] block">{batch.inspectorName}</span>
                <span className="text-[10px] text-[#64748B]">{batch.inspectorRole}</span>
              </div>
              <div className="text-right">
                <span className="text-[#15803D] font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                </span>
                <span className="text-[9px] text-[#94A3B8] font-mono">DIGITAL SIG #8419</span>
              </div>
            </div>
          </div>

          {/* Officer Countersign Box */}
          <div className="space-y-2 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
              2. Procurement Officer Authorization
            </span>
            <p className="text-xs text-[#334155] italic leading-relaxed">
              "{batch.officerRemarks || 'Approved for procurement under Price Support Scheme buffer allocation.'}"
            </p>
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#0F172A] block">
                  {batch.approvedBy || 'Pravin Jadhav (Procurement Officer)'}
                </span>
                <span className="text-[10px] text-[#64748B]">Procurement Directorate</span>
              </div>
              <div className="text-right">
                <span className="text-[#15803D] font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> COUNTERSIGNED
                </span>
                <span className="text-[9px] text-[#94A3B8] font-mono">SEAL #NAFED-9421</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer & AI Notice */}
        <div className="p-4 rounded-md bg-[#FEFCE8] border border-[#FEF08A] text-xs text-[#854D0E] space-y-1 break-inside-avoid">
          <div className="flex items-center gap-1.5 font-bold text-[#713F12]">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#CA8A04]" />
            <span>Statutory Quality Assessment Notice & Operating Boundaries:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Assessment is based on visible characteristics captured by the imaging system. Internal defects that are not externally visible may require additional inspection. OnionIQ operates as an AI-assisted decision support tool to standardize visible batch evaluation across mandis and prevent subjective grading disputes.
          </p>
          <div className="text-[10px] text-[#A16207] pt-1 border-t border-[#FEF08A] flex justify-between font-mono">
            <span>Model: OnionNet-YOLOv8x + ByteTrack (Prototype Target)</span>
            <span>Ref: SIH-26031 / APMC-GRADING-STD-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
