export type UserRole = 'officer' | 'inspector' | 'admin';

export type OnionClass = 'Healthy' | 'Damaged' | 'Rotten' | 'Sprouted' | 'Undersized' | 'Discolored';

export type SizeCategory = 'Extra Large (>70mm)' | 'Medium (50-70mm)' | 'Small (40-50mm)' | 'Undersized (<40mm)';

export type FinalGrade = 'Grade A (Prime / Export)' | 'Grade B (Domestic Table)' | 'URS (Substandard)' | 'Lot Rejected';

export type VerificationStatus = 'AI Assessment Only' | 'Verified by Inspector' | 'Countersigned by Officer';

export type InspectionStatus = 'Draft' | 'Analyzing' | 'Pending Review' | 'Verified' | 'Approved' | 'Rejected';

export interface DetectedOnion {
  id: string; // e.g. '#024'
  trackId: number;
  box: {
    x: number; // percentage 0-100
    y: number;
    width: number;
    height: number;
  };
  predictedClass: OnionClass;
  confidence: number; // 0 to 1
  estimatedDiameterMm: number;
  sizeCategory: SizeCategory;
  visibleIndicators: string;
  inspectorDecision: 'Pending' | 'Confirmed' | 'Overridden' | 'Uncertain';
  inspectorClass?: OnionClass;
  inspectorRemarks?: string;
  cropColor: string; // Hex for fallback preview
}

export interface DefectCounts {
  healthy: number;
  damaged: number;
  rotten: number;
  sprouted: number;
  undersized: number;
  discolored: number;
}

export interface BatchMetrics {
  totalDetectedFrames: number;
  uniqueOnionsCount: number;
  gradeAPercent: number;
  ursPercent: number;
  defectivePercent: number;
  defectCounts: DefectCounts;
  averageDiameterMm: number;
}

export interface GradingThresholds {
  gradeAMaxDefectPercent: number;
  gradeAMinDiameterMm: number;
  gradeAMaxRotPercent: number;
  gradeAMaxSproutPercent: number;
  ursMaxDefectPercent: number;
  rejectThresholdDefectPercent: number;
  standardReference: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface InspectionBatch {
  id: string; // e.g. 'BATCH-2026-0928-MH'
  reportId: string; // e.g. 'RPT-ONION-9421'
  procurementCenter: string;
  inspectorName: string;
  inspectorRole: string;
  supplierFarmerId: string;
  supplierName: string;
  timestamp: string;
  onionVariety: string;
  sampleSizeKg: number;
  location: string;
  notes: string;
  status: InspectionStatus;
  verificationStatus: VerificationStatus;
  metrics: BatchMetrics;
  onions: DetectedOnion[];
  finalGrade: FinalGrade;
  gradingRulesApplied: GradingThresholds;
  inspectorRemarks: string;
  officerRemarks?: string;
  approvedBy?: string;
  approvedAt?: string;
  captureSource: 'live_camera' | 'uploaded_video' | 'uploaded_image' | 'demo_simulation';
  previewImageUrl?: string;
}

export interface ProcurementCenterStat {
  centerName: string;
  location: string;
  totalInspections: number;
  totalOnions: number;
  avgGradeAPercent: number;
  avgDefectPercent: number;
  avgRotPercent: number;
  avgSproutPercent: number;
  activeInspectors: number;
}

export interface AIModelMeta {
  version: string;
  targetArchitecture: string;
  trainingDatasetSize: string;
  detectionClasses: string[];
  prototypePrecisionTarget: string;
  prototypeRecallTarget: string;
  prototypemAP50Target: string;
  validationStatus: string;
  hardwareRuntime: string;
  connectedApiEndpoint: string;
  lastEvaluated: string;
}
