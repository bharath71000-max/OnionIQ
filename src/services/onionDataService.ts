import {
  InspectionBatch,
  DetectedOnion,
  GradingThresholds,
  ProcurementCenterStat,
  AIModelMeta,
  OnionClass,
  BatchMetrics,
  DefectCounts,
} from '../types/onion';

export const DEFAULT_GRADING_THRESHOLDS: GradingThresholds = {
  gradeAMaxDefectPercent: 6.0,
  gradeAMinDiameterMm: 45.0,
  gradeAMaxRotPercent: 1.5,
  gradeAMaxSproutPercent: 1.0,
  ursMaxDefectPercent: 20.0,
  rejectThresholdDefectPercent: 25.0,
  standardReference: 'Agmark / NAFED Onion Procurement Norms 2026-Rev3',
  lastUpdatedBy: 'Admin Quality Council (HQ)',
  lastUpdatedAt: '2026-09-15 14:30 IST',
};

export const AI_MODEL_METADATA: AIModelMeta = {
  version: 'OnionNet-YOLOv8x-v0.5.2-alpha',
  targetArchitecture: 'YOLOv8 Dual-Head (Detection + Morphometric Segmenter) + ByteTrack',
  trainingDatasetSize: '14,850 Annotated RGB Onion Images across 6 Indian Mandis',
  detectionClasses: ['Healthy', 'Damaged', 'Rotten', 'Sprouted', 'Undersized', 'Discolored'],
  prototypePrecisionTarget: '88.4% (Prototype Target - Pending Field Validation)',
  prototypeRecallTarget: '86.1% (Prototype Target - Pending Field Validation)',
  prototypemAP50Target: '89.2% (Target - Non-Destructive Visible Surface Only)',
  validationStatus: 'Prototype Model — Awaiting ICAR / NAFED Field Validation',
  hardwareRuntime: 'Client-side WebGL / Edge TensorRT Acceleration',
  connectedApiEndpoint: 'https://api.onioniq.gov.in/v1/inference (Mocked Fallback Ready)',
  lastEvaluated: '2026-09-20',
};

export const PROCUREMENT_CENTERS = [
  'Lasalgaon APMC Mandi, Nashik',
  'Pimpalgaon Baswant APMC, Nashik',
  'Pune Gultekdi Market Yard, Pune',
  'Solapur APMC Mandi, Solapur',
  'Indore Choithram Mandi, MP',
  'Hubballi APMC Yard, Karnataka',
];

export const ONION_VARIETIES = [
  'Nashik Red (Garwa / Late Kharif)',
  'Agrifound Dark Red (ADR)',
  'Bhima Super (ICAR-DOGR)',
  'Pusa Red / Madhavi',
  'White Onion (Telagi / Dehydrated Variety)',
  'Yellow Onion (Export Grade)',
];

export const MOCK_CENTERS_STATS: ProcurementCenterStat[] = [
  {
    centerName: 'Lasalgaon APMC Mandi, Nashik',
    location: 'Nashik District, Maharashtra',
    totalInspections: 142,
    totalOnions: 74200,
    avgGradeAPercent: 73.8,
    avgDefectPercent: 9.4,
    avgRotPercent: 2.1,
    avgSproutPercent: 1.4,
    activeInspectors: 8,
  },
  {
    centerName: 'Pimpalgaon Baswant APMC, Nashik',
    location: 'Nashik District, Maharashtra',
    totalInspections: 98,
    totalOnions: 51200,
    avgGradeAPercent: 71.2,
    avgDefectPercent: 10.8,
    avgRotPercent: 2.9,
    avgSproutPercent: 1.8,
    activeInspectors: 5,
  },
  {
    centerName: 'Pune Gultekdi Market Yard, Pune',
    location: 'Pune District, Maharashtra',
    totalInspections: 84,
    totalOnions: 43500,
    avgGradeAPercent: 69.5,
    avgDefectPercent: 12.1,
    avgRotPercent: 3.4,
    avgSproutPercent: 2.2,
    activeInspectors: 6,
  },
  {
    centerName: 'Solapur APMC Mandi, Solapur',
    location: 'Solapur District, Maharashtra',
    totalInspections: 72,
    totalOnions: 38900,
    avgGradeAPercent: 66.4,
    avgDefectPercent: 14.5,
    avgRotPercent: 4.1,
    avgSproutPercent: 2.8,
    activeInspectors: 4,
  },
  {
    centerName: 'Indore Choithram Mandi, MP',
    location: 'Indore, Madhya Pradesh',
    totalInspections: 64,
    totalOnions: 33400,
    avgGradeAPercent: 75.1,
    avgDefectPercent: 8.9,
    avgRotPercent: 1.9,
    avgSproutPercent: 1.2,
    activeInspectors: 4,
  },
  {
    centerName: 'Hubballi APMC Yard, Karnataka',
    location: 'Dharwad District, Karnataka',
    totalInspections: 51,
    totalOnions: 26800,
    avgGradeAPercent: 68.2,
    avgDefectPercent: 11.9,
    avgRotPercent: 3.2,
    avgSproutPercent: 1.9,
    activeInspectors: 3,
  },
];

// Helper to generate sample detected onions for a batch
export function generateSampleDetectedOnions(count: number = 32): DetectedOnion[] {
  const onions: DetectedOnion[] = [];
  const classesDistribution: { cls: OnionClass; weight: number }[] = [
    { cls: 'Healthy', weight: 0.72 },
    { cls: 'Damaged', weight: 0.10 },
    { cls: 'Rotten', weight: 0.06 },
    { cls: 'Sprouted', weight: 0.04 },
    { cls: 'Undersized', weight: 0.05 },
    { cls: 'Discolored', weight: 0.03 },
  ];

  const indicatorMap: Record<OnionClass, string[]> = {
    Healthy: [
      'Firm spherical tunic, uniform dark red pigmentation, dry adherent papery skin',
      'Solid intact neck, no soft depression, bright copper exterior peel',
      'Regular globular shape, fully closed root base, clean surface',
      'Dense outer dry scales, no mechanical skin puncture observed',
    ],
    Damaged: [
      'Mechanical cut along equatorial axis with exposed fleshy scale',
      'Impact bruise on lateral shoulder, skin ruptured during transit',
      'Deep fingernail laceration and partial tunic peeling',
    ],
    Rotten: [
      'Dark surface fungal sporulation (Aspergillus niger black mold)',
      'Water-soaked soft depression near neck region (bacterial soft rot)',
      'Localized sunken lesion with brown wet exudate on outer scale',
    ],
    Sprouted: [
      'Emergent green vegetative apical shoot (>10mm length visible)',
      'Secondary central shoot swelling breaking through apical collar',
    ],
    Undersized: [
      'Equatorial diameter < 40mm, sub-standard bulb volume for table grade',
      'Immature miniature bulb, diameter measured at 36mm',
    ],
    Discolored: [
      'Sunscald bleached whitish-yellow patch on sunny side of bulb',
      'Post-harvest moisture staining and irregular grayish scale shade',
    ],
  };

  const colorsMap: Record<OnionClass, string> = {
    Healthy: '#831843',
    Damaged: '#B45309',
    Rotten: '#374151',
    Sprouted: '#15803D',
    Undersized: '#0284C7',
    Discolored: '#D97706',
  };

  // Generate a realistic grid of onions on a surface
  const cols = 6;
  const rows = Math.ceil(count / cols);

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let accumulated = 0;
    let chosenClass: OnionClass = 'Healthy';
    for (const item of classesDistribution) {
      accumulated += item.weight;
      if (r <= accumulated) {
        chosenClass = item.cls;
        break;
      }
    }

    const col = i % cols;
    const row = Math.floor(i / cols);
    const boxX = Math.round(10 + (col * (78 / cols)) + (Math.random() * 4 - 2));
    const boxY = Math.round(12 + (row * (76 / rows)) + (Math.random() * 4 - 2));
    const boxW = Math.round(10 + Math.random() * 3);
    const boxH = Math.round(10 + Math.random() * 3);

    let diameter = 52 + Math.floor(Math.random() * 20);
    if (chosenClass === 'Undersized') {
      diameter = 32 + Math.floor(Math.random() * 7);
    } else if (Math.random() > 0.8) {
      diameter = 72 + Math.floor(Math.random() * 8);
    }

    let sizeCat: DetectedOnion['sizeCategory'] = 'Medium (50-70mm)';
    if (diameter > 70) sizeCat = 'Extra Large (>70mm)';
    else if (diameter < 40) sizeCat = 'Undersized (<40mm)';
    else if (diameter < 50) sizeCat = 'Small (40-50mm)';

    const indicators = indicatorMap[chosenClass];
    const indicator = indicators[Math.floor(Math.random() * indicators.length)];

    onions.push({
      id: `#${String(i + 1).padStart(3, '0')}`,
      trackId: 100 + i + 1,
      box: {
        x: Math.max(4, Math.min(84, boxX)),
        y: Math.max(4, Math.min(84, boxY)),
        width: boxW,
        height: boxH,
      },
      predictedClass: chosenClass,
      confidence: Math.round((0.85 + Math.random() * 0.13) * 100) / 100,
      estimatedDiameterMm: diameter,
      sizeCategory: sizeCat,
      visibleIndicators: indicator,
      inspectorDecision: 'Pending',
      cropColor: colorsMap[chosenClass],
    });
  }

  return onions;
}

// Recalculates metrics for a batch based on its onions list
export function calculateBatchMetrics(onions: DetectedOnion[], totalFrames = 186): BatchMetrics {
  const total = onions.length || 1;
  const counts: DefectCounts = {
    healthy: 0,
    damaged: 0,
    rotten: 0,
    sprouted: 0,
    undersized: 0,
    discolored: 0,
  };

  let totalDiameter = 0;

  for (const o of onions) {
    const effectiveClass = (o.inspectorDecision === 'Overridden' && o.inspectorClass) ? o.inspectorClass : o.predictedClass;
    if (effectiveClass === 'Healthy') counts.healthy++;
    else if (effectiveClass === 'Damaged') counts.damaged++;
    else if (effectiveClass === 'Rotten') counts.rotten++;
    else if (effectiveClass === 'Sprouted') counts.sprouted++;
    else if (effectiveClass === 'Undersized') counts.undersized++;
    else if (effectiveClass === 'Discolored') counts.discolored++;

    totalDiameter += o.estimatedDiameterMm;
  }

  const defectiveCount = counts.damaged + counts.rotten + counts.sprouted + counts.discolored;
  const gradeACount = counts.healthy;
  const ursCount = counts.undersized + (counts.discolored > 0 ? Math.floor(counts.discolored / 2) : 0);

  const gradeAPercent = Math.round((gradeACount / total) * 1000) / 10;
  const defectivePercent = Math.round((defectiveCount / total) * 1000) / 10;
  const ursPercent = Math.round((ursCount / total) * 1000) / 10;
  const averageDiameterMm = Math.round((totalDiameter / total) * 10) / 10;

  return {
    totalDetectedFrames: Math.max(totalFrames, Math.round(total * 1.15)),
    uniqueOnionsCount: total,
    gradeAPercent,
    ursPercent,
    defectivePercent,
    defectCounts: counts,
    averageDiameterMm,
  };
}

// Evaluates batch grade against thresholds
export function evaluateFinalGrade(metrics: BatchMetrics, thresholds: GradingThresholds): InspectionBatch['finalGrade'] {
  const rotPercent = (metrics.defectCounts.rotten / metrics.uniqueOnionsCount) * 100;
  const sproutPercent = (metrics.defectCounts.sprouted / metrics.uniqueOnionsCount) * 100;

  if (metrics.defectivePercent >= thresholds.rejectThresholdDefectPercent || rotPercent > 5) {
    return 'Lot Rejected';
  }
  if (metrics.gradeAPercent >= (100 - thresholds.gradeAMaxDefectPercent) &&
      rotPercent <= thresholds.gradeAMaxRotPercent &&
      sproutPercent <= thresholds.gradeAMaxSproutPercent &&
      metrics.averageDiameterMm >= thresholds.gradeAMinDiameterMm) {
    return 'Grade A (Prime / Export)';
  }
  if (metrics.defectivePercent <= thresholds.ursMaxDefectPercent) {
    return 'Grade B (Domestic Table)';
  }
  return 'URS (Substandard)';
}

// Initial seed batches
const INITIAL_BATCHES: InspectionBatch[] = [
  {
    id: 'BATCH-2026-0928-01',
    reportId: 'RPT-ONION-9421',
    procurementCenter: 'Lasalgaon APMC Mandi, Nashik',
    inspectorName: 'Rajesh Deshmukh',
    inspectorRole: 'Senior Quality Inspector (Group A)',
    supplierFarmerId: 'FARM-MH-4921',
    supplierName: 'Suresh Bhausaheb Patil',
    timestamp: '2026-09-28 09:45 IST',
    onionVariety: 'Nashik Red (Garwa / Late Kharif)',
    sampleSizeKg: 10.0,
    location: 'Shed 4, Primary Ingest Weighbridge',
    notes: 'Late Kharif red onion harvest. Lot delivered in 50kg jute sacks. Visible surface dry and properly cured.',
    status: 'Approved',
    verificationStatus: 'Countersigned by Officer',
    metrics: {
      totalDetectedFrames: 186,
      uniqueOnionsCount: 172,
      gradeAPercent: 73.8,
      ursPercent: 16.3,
      defectivePercent: 9.9,
      defectCounts: {
        healthy: 127,
        damaged: 9,
        rotten: 4,
        sprouted: 2,
        undersized: 24,
        discolored: 6,
      },
      averageDiameterMm: 56.4,
    },
    onions: generateSampleDetectedOnions(36),
    finalGrade: 'Grade A (Prime / Export)',
    gradingRulesApplied: DEFAULT_GRADING_THRESHOLDS,
    inspectorRemarks: 'Sample shows high uniformity of Nashik Red variety. Minor neck cuts in 5% of specimens. Non-destructive camera assessment verified.',
    officerRemarks: 'Approved for government price support buffer stock procurement.',
    approvedBy: 'Pravin Jadhav (Procurement Officer, NAFED)',
    approvedAt: '2026-09-28 11:20 IST',
    captureSource: 'live_camera',
    previewImageUrl: '/src/assets/images/onion_inspection_tray_1790704349459.jpg',
  },
  {
    id: 'BATCH-2026-0927-04',
    reportId: 'RPT-ONION-9388',
    procurementCenter: 'Pimpalgaon Baswant APMC, Nashik',
    inspectorName: 'Sunita Gaikwad',
    inspectorRole: 'Agricultural Quality Inspector',
    supplierFarmerId: 'FARM-MH-8219',
    supplierName: 'Eknath Shinde & Sons',
    timestamp: '2026-09-27 14:15 IST',
    onionVariety: 'Agrifound Dark Red (ADR)',
    sampleSizeKg: 8.5,
    location: 'Platform B, Ingest Conveyor 2',
    notes: 'Lot presented with moderate field moisture. Inspector flagged potential transit cuts.',
    status: 'Verified',
    verificationStatus: 'Verified by Inspector',
    metrics: {
      totalDetectedFrames: 162,
      uniqueOnionsCount: 148,
      gradeAPercent: 68.2,
      ursPercent: 18.9,
      defectivePercent: 12.9,
      defectCounts: {
        healthy: 101,
        damaged: 11,
        rotten: 5,
        sprouted: 3,
        undersized: 22,
        discolored: 6,
      },
      averageDiameterMm: 52.8,
    },
    onions: generateSampleDetectedOnions(30),
    finalGrade: 'Grade B (Domestic Table)',
    gradingRulesApplied: DEFAULT_GRADING_THRESHOLDS,
    inspectorRemarks: 'Mechanical skin cuts observed on 7% of bulbs due to rough bagging. Acceptable for domestic market distribution.',
    officerRemarks: 'Certified under Grade B pricing band.',
    approvedBy: 'Vikram Joshi (Procurement Officer)',
    approvedAt: '2026-09-27 16:00 IST',
    captureSource: 'uploaded_video',
    previewImageUrl: '/src/assets/images/onion_defects_reference_1790704382432.jpg',
  },
  {
    id: 'BATCH-2026-0926-09',
    reportId: 'RPT-ONION-9310',
    procurementCenter: 'Solapur APMC Mandi, Solapur',
    inspectorName: 'Anand Kulkarni',
    inspectorRole: 'Mandi Quality Evaluator',
    supplierFarmerId: 'FARM-MH-3382',
    supplierName: 'Maruti Waghmare',
    timestamp: '2026-09-26 11:30 IST',
    onionVariety: 'Bhima Super (ICAR-DOGR)',
    sampleSizeKg: 12.0,
    location: 'Weighment Yard 1',
    notes: 'Lot received after heavy unseasonal drizzle. High moisture and emergent green shoots noted.',
    status: 'Approved',
    verificationStatus: 'Countersigned by Officer',
    metrics: {
      totalDetectedFrames: 210,
      uniqueOnionsCount: 190,
      gradeAPercent: 51.5,
      ursPercent: 24.2,
      defectivePercent: 24.3,
      defectCounts: {
        healthy: 98,
        damaged: 18,
        rotten: 14,
        sprouted: 11,
        undersized: 38,
        discolored: 11,
      },
      averageDiameterMm: 48.2,
    },
    onions: generateSampleDetectedOnions(32),
    finalGrade: 'URS (Substandard)',
    gradingRulesApplied: DEFAULT_GRADING_THRESHOLDS,
    inspectorRemarks: 'High sprout count and fungal black mold patches due to unseasonal rain exposure. Lot does not qualify for buffer storage.',
    officerRemarks: 'Re-routed for immediate local processing / dehydration unit dispatch.',
    approvedBy: 'Anand Kulkarni',
    approvedAt: '2026-09-26 13:10 IST',
    captureSource: 'live_camera',
    previewImageUrl: '/src/assets/images/onion_inspection_tray_1790704349459.jpg',
  },
  {
    id: 'BATCH-2026-0925-02',
    reportId: 'RPT-ONION-9255',
    procurementCenter: 'Indore Choithram Mandi, MP',
    inspectorName: 'Dr. Neha Verma',
    inspectorRole: 'State Agricultural Quality Officer',
    supplierFarmerId: 'FARM-MP-7104',
    supplierName: 'Rameshwar Patidar',
    timestamp: '2026-09-25 10:00 IST',
    onionVariety: 'Pusa Red / Madhavi',
    sampleSizeKg: 10.0,
    location: 'Inspection Bay 3',
    notes: 'Prime graded rabi crop, exceptionally well dried in farm sub-canopy.',
    status: 'Approved',
    verificationStatus: 'Countersigned by Officer',
    metrics: {
      totalDetectedFrames: 175,
      uniqueOnionsCount: 165,
      gradeAPercent: 82.4,
      ursPercent: 11.5,
      defectivePercent: 6.1,
      defectCounts: {
        healthy: 136,
        damaged: 5,
        rotten: 2,
        sprouted: 1,
        undersized: 16,
        discolored: 5,
      },
      averageDiameterMm: 62.1,
    },
    onions: generateSampleDetectedOnions(34),
    finalGrade: 'Grade A (Prime / Export)',
    gradingRulesApplied: DEFAULT_GRADING_THRESHOLDS,
    inspectorRemarks: 'Superior lot. 82%+ Grade A with firm scales, minimum defectives. Meets APEDA export specifications.',
    officerRemarks: 'Procured under Premium Price Slab 1.',
    approvedBy: 'Devendra Patel',
    approvedAt: '2026-09-25 11:45 IST',
    captureSource: 'uploaded_image',
    previewImageUrl: '/src/assets/images/onion_grading_facility_1790704368854.jpg',
  },
];

const LOCAL_STORAGE_KEY_BATCHES = 'onioniq_batches_v1';
const LOCAL_STORAGE_KEY_THRESHOLDS = 'onioniq_thresholds_v1';

export class OnionDataService {
  private static batches: InspectionBatch[] = [];
  private static thresholds: GradingThresholds = DEFAULT_GRADING_THRESHOLDS;
  private static initialized = false;

  private static init() {
    if (this.initialized) return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_BATCHES);
      if (stored) {
        this.batches = JSON.parse(stored);
      } else {
        this.batches = [...INITIAL_BATCHES];
        this.saveBatches();
      }

      const storedThresh = localStorage.getItem(LOCAL_STORAGE_KEY_THRESHOLDS);
      if (storedThresh) {
        this.thresholds = JSON.parse(storedThresh);
      } else {
        this.thresholds = { ...DEFAULT_GRADING_THRESHOLDS };
        this.saveThresholds();
      }
    } catch (e) {
      console.warn('LocalStorage error or unavailable, using memory store', e);
      this.batches = [...INITIAL_BATCHES];
      this.thresholds = { ...DEFAULT_GRADING_THRESHOLDS };
    }
    this.initialized = true;
  }

  private static saveBatches() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BATCHES, JSON.stringify(this.batches));
    } catch (e) {
      console.warn('Failed to save batches to localStorage', e);
    }
  }

  private static saveThresholds() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_THRESHOLDS, JSON.stringify(this.thresholds));
    } catch (e) {
      console.warn('Failed to save thresholds to localStorage', e);
    }
  }

  public static getBatches(): InspectionBatch[] {
    this.init();
    return [...this.batches];
  }

  public static getBatchById(id: string): InspectionBatch | undefined {
    this.init();
    return this.batches.find((b) => b.id === id || b.reportId === id);
  }

  public static addBatch(batch: InspectionBatch) {
    this.init();
    this.batches.unshift(batch);
    this.saveBatches();
  }

  public static updateBatch(updated: InspectionBatch) {
    this.init();
    const index = this.batches.findIndex((b) => b.id === updated.id);
    if (index !== -1) {
      this.batches[index] = updated;
      this.saveBatches();
    }
  }

  public static updateOnionDecision(
    batchId: string,
    onionId: string,
    decision: DetectedOnion['inspectorDecision'],
    overrideClass?: OnionClass,
    remarks?: string
  ): InspectionBatch | null {
    this.init();
    const batch = this.batches.find((b) => b.id === batchId);
    if (!batch) return null;

    const onion = batch.onions.find((o) => o.id === onionId);
    if (!onion) return null;

    onion.inspectorDecision = decision;
    if (overrideClass) onion.inspectorClass = overrideClass;
    if (remarks !== undefined) onion.inspectorRemarks = remarks;

    // Recalculate metrics
    batch.metrics = calculateBatchMetrics(batch.onions, batch.metrics.totalDetectedFrames);
    batch.finalGrade = evaluateFinalGrade(batch.metrics, batch.gradingRulesApplied);
    batch.verificationStatus = 'Verified by Inspector';
    if (batch.status === 'Draft' || batch.status === 'Pending Review') {
      batch.status = 'Verified';
    }

    this.updateBatch(batch);
    return batch;
  }

  public static getThresholds(): GradingThresholds {
    this.init();
    return { ...this.thresholds };
  }

  public static updateThresholds(newThresholds: GradingThresholds) {
    this.init();
    this.thresholds = { ...newThresholds, lastUpdatedAt: new Date().toLocaleString() };
    this.saveThresholds();
  }

  public static getDashboardMetrics() {
    this.init();
    const totalInspections = this.batches.length;
    let totalOnions = 0;
    let totalGradeA = 0;
    let totalURS = 0;
    let totalDefects = 0;
    let totalDamaged = 0;
    let totalRotten = 0;
    let totalSprouted = 0;
    let totalUndersized = 0;

    for (const b of this.batches) {
      totalOnions += b.metrics.uniqueOnionsCount;
      totalGradeA += (b.metrics.gradeAPercent / 100) * b.metrics.uniqueOnionsCount;
      totalURS += (b.metrics.ursPercent / 100) * b.metrics.uniqueOnionsCount;
      totalDefects += (b.metrics.defectivePercent / 100) * b.metrics.uniqueOnionsCount;
      totalDamaged += b.metrics.defectCounts.damaged;
      totalRotten += b.metrics.defectCounts.rotten;
      totalSprouted += b.metrics.defectCounts.sprouted;
      totalUndersized += b.metrics.defectCounts.undersized;
    }

    const safeTotal = totalOnions || 1;
    return {
      totalInspections,
      totalOnions,
      gradeAPercent: Math.round((totalGradeA / safeTotal) * 1000) / 10,
      ursPercent: Math.round((totalURS / safeTotal) * 1000) / 10,
      defectivePercent: Math.round((totalDefects / safeTotal) * 1000) / 10,
      rottenOnionsCount: totalRotten,
      sproutedOnionsCount: totalSprouted,
      damagedOnionsCount: totalDamaged,
      undersizedOnionsCount: totalUndersized,
    };
  }
}
