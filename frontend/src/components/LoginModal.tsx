import { useState } from 'react';
import { Lock, UserCheck, Shield, Stethoscope, User, X } from 'lucide-react';

export type UserRole = 'public' | 'asha' | 'doctor' | 'dho';

export interface UserSession {
  name: string;
  role: UserRole;
  facility: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError('Please enter your authorization PIN');
      return;
    }

    const roleProfiles: Record<UserRole, UserSession> = {
      public: { name: 'Public Citizen', role: 'public', facility: 'Rampur Sub-Centre' },
      asha: { name: 'Sunita Devi (ASHA)', role: 'asha', facility: 'Rampur Sector 4' },
      doctor: { name: 'Dr. Ananya Sharma', role: 'doctor', facility: 'Rampur PHC' },
      dho: { name: 'Dr. R.K. Varma (DHO)', role: 'dho', facility: 'District HQ - Meerut' },
    };

    onLoginSuccess(roleProfiles[selectedRole]);
    setPasscode('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="bg-brand-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">SIH Secure Portal Login</h3>
          </div>
          <button onClick={onClose} className="p-1 text-brand-100 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select User Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-brand-500" />
                <span>Doctor / PHC Staff</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('dho')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${
                  selectedRole === 'dho'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Shield className="w-4 h-4 text-brand-500" />
                <span>DHO Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('asha')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${
                  selectedRole === 'asha'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <UserCheck className="w-4 h-4 text-brand-500" />
                <span>ASHA Field Worker</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('public')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${
                  selectedRole === 'public'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <User className="w-4 h-4 text-brand-500" />
                <span>Citizen / Public</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official PIN / Passcode
            </label>
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1234)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {error && <p className="text-xs text-rose-600 font-semibold mt-1">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Authenticate & Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}