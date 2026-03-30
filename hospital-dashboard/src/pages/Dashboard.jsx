import React from 'react';
import { useHospital } from "../context/HospitalContext";
import { useRealtimeCollection } from "../hooks/useRealtimeCollection";

export default function Dashboard() {
  const { selectedHospitalId } = useHospital();
  
  // Real-time synchronization of the hospital document for live aggregated stats
  const { data: hospital, loading } = useRealtimeCollection(`hospitals/${selectedHospitalId}`, { isDocument: true });

  if (loading || !hospital) {
    return <div className="p-6">Loading dashboard telemetry...</div>;
  }

  const totalBeds = hospital.beds_total || 0;
  const availableBeds = hospital.beds_available || 0;
  const occupancyRate = totalBeds > 0 ? ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1) : 0;
  const opdQueue = hospital.opd_queue || 0;
  const waitTime = hospital.wait_time || 0;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Intelligence</h1>
          <p className="text-slate-500 mt-2">Real-time control panel for <span className="font-semibold text-slate-700">{hospital.name || 'Selected Hospital'}</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Beds */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Beds</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{totalBeds}</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-slate-400">
               <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
               Capacity
            </div>
          </div>

          {/* Available Beds */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available</p>
              <p className="mt-2 text-4xl font-black text-emerald-600">{availableBeds}</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg self-start">
               Ready to occupy
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Occupancy</p>
              <p className="mt-2 text-4xl font-black text-indigo-600">{occupancyRate}%</p>
            </div>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
               <div 
                 className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
                 style={{ width: `${occupancyRate}%` }}
               ></div>
            </div>
          </div>

          {/* Queue Info */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl shadow-md text-white flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">OPD Queue</p>
              <p className="mt-2 text-4xl font-black">{opdQueue}</p>
            </div>
            <div className="mt-4 text-sm font-semibold text-indigo-100 bg-indigo-900/30 px-3 py-1.5 rounded-xl self-start relative z-10 backdrop-blur-sm">
               ~{waitTime} mins est. wait
            </div>
            {/* Decorative background element */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Diagnostics</h2>
          <div className="bg-white rounded-3xl p-8 border border-slate-200">
             <div className="space-y-4">
                 <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4 text-emerald-600 font-bold">✓</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">System Connected</p>
                      <p className="text-xs text-slate-500">Live sync active with {hospital.name}</p>
                    </div>
                 </div>
                 {/* Live Telemetry Notice */}
                 <div className="flex items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 text-indigo-600 animate-pulse font-bold">📡</div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900">Real-time Telemetry Enabled</p>
                      <p className="text-xs text-indigo-700">All data shown is directly synchronized with the central Firestore database.</p>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
