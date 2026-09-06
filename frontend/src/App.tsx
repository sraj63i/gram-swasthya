import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { DoctorDirectory } from './components/DoctorDirectory';
import MedicineInventory from './components/MedicineInventory';
import AppointmentScheduler from './components/AppointmentScheduler';
import SymptomLogger from './components/SymptomLogger';
import DoctorAttendance from './components/DoctorAttendance';
import GrievanceTracker from './components/GrievanceTracker';
import AbhaIntegration from './components/AbhaIntegration';
import OfflineSyncManager from './components/OfflineSyncManager';
import LoginModal from './components/LoginModal';
import type { UserSession } from './components/LoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('doctors');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Role-based protection check
  useEffect(() => {
    const role = currentUser?.role?.toLowerCase();

    const restrictedTabMap: Record<string, string[]> = {
      appointments: ['doctor', 'dho'],
      symptoms: ['asha', 'dho'],
      attendance: ['doctor', 'dho'],
    };

    if (restrictedTabMap[activeTab]) {
      const allowedRoles = restrictedTabMap[activeTab];
      if (!role || role === 'public' || role === 'citizen' || !allowedRoles.includes(role)) {
        setActiveTab('doctors');
      }
    }
  }, [currentUser, activeTab]);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('doctors');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Dark Green Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container Views */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'doctors' && <DoctorDirectory />}
        {activeTab === 'inventory' && <MedicineInventory />}
        {activeTab === 'grievances' && <GrievanceTracker />}
        {activeTab === 'abha' && <AbhaIntegration />}
        {activeTab === 'offline' && <OfflineSyncManager />}

        {/* Role-Protected Component Views */}
        {activeTab === 'appointments' &&
          (currentUser?.role?.toLowerCase() === 'doctor' || currentUser?.role?.toLowerCase() === 'dho') && (
            <AppointmentScheduler />
          )}
        {activeTab === 'symptoms' &&
          (currentUser?.role?.toLowerCase() === 'asha' || currentUser?.role?.toLowerCase() === 'dho') && (
            <SymptomLogger />
          )}
        {activeTab === 'attendance' &&
          (currentUser?.role?.toLowerCase() === 'doctor' || currentUser?.role?.toLowerCase() === 'dho') && (
            <DoctorAttendance />
          )}
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(session) => {
          setCurrentUser(session);
          setIsLoginOpen(false);
        }}
      />
    </div>
  );
}