import React, { useEffect, useState } from 'react';
import { getAbhaRecords, api } from '../services/api';

export const AbhaIntegration: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    abha_number: '',
    abha_address: '',
    aadhaar_last4: '',
    patient_name: '',
    gender: 'Male',
    dob: '',
    mobile: ''
  });

  const fetchRecords = () => {
    getAbhaRecords().then((res) => setRecords(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/abha/', formData)
      .then(() => {
        alert('ABHA Health ID generated successfully!');
        setFormData({
          abha_number: '',
          abha_address: '',
          aadhaar_last4: '',
          patient_name: '',
          gender: 'Male',
          dob: '',
          mobile: ''
        });
        fetchRecords();
      })
      .catch((err) => {
        console.error('Error creating ABHA record:', err);
        const errorData = err.response?.data;
        if (errorData) {
          const messages = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('\n');
          alert(`Validation Error:\n${messages}`);
        } else {
          alert('Failed to generate ABHA Health ID. Please check your network or inputs.');
        }
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
        <h3 className="text-lg font-bold mb-4">Generate ABHA Card</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full p-2 border rounded text-sm mt-1"
              value={formData.patient_name} 
              onChange={(e) => setFormData({...formData, patient_name: e.target.value})} 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">14-Digit ABHA Number</label>
            <input 
              type="text" 
              required 
              placeholder="91-XXXX-XXXX-XXXX" 
              className="w-full p-2 border rounded text-sm mt-1"
              value={formData.abha_number} 
              onChange={(e) => setFormData({...formData, abha_number: e.target.value})} 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">ABHA Address / Username</label>
            <input 
              type="text" 
              required 
              placeholder="name@abdm" 
              className="w-full p-2 border rounded text-sm mt-1"
              value={formData.abha_address} 
              onChange={(e) => setFormData({...formData, abha_address: e.target.value})} 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Date of Birth</label>
            <input 
              type="date" 
              required 
              className="w-full p-2 border rounded text-sm mt-1"
              value={formData.dob} 
              onChange={(e) => setFormData({...formData, dob: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Aadhaar (Last 4)</label>
              <input 
                type="text" 
                maxLength={4} 
                required 
                className="w-full p-2 border rounded text-sm mt-1"
                value={formData.aadhaar_last4} 
                onChange={(e) => setFormData({...formData, aadhaar_last4: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Mobile</label>
              <input 
                type="text" 
                required 
                className="w-full p-2 border rounded text-sm mt-1"
                value={formData.mobile} 
                onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded font-medium text-sm hover:bg-teal-700 mt-2">
            Issue ABHA Health ID
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
        <h3 className="text-lg font-bold mb-4">Verified Citizen Health Records</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {records.map((rec) => (
            <div key={rec.id} className="p-4 border border-teal-200 bg-teal-50/50 rounded-lg relative">
              <span className="absolute top-3 right-3 text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">Verified</span>
              <p className="font-bold text-gray-800">{rec.patient_name}</p>
              <p className="text-xs text-gray-600 mt-1">ABHA: <span className="font-mono font-medium">{rec.abha_number}</span></p>
              <p className="text-xs text-gray-600">Address: <span className="font-mono text-teal-700">{rec.abha_address}</span></p>
              <p className="text-xs text-gray-400 mt-2">DOB: {rec.dob} | Mobile: {rec.mobile} | Aadhaar: XXXX-XXXX-{rec.aadhaar_last4}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AbhaIntegration;