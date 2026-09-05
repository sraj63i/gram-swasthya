import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, Video, MapPin, Plus, Search, Filter } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  contact: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'In-Person' | 'Tele-Consultation';
  status: 'Confirmed' | 'Pending' | 'Completed';
  location: string;
}

const APPOINTMENTS_DATA: Appointment[] = [
  {
    id: 'APT-101',
    patientName: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    contact: '+91 98765 43210',
    doctorName: 'Dr. Ananya Sharma',
    specialty: 'General Medicine',
    date: '2026-09-05',
    time: '10:00 AM',
    type: 'In-Person',
    status: 'Confirmed',
    location: 'Rampur PHC - Room 2',
  },
  {
    id: 'APT-102',
    patientName: 'Sunita Devi',
    age: 32,
    gender: 'Female',
    contact: '+91 87654 32109',
    doctorName: 'Dr. Rajesh Patel',
    specialty: 'Pediatrics',
    date: '2026-09-05',
    time: '11:30 AM',
    type: 'Tele-Consultation',
    status: 'Pending',
    location: 'Virtual Portal',
  },
  {
    id: 'APT-103',
    patientName: 'Mahesh Verma',
    age: 58,
    gender: 'Male',
    contact: '+91 76543 21098',
    doctorName: 'Dr. Vikram Singh',
    specialty: 'Ayush & Community Health',
    date: '2026-09-06',
    time: '02:15 PM',
    type: 'In-Person',
    status: 'Confirmed',
    location: 'Kalyanpur Health Post',
  },
];

export default function AppointmentScheduler() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredAppointments = APPOINTMENTS_DATA.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || apt.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-500" />
            Patient Appointments & Tele-Consults
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage scheduled consultations and tele-health connections across sub-centres.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors self-start md:self-auto shadow-sm">
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'In-Person', 'Tele-Consultation'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-brand-300 transition-colors"
          >
            {/* Patient Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{apt.patientName}</h3>
                  <span className="text-xs text-slate-500">({apt.age} yrs, {apt.gender})</span>
                  <span className="bg-slate-100 text-slate-600 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-200">
                    {apt.id}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {apt.contact}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {apt.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Doctor & Timing Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                <p className="text-brand-600">{apt.specialty}</p>
              </div>

              <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CalendarIcon className="w-3.5 h-3.5 text-brand-500" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{apt.time}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    apt.type === 'Tele-Consultation'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {apt.type === 'Tele-Consultation' ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {apt.type}
                </span>

                <button className="text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}