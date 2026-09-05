import React, { useEffect, useState } from 'react';
import { getDoctors } from '../services/api';

export const DoctorDirectory: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading live doctor records...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Doctor Availability Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
            <p className="text-sm text-indigo-600 font-medium">{doc.specialty}</p>
            <p className="text-xs text-gray-500 mt-1">{doc.phc_name}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Available: {doc.days_available}</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                doc.is_available_today ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {doc.is_available_today ? 'On Duty Today' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};