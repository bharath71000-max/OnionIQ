import React, { useState } from 'react';
import { UserRole } from '../types/onion';
import {
  Users,
  ShieldCheck,
  Building,
  UserPlus,
  CheckCircle,
  Key,
  BadgeAlert,
} from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  role: UserRole;
  center: string;
  designation: string;
  status: 'Active' | 'Pending Verification';
  lastActive: string;
}

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 'USR-8419',
      name: 'Rajesh Deshmukh',
      role: 'inspector',
      center: 'Lasalgaon APMC Mandi, Nashik',
      designation: 'Senior Quality Inspector (Group A)',
      status: 'Active',
      lastActive: '10 mins ago',
    },
    {
      id: 'USR-9021',
      name: 'Pravin Jadhav',
      role: 'officer',
      center: 'Lasalgaon APMC Mandi, Nashik',
      designation: 'Procurement Officer (NAFED)',
      status: 'Active',
      lastActive: '1 hour ago',
    },
    {
      id: 'USR-6192',
      name: 'Sunita Gaikwad',
      role: 'inspector',
      center: 'Pimpalgaon Baswant APMC, Nashik',
      designation: 'Agricultural Quality Inspector',
      status: 'Active',
      lastActive: 'Yesterday',
    },
    {
      id: 'USR-4810',
      name: 'Dr. Neha Verma',
      role: 'inspector',
      center: 'Indore Choithram Mandi, MP',
      designation: 'State Agricultural Quality Officer',
      status: 'Active',
      lastActive: '3 hours ago',
    },
    {
      id: 'USR-1001',
      name: 'Dr. Rameshwar Shinde',
      role: 'admin',
      center: 'HQ Quality Directorate, Delhi',
      designation: 'Chief Agricultural Standards Officer',
      status: 'Active',
      lastActive: 'Just now',
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            <span>Access Control & Personnel</span>
            <span aria-hidden="true">·</span>
            <span>Mandi Field Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Authorized Inspectors & Procurement Officers
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Role-based credentials ensuring cryptographic attribution of all quality assessments.
          </p>
        </div>

        <button
          onClick={() => alert('New user registration portal open for verified Mandi staff.')}
          className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          + Add Mandi Inspector
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">User ID & Name</th>
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">Assigned Mandi Center</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0F172A]">{u.name}</div>
                    <div className="text-[10px] font-mono text-[#64748B]">{u.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-xs font-semibold text-[10px] uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#E0E7FF] text-[#3730A3]'
                          : u.role === 'officer'
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {u.role === 'admin'
                        ? 'Admin Council'
                        : u.role === 'officer'
                        ? 'Procurement Officer'
                        : 'Quality Inspector'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{u.center}</td>
                  <td className="py-3.5 px-4 text-[#64748B]">{u.designation}</td>
                  <td className="py-3.5 px-4 font-mono text-[#64748B] tabular-nums">{u.lastActive}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
