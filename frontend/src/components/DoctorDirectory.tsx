import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDoctors } from '../services/api';

export const DoctorDirectory: React.FC = () => {
  const { i18n } = useTranslation();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'en';

  useEffect(() => {
    getDoctors()
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctors from Django:', error);
        setLoading(false);
      });
  }, []);

  // Specialty Formatter & Spelling Corrector
  const formatSpecialty = (specialty: string) => {
    if (!specialty) return '';
    
    // Correct spelling check
    if (specialty.toLowerCase().includes('gynecologist') || specialty.toLowerCase().includes('gynaecologist')) {
      if (currentLang === 'hi') return 'स्त्री रोग विशेषज्ञ (Gynaecologist)';
      if (currentLang === 'mr') return 'स्त्रीरोग तज्ज्ञ (Gynaecologist)';
      return 'Gynaecologist'; // Updated correct British/Indian spelling
    }
    
    return specialty;
  };

  // Text-to-Speech handler for low-literacy users
  const handleSpeak = (doc: any) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing audio

      const formattedSpecialty = formatSpecialty(doc.specialty);

      const statusText = doc.is_available_today
        ? currentLang === 'hi' ? 'आज अस्पताल में उपस्थित हैं' : currentLang === 'mr' ? 'आज रुग्णालयात उपस्थित आहेत' : 'On duty today'
        : currentLang === 'hi' ? 'आज उपलब्ध नहीं हैं' : currentLang === 'mr' ? 'आज उपलब्ध नाहीत' : 'Unavailable today';

      const speechText = `${doc.name}. ${formattedSpecialty}. ${doc.phc_name}. ${statusText}.`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      const langMap: Record<string, string> = { hi: 'hi-IN', mr: 'mr-IN', en: 'en-US' };
      utterance.lang = langMap[currentLang] || 'en-US';

      window.speechSynthesis.speak(utterance);
    }
  };

  // Language translation helper for static labels
  const labels = {
    title: currentLang === 'hi' ? 'डॉक्टर उपलब्धता निर्देशिका' : currentLang === 'mr' ? 'डॉक्टर उपलब्धता सूची' : 'Doctor Availability Directory',
    available: currentLang === 'hi' ? 'उपलब्धता' : currentLang === 'mr' ? 'उपलब्धता' : 'Available',
    onDuty: currentLang === 'hi' ? 'आज उपस्थित' : currentLang === 'mr' ? 'आज उपस्थित' : 'On Duty Today',
    unavailable: currentLang === 'hi' ? 'अनुपस्थित' : currentLang === 'mr' ? 'अनुपस्थित' : 'Unavailable',
    listen: currentLang === 'hi' ? 'सुनें' : currentLang === 'mr' ? 'ऐका' : 'Listen',
    loading: currentLang === 'hi' ? 'डॉक्टरों का विवरण लोड हो रहा है...' : currentLang === 'mr' ? 'डॉक्टरांची माहिती लोड होत आहे...' : 'Loading live doctor records...',
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">{labels.loading}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{labels.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                {/* Audio Listen Button */}
                <button
                  onClick={() => handleSpeak(doc)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                  title="Listen to details"
                >
                  🔊 {labels.listen}
                </button>
              </div>

              {/* Specialty with corrected spelling */}
              <p className="text-sm text-indigo-600 font-medium mt-1">
                {formatSpecialty(doc.specialty)}
              </p>
              
              <p className="text-xs text-gray-500 mt-1">{doc.phc_name}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-600 text-xs font-medium">
                {labels.available}: {doc.days_available}
              </span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  doc.is_available_today ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {doc.is_available_today ? `🟢 ${labels.onDuty}` : `🔴 ${labels.unavailable}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};