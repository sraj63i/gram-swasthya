import React from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  Pill, 
  Calendar, 
  Activity, 
  UserCheck, 
  Lock, 
  LogOut, 
  ShieldAlert,
  CreditCard,
  Wifi,
  Database
} from 'lucide-react';
import type { UserSession } from './LoginModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout,
}: NavbarProps) {
  const currentRole = currentUser?.role?.toLowerCase();

  const allNavItems = [
    { id: 'doctors', label: 'Doctor Directory', icon: Stethoscope, isPublic: true },
    { id: 'inventory', label: 'Medicine Inventory', icon: Pill, isPublic: true },
    { id: 'grievances', label: 'Grievance Redressal', icon: ShieldAlert, isPublic: true },
    { id: 'abha', label: 'ABHA Health ID', icon: CreditCard, isPublic: true },
    { id: 'offline', label: 'Offline Sync Engine', icon: Database, isPublic: true },
    { id: 'appointments', label: 'Appointments', icon: Calendar, allowedRoles: ['doctor', 'dho'] },
    { id: 'symptoms', label: 'ASHA Symptom Logger', icon: Activity, allowedRoles: ['asha', 'dho'] },
    { id: 'attendance', label: 'Doctor Presence', icon: UserCheck, allowedRoles: ['doctor', 'dho'] },
  ];

  const visibleNavItems = allNavItems.filter((item) => {
    if (item.isPublic) return true;
    if (!currentRole || currentRole === 'public' || currentRole === 'citizen') return false;
    return item.allowedRoles?.includes(currentRole);
  });

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setActiveTab('doctors')}
        >
          <div className="bg-emerald-700 p-2 rounded-xl">
            <HeartPulse className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none">Gram Swasthya</h1>
            <p className="text-[10px] text-emerald-200 mt-0.5">Rural Healthcare Portal</p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-inner'
                    : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-300" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-800 text-emerald-200 border border-emerald-700">
            <Wifi className="w-3 h-3 text-emerald-400" />
            Online
          </span>

          {currentUser && currentRole !== 'public' && currentRole !== 'citizen' ? (
            <div className="flex items-center gap-2 bg-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-700">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-300 uppercase font-semibold">{currentUser.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-emerald-700 rounded text-emerald-200 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-md"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}