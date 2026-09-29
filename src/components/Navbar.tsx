import React from 'react';
import { UserRole } from '../types/onion';
import {
  Sparkles,
  Smartphone,
  ShieldCheck,
  Building2,
  Cpu,
  History,
  Settings,
  PlusCircle,
  LayoutDashboard,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isMobileMode: boolean;
  onToggleMobileMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentRole,
  onRoleChange,
  isMobileMode,
  onToggleMobileMode,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-inspection', label: 'New Inspection', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Mandi Centers', icon: Building2 },
    { id: 'model-mgmt', label: 'AI Model', icon: Cpu },
    { id: 'users', label: 'Users', icon: UserCheck },
    { id: 'settings', label: 'Grading Rules', icon: Settings },
  ];

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    officer: { label: 'Procurement Officer', desc: 'Batch approval & export' },
    inspector: { label: 'Quality Inspector', desc: 'Detection review & remarks' },
    admin: { label: 'Admin Council', desc: 'System standards & centers' },
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#15803D] flex items-center justify-center text-white font-bold shadow-xs">
                <span className="text-lg tracking-tighter">🌰</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#15803D] transition-colors">
                  OnionIQ
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-sm">
                  SIH 26031
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean 4-6 text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#15803D]/10 text-[#15803D] font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Role Switcher & Mobile Field Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile View Toggle */}
            <button
              onClick={onToggleMobileMode}
              title="Toggle Field Officer Mobile Screen"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                isMobileMode
                  ? 'bg-[#15803D] text-white border-[#15803D]'
                  : 'bg-white text-[#334155] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Field Mode</span>
            </button>

            {/* Role Switcher */}
            <div className="relative flex items-center bg-[#F1F5F9] rounded-md p-0.5 border border-[#E2E8F0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#64748B] ml-2 shrink-0 hidden sm:block" />
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-medium text-[#1E293B] pl-2 pr-6 py-1 focus:outline-hidden cursor-pointer"
                title="Switch Active Persona"
              >
                <option value="officer">Procurement Officer</option>
                <option value="inspector">Quality Inspector</option>
                <option value="admin">Admin Council</option>
              </select>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onNavigate('new-inspection')}
              className="flex items-center gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors shadow-xs whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Inspection</span>
              <span className="sm:hidden">Inspect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Nav for screens < 1024px */}
      <div className="lg:hidden border-t border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                isActive
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
