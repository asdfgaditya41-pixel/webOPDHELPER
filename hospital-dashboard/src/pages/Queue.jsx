import React from 'react';
import { db } from "../services/firebase";
import { doc, writeBatch, increment, serverTimestamp } from "firebase/firestore";
import { useRealtimeCollection } from "../hooks/useRealtimeCollection";
import { useHospital } from '../context/HospitalContext';

export default function Queue() {
  const { selectedHospitalId } = useHospital();
  
  // Real-time synchronization for hospital patients subcollection
  const { data: queue, loading } = useRealtimeCollection(`hospitals/${selectedHospitalId}/patients`);

  const handleDischargePatient = async (patient) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Delete the patient document
      const patientRef = doc(db, `hospitals/${selectedHospitalId}/patients`, patient.id);
      batch.delete(patientRef);

      // 2. Decrement the hospital's queue counters and total wait time
      const hospitalRef = doc(db, 'hospitals', selectedHospitalId);
      const estTime = patient.estimated_time || 0;
      
      batch.update(hospitalRef, {
        'opd_queue': increment(-1),
        'wait_time': increment(-estTime),
        'last_updated': serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error("Error discharging patient:", error);
      alert("Failed to update queue. Please check your connection.");
    }
  };

  if (loading) return <div className="p-6">Loading patient queue...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Queue Management</h1>
            <p className="text-slate-500 mt-2">Managing live patient flow and wait times.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-3">Est. Wait</span>
             <span className="text-xl font-black text-indigo-600">
                {queue.reduce((acc, p) => acc + (p.estimated_time || 0), 0)} mins
             </span>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Entry ID</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Condition</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Time</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {queue.map((patient) => (
                <tr key={patient.id} className="hover:bg-indigo-50/50 transition-colors duration-200">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-mono font-black text-indigo-600">
                    #{patient.id.slice(0, 6)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-base font-bold text-slate-900">{patient.condition || "General Consultation"}</div>
                    <div className="text-xs text-slate-400 font-medium">Auto-assigned priority</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-700 font-mono inline-flex items-center">
                      ⏱ {patient.estimated_time || 0} min
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleDischargePatient(patient)}
                      className="group font-bold text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-500 px-6 py-2.5 rounded-xl transition-all duration-300 shadow-sm"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Mark Discharged
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {queue.length === 0 && (
            <div className="text-center py-24 border-t border-slate-100">
               <div className="text-4xl mb-4 text-emerald-500">✅</div>
               <p className="text-slate-900 text-xl font-black mb-2">Queue is Empty</p>
               <p className="text-slate-500 font-medium">All patients have been processed successfully.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
