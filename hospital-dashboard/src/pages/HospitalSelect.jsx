import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { useRealtimeCollection } from '../hooks/useRealtimeCollection';

export default function HospitalSelect() {
  const { selectHospital } = useHospital();
  // Fetch from the top-level 'hospitals' collection
  const { data: hospitals, loading } = useRealtimeCollection('hospitals');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading Hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Select Your Hospital
          </h1>
          <p className="text-xl text-slate-500">
            Choose a facility to access its central control panel.
          </p>
        </div>

        {hospitals && hospitals.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((hospital) => (
              <button
                key={hospital.id}
                onClick={() => selectHospital(hospital)}
                className="bg-white rounded-3xl p-8 text-left shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-2xl group-hover:text-white">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {hospital.name}
                </h3>
                <p className="text-slate-500 mb-6 flex-grow">{hospital.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Queue</p>
                    <p className="font-semibold text-slate-900">{hospital.opd_queue || 0} Waiting</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wait Time</p>
                    <p className="font-semibold text-slate-900">{hospital.wait_time || 0} mins</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No hospitals found</h3>
            <p className="text-slate-500">Please seed the database from the Flutter application first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
