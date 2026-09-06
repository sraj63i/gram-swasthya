
import { useTranslation } from 'react-i18next';
import type { UserSession } from './LoginModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export function LanguageControls() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'en';

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { hi: 'hi-IN', mr: 'mr-IN', en: 'en-US' };
      utterance.lang = langMap[currentLang] || 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex bg-emerald-950 p-1 rounded-lg border border-emerald-800 text-xs">
      {[
        { code: 'hi', label: 'हिंदी' },
        { code: 'mr', label: 'मराठी' },
        { code: 'en', label: 'ENG' },
      ].map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            i18n.changeLanguage(lang.code);
            speak(lang.code === 'hi' ? 'हिंदी' : lang.code === 'mr' ? 'मराठी' : 'English');
          }}
          className={`px-2 py-1 rounded font-medium transition-colors ${
            currentLang === lang.code ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-300 hover:text-white'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout,
}: NavbarProps) {
  const role = currentUser?.role?.toLowerCase();

  const navItems = [
    { id: 'doctors', label: 'Doctor Directory', show: true },
    { id: 'inventory', label: 'Medicine Inventory', show: true },
    { id: 'grievances', label: 'Grievance Redressal', show: true },
    { id: 'abha', label: 'ABHA Health ID', show: true },
    { id: 'offline', label: 'Offline Sync Engine', show: true },
    { id: 'appointments', label: 'Appointments', show: role === 'doctor' || role === 'dho' },
    { id: 'symptoms', label: 'Symptom Tracker', show: role === 'asha' || role === 'dho' },
    { id: 'attendance', label: 'Doctor Presence', show: role === 'doctor' || role === 'dho' },
  ];

  const visibleItems = navItems.filter((item) => item.show);

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('doctors')}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-base">
            🩺
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight tracking-wide">
              Gram Swasthya
            </h1>
            <p className="text-[9px] text-emerald-200 tracking-wider hidden sm:block">
              Rural Healthcare Portal
            </p>
          </div>
        </div>

        {/* Right: Language Controls + Login */}
        <div className="flex items-center gap-2">
          <LanguageControls />

          {currentUser ? (
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 rounded-lg text-xs font-bold transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-emerald-950/80 border-t border-emerald-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;