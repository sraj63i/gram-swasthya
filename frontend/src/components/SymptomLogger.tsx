import { useState } from 'react';
import { Activity, Mic, MicOff, Save, CheckCircle2, User, FileText } from 'lucide-react';

interface SymptomLog {
  id: string;
  patientName: string;
  age: number;
  village: string;
  symptoms: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  voiceNoteRecorded: boolean;
  timestamp: string;
}

export default function SymptomLogger() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNoteRecorded, setVoiceNoteRecorded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    village: 'Rampur Sub-Centre',
    symptoms: '',
    severity: 'Mild' as SymptomLog['severity'],
  });

  const [recentLogs, setRecentLogs] = useState<SymptomLog[]>([
    {
      id: 'LOG-8801',
      patientName: 'Sita Devi',
      age: 29,
      village: 'Rampur',
      symptoms: 'High fever, severe chills, fatigue for 3 days',
      severity: 'Moderate',
      voiceNoteRecorded: true,
      timestamp: 'Today, 09:15 AM',
    },
    {
      id: 'LOG-8802',
      patientName: 'Ramu Kaka',
      age: 62,
      village: 'Kalyanpur',
      symptoms: 'Acute shortness of breath and chest tightness',
      severity: 'Critical',
      voiceNoteRecorded: false,
      timestamp: 'Today, 08:30 AM',
    },
  ]);

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 10) {
            clearInterval(interval);
            setIsRecording(false);
            setVoiceNoteRecorded(true);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setVoiceNoteRecorded(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.symptoms) return;

    const newLog: SymptomLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: formData.patientName,
      age: parseInt(formData.age) || 0,
      village: formData.village,
      symptoms: formData.symptoms,
      severity: formData.severity,
      voiceNoteRecorded: voiceNoteRecorded,
      timestamp: 'Just now',
    };

    setRecentLogs([newLog, ...recentLogs]);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        patientName: '',
        age: '',
        village: 'Rampur Sub-Centre',
        symptoms: '',
        severity: 'Mild',
      });
      setVoiceNoteRecorded(false);
    }, 2000);
  };

  const severityColors = {
    Mild: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-300',
    Severe: 'bg-orange-100 text-orange-800 border-orange-300',
    Critical: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Symptom Logging Form */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-brand-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-300" />
              ASHA Worker Symptom Logging
            </h2>
            <p className="text-brand-100 text-sm mt-1">
              Field health entry form optimized for rapid offline & voice logging.
            </p>
          </div>
          <span className="bg-white/10 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
            SIH Portal
          </span>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800">Symptom Log Successfully Saved!</h3>
            <p className="text-sm text-slate-500">Synced to PHC central triage system.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Patient Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meena Devi"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 34"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Severity Tag Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Symptom Severity Triage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Mild', 'Moderate', 'Severe', 'Critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: sev })}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                      formData.severity === sev
                        ? severityColors[sev] + ' shadow-sm ring-2 ring-brand-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms Description & Voice Note */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Observed Symptoms
                </label>

                {/* Voice Note Recording Button */}
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : voiceNoteRecorded
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Recording... ({recordingTime}s)</span>
                    </>
                  ) : voiceNoteRecorded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Voice Note Attached</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Record Voice Note</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={3}
                required
                placeholder="Describe symptoms, duration, and patient conditions..."
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                Submit Symptom Report
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent Field Submissions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-brand-500" />
          Recent ASHA Submissions
        </h3>

        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {log.patientName} ({log.age}y)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityColors[log.severity]}`}
                >
                  {log.severity}
                </span>
              </div>

              <p className="text-slate-600 line-clamp-2">{log.symptoms}</p>

              <div className="flex items-center justify-between text-slate-400 pt-1 text-[11px]">
                <span>{log.timestamp}</span>
                {log.voiceNoteRecorded && (
                  <span className="flex items-center gap-1 text-brand-600 font-medium">
                    <Mic className="w-3 h-3" /> Voice
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}