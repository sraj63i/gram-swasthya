import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Clean data structure with no emojis
const doctorsData = [
  { id: 'doc-1', name: 'Dr. Rajesh Sharma', specialtyKey: 'General Physician', status: 'present' },
  { id: 'doc-2', name: 'Dr. Sunita Patil', specialtyKey: 'Pediatrician', status: 'absent' }
];

const medicinesData = [
  { id: 'med-1', name: 'Paracetamol 500mg', usageKey: 'Fever', status: 'available' },
  { id: 'med-2', name: 'ORS Packets', usageKey: 'Dehydration', status: 'out_of_stock' }
];

export default function VoiceVisualApp() {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');

  const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'hi';

  // Text-to-Speech Output
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = { hi: 'hi-IN', mr: 'mr-IN', en: 'en-US' };
      utterance.lang = langMap[currentLang] || 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text Input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap = { hi: 'hi-IN', mr: 'mr-IN', en: 'en-US' };
    recognition.lang = langMap[currentLang] || 'hi-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceInputText(transcript);
      speak(transcript);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto font-sans pb-24">
      
      {/* 1. TOP LANGUAGE SELECTOR */}
      <header className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <span className="font-black text-lg text-blue-700 tracking-tight">
          Gram Swasthya
        </span>
        
        <div className="flex gap-1.5">
          {[
            { code: 'hi', label: 'हिंदी' },
            { code: 'mr', label: 'मराठी' },
            { code: 'en', label: 'ENG' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                speak(lang.code === 'hi' ? 'हिंदी चुनी गई' : lang.code === 'mr' ? 'मराठी निवडली' : 'English selected');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-colors ${
                currentLang === lang.code 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. VOICE SEARCH HERO WIDGET */}
      <section className="bg-blue-700 rounded-3xl p-6 text-white text-center shadow-md mb-6">
        <p className="text-sm font-semibold mb-3 opacity-90">
          {currentLang === 'hi' ? 'बोलकर खोजें' : currentLang === 'mr' ? 'बोलून शोध घ्या' : 'Tap & Speak'}
        </p>

        <button
          onClick={startListening}
          className={`w-16 h-16 mx-auto rounded-full font-bold text-sm shadow-lg flex items-center justify-center transition-all active:scale-95 ${
            isListening ? 'bg-red-500 ring-4 ring-red-300 text-white animate-pulse' : 'bg-white text-blue-700'
          }`}
        >
          {isListening ? '...' : 'MIC'}
        </button>

        {voiceInputText && (
          <p className="mt-3 text-xs bg-white/10 py-1 px-3 rounded-full inline-block font-medium">
            "{voiceInputText}"
          </p>
        )}
      </section>

      {/* 3. DOCTOR STATUS CARDS */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">
          {currentLang === 'hi' ? 'डॉक्टर उपलब्धता' : currentLang === 'mr' ? 'डॉक्टर उपलब्धता' : 'Doctors'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {doctorsData.map((doc) => {
            const isPresent = doc.status === 'present';
            const statusLabel = isPresent 
              ? (currentLang === 'hi' ? 'उपस्थित' : currentLang === 'mr' ? 'उपस्थित' : 'Available')
              : (currentLang === 'hi' ? 'अनुपस्थित' : currentLang === 'mr' ? 'अनुपस्थित' : 'Absent');

            return (
              <div
                key={doc.id}
                onClick={() => speak(`${doc.name}, ${doc.specialtyKey}, ${statusLabel}`)}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform ${
                  isPresent ? 'bg-emerald-50/50 border-emerald-500' : 'bg-rose-50/50 border-rose-400'
                }`}
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">{doc.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{doc.specialtyKey}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    isPresent ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {statusLabel}
                  </span>

                  <span className="text-xs font-bold text-blue-600">
                    {currentLang === 'hi' ? 'सुनें' : currentLang === 'mr' ? 'ऐका' : 'Listen'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MEDICINE STOCK CARDS */}
      <section>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">
          {currentLang === 'hi' ? 'दवा स्टॉक' : currentLang === 'mr' ? 'औषध साठा' : 'Medicines'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {medicinesData.map((med) => {
            const inStock = med.status === 'available';
            const stockLabel = inStock 
              ? (currentLang === 'hi' ? 'उपलब्ध है' : currentLang === 'mr' ? 'उपलब्ध आहे' : 'In Stock')
              : (currentLang === 'hi' ? 'समाप्त' : currentLang === 'mr' ? 'संपला' : 'Out of Stock');

            return (
              <div
                key={med.id}
                onClick={() => speak(`${med.name}, ${med.usageKey}, ${stockLabel}`)}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform ${
                  inStock ? 'bg-emerald-50/50 border-emerald-500' : 'bg-rose-50/50 border-rose-400'
                }`}
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">{med.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{med.usageKey}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    inStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {stockLabel}
                  </span>

                  <span className="text-xs font-bold text-blue-600">
                    {currentLang === 'hi' ? 'सुनें' : currentLang === 'mr' ? 'ऐका' : 'Listen'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}