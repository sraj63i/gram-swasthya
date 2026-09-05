import React, { useEffect, useState } from 'react';
import { getGrievances, createGrievance } from '../services/api';

export const GrievanceTracker: React.FC = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    ticket_id: `GRV-${Math.floor(100000 + Math.random() * 900000)}`,
    citizen_name: '',
    phc_location: '',
    category: 'Medicine Supply Delay',
    description: '',
    priority: 'Medium'
  });

  const fetchGrievances = () => {
    getGrievances().then((res) => setGrievances(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGrievance(formData)
      .then(() => {
        alert(`Grievance submitted! Ticket ID: ${formData.ticket_id}`);
        setFormData({
          ticket_id: `GRV-${Math.floor(100000 + Math.random() * 900000)}`,
          citizen_name: '',
          phc_location: '',
          category: 'Medicine Supply Delay',
          description: '',
          priority: 'Medium'
        });
        fetchGrievances();
      })
      .catch((err) => console.error('Error submitting grievance:', err));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
        <h3 className="text-lg font-bold mb-4">Submit Public Grievance</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Citizen Name</label>
            <input type="text" required className="w-full p-2 border rounded text-sm mt-1"
              value={formData.citizen_name} onChange={(e) => setFormData({...formData, citizen_name: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">PHC / Sub-Centre Location</label>
            <input type="text" required className="w-full p-2 border rounded text-sm mt-1"
              value={formData.phc_location} onChange={(e) => setFormData({...formData, phc_location: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Issue Category</label>
            <select className="w-full p-2 border rounded text-sm mt-1"
              value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="Medicine Shortage">Medicine Shortage</option>
              <option value="Doctor Absenteeism">Doctor Absenteeism</option>
              <option value="Facility Infrastructure">Facility Infrastructure</option>
              <option value="Staff Misbehavior">Staff Misbehavior</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Description</label>
            <textarea rows={3} required className="w-full p-2 border rounded text-sm mt-1"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-medium text-sm hover:bg-red-700">
            Lodge Grievance Ticket
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
        <h3 className="text-lg font-bold mb-4">Live Escalation Dashboard</h3>
        <div className="space-y-3">
          {grievances.map((g) => (
            <div key={g.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-500">{g.ticket_id}</span>
                  <span className="text-sm font-bold text-gray-800">{g.category}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{g.description}</p>
                <p className="text-xs text-gray-400 mt-2">Location: {g.phc_location} | Reported by: {g.citizen_name}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                g.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {g.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrievanceTracker;