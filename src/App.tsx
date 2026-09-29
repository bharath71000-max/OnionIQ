import React, { useState } from 'react';
import { InspectionBatch, UserRole, DetectedOnion } from './types/onion';
import { OnionDataService } from './services/onionDataService';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { NewInspectionView } from './components/NewInspectionView';
import { InspectionCaptureAndAnalysisView } from './components/InspectionCaptureAndAnalysisView';
import { AnalysisResultsView } from './components/AnalysisResultsView';
import { IndividualOnionReviewView } from './components/IndividualOnionReviewView';
import { BatchGradingView } from './components/BatchGradingView';
import { QualityReportView } from './components/QualityReportView';
import { InspectionHistoryView } from './components/InspectionHistoryView';
import { CenterAnalyticsView } from './components/CenterAnalyticsView';
import { AIModelPerformanceView } from './components/AIModelPerformanceView';
import { UserManagementView } from './components/UserManagementView';
import { SettingsView } from './components/SettingsView';
import { MobileInspectionMode } from './components/MobileInspectionMode';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('officer');
  const [batches, setBatches] = useState<InspectionBatch[]>(
    OnionDataService.getBatches()
  );
  const [activeBatch, setActiveBatch] = useState<InspectionBatch>(
    batches[0] || ({} as InspectionBatch)
  );
  const [selectedOnionId, setSelectedOnionId] = useState<string | undefined>(undefined);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  // Configuration passed from New Inspection form to Capture View
  const [inspectionConfig, setInspectionConfig] = useState<{
    batchId: string;
    procurementCenter: string;
    inspectorName: string;
    farmerId: string;
    farmerName: string;
    variety: string;
    sampleSizeKg: number;
    location: string;
    notes: string;
    mode: 'camera' | 'upload' | 'demo';
  }>({
    batchId: 'BATCH-2026-0929-MH-01',
    procurementCenter: 'Lasalgaon APMC Mandi, Nashik',
    inspectorName: 'Rajesh Deshmukh',
    farmerId: 'FARM-MH-5832',
    farmerName: 'Dattatraya Shinde',
    variety: 'Nashik Red (Garwa / Late Kharif)',
    sampleSizeKg: 10.0,
    location: 'Weighment Bay 2',
    notes: 'Single layer spread on stainless steel grading table.',
    mode: 'demo',
  });

  const handleStartCapture = (config: typeof inspectionConfig) => {
    setInspectionConfig(config);
    setCurrentView('capture');
  };

  const handleCompleteAnalysis = (newBatch: InspectionBatch) => {
    OnionDataService.addBatch(newBatch);
    setBatches(OnionDataService.getBatches());
    setActiveBatch(newBatch);
    setCurrentView('results');
  };

  const handleUpdateBatch = (updatedBatch: InspectionBatch) => {
    setActiveBatch(updatedBatch);
    setBatches(OnionDataService.getBatches());
  };

  const handleSelectOnionForReview = (onion: DetectedOnion) => {
    setSelectedOnionId(onion.id);
    setCurrentView('review');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1E2922] flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileMode(false);
        }}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isMobileMode={isMobileMode}
        onToggleMobileMode={() => setIsMobileMode(!isMobileMode)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-12">
        {currentView === 'dashboard' && (
          <DashboardView
            batches={batches}
            currentRole={currentRole}
            onSelectBatch={(batch) => setActiveBatch(batch)}
            onNavigate={setCurrentView}
            onStartNewInspection={() => setCurrentView('new-inspection')}
          />
        )}

        {currentView === 'new-inspection' && (
          <NewInspectionView
            onStartCapture={handleStartCapture}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'capture' && (
          <InspectionCaptureAndAnalysisView
            initialConfig={inspectionConfig}
            onCompleteAnalysis={handleCompleteAnalysis}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'results' && activeBatch.id && (
          <AnalysisResultsView
            batch={activeBatch}
            onNavigate={setCurrentView}
            onSelectOnionForReview={handleSelectOnionForReview}
          />
        )}

        {currentView === 'review' && activeBatch.id && (
          <IndividualOnionReviewView
            batch={activeBatch}
            selectedOnionId={selectedOnionId}
            onUpdateBatch={handleUpdateBatch}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'grading' && activeBatch.id && (
          <BatchGradingView
            batch={activeBatch}
            currentRole={currentRole}
            onUpdateBatch={handleUpdateBatch}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'report' && activeBatch.id && (
          <QualityReportView batch={activeBatch} onNavigate={setCurrentView} />
        )}

        {currentView === 'history' && (
          <InspectionHistoryView
            batches={batches}
            onSelectBatch={(batch) => setActiveBatch(batch)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'analytics' && (
          <CenterAnalyticsView onNavigate={setCurrentView} />
        )}

        {currentView === 'model-mgmt' && <AIModelPerformanceView />}

        {currentView === 'users' && <UserManagementView />}

        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* One-Handed Mobile Field Mode Fullscreen Overlay */}
      {isMobileMode && (
        <MobileInspectionMode
          onCloseMobileMode={() => setIsMobileMode(false)}
          onNavigateToResults={(batch) => {
            handleCompleteAnalysis(batch);
            setIsMobileMode(false);
          }}
        />
      )}

      {/* Clean Enterprise Government Footer */}
      <footer className="no-print bg-white border-t border-[#E2E8F0] py-6 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">OnionIQ</span>
            <span>·</span>
            <span>SIH 26031: AI-Powered Non-Destructive Onion Quality Assessment</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Model: OnionNet-YOLOv8x (Prototype)</span>
            <span>·</span>
            <span>NAFED / Agmark Standards 2026</span>
            <span>·</span>
            <button
              onClick={() => setCurrentView('settings')}
              className="text-[#15803D] hover:underline"
            >
              Grading Norms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
