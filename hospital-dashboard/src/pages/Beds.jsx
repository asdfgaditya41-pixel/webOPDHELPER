import React from 'react';
import { db } from "../services/firebase";
import { doc, writeBatch, serverTimestamp, increment } from "firebase/firestore";
import { useRealtimeCollection } from "../hooks/useRealtimeCollection";
import { useHospital } from '../context/HospitalContext';

export default function Beds() {
  const { selectedHospitalId, selectedHospitalData } = useHospital();
  
  // Real-time synchronization for hospital rooms subcollection
  const { data: rooms, loading } = useRealtimeCollection(`hospitals/${selectedHospitalId}/rooms`);

  const toggleBedStatus = async (roomId, bedId, currentStatus) => {
    // Determine target status. Cycle: available -> occupied -> reserved -> available
    // But per instructions: toggle available <-> occupied, and let's make it a simple toggle or cycle.
    // Let's use available <-> occupied for simplicity but support reserved.
    let newStatus = 'occupied';
    let availableDiff = 0;

    if (currentStatus === 'available') {
      newStatus = 'occupied';
      availableDiff = -1;
    } else if (currentStatus === 'occupied') {
      newStatus = 'reserved';
      availableDiff = 0; // Already not available
    } else {
      newStatus = 'available';
      availableDiff = 1; // Becoming available again
    }

    try {
      const batch = writeBatch(db);
      
      // 1. Update Room document (nested map)
      const roomRef = doc(db, `hospitals/${selectedHospitalId}/rooms`, roomId);
      batch.update(roomRef, {
        [`beds.${bedId}.status`]: newStatus,
        [`beds.${bedId}.source`]: 'manual',
        [`beds.${bedId}.last_updated`]: serverTimestamp(),
      });

      // 2. Atomically update Hospital aggregated available beds count
      if (availableDiff !== 0) {
        const hospitalRef = doc(db, 'hospitals', selectedHospitalId);
        batch.update(hospitalRef, {
          'beds_available': increment(availableDiff),
          'beds.available': increment(availableDiff),
          'last_updated': serverTimestamp(),
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error toggling bed status:", error);
      alert("Failed to update status. Please check your connection.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-emerald-500 border-emerald-100 hover:border-emerald-500 bg-emerald-50";
      case "occupied": return "bg-rose-500 border-rose-100 hover:border-rose-500 bg-rose-50";
      case "reserved": return "bg-amber-500 border-amber-100 hover:border-amber-500 bg-amber-50";
      default: return "bg-slate-500 border-slate-100 bg-slate-50";
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "available": return "bg-emerald-100 text-emerald-700";
      case "occupied": return "bg-rose-100 text-rose-700";
      case "reserved": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) return <div className="p-6">Loading beds...</div>;

  // Flatten rooms/beds into a single array for the grid
  const allBeds = [];
  rooms.forEach(room => {
    if (room.beds) {
      Object.entries(room.beds).forEach(([bedId, bedData]) => {
        allBeds.push({
          roomId: room.id,
          roomNumber: room.room_number || room.id,
          type: room.type,
          bedId,
          ...bedData
        });
      });
    }
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bed Management</h1>
            <p className="text-slate-500 mt-2">Managing rooms for <span className="font-semibold text-slate-700">{selectedHospitalData?.name}</span></p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Available</span>
             </div>
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Occupied</span>
             </div>
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Reserved</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {allBeds.map((bed, idx) => (
            <div
              key={`${bed.roomId}-${bed.bedId}`}
              onClick={() => toggleBedStatus(bed.roomId, bed.bedId, bed.status)}
              className={`p-6 rounded-3xl cursor-pointer group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border-2 ${getStatusColor(bed.status)}`}
            >
              <div className="flex items-center justify-between space-x-3 mb-4">
                <div className={`p-3 rounded-2xl text-white shadow-sm ${
                  bed.status === "available" ? "bg-emerald-500" : bed.status === "occupied" ? "bg-rose-500" : "bg-amber-500"
                }`}>
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getBadgeColor(bed.status)}`}>
                  {bed.status}
                </span>
              </div>
              
              <h2 className="text-xl font-black text-slate-900 flex items-center">
                Room <span className="text-indigo-600 ml-1">{bed.roomNumber}</span>
              </h2>
              <div className="flex justify-between items-center mt-1">
                <p className="text-slate-500 font-bold text-sm tracking-wide bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">{bed.type} Unit</p>
                <p className="text-xs font-mono font-bold text-slate-400">ID: {bed.bedId.replace('bed_', '')}</p>
              </div>
              
              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <span className="text-xs font-bold text-indigo-600 flex items-center uppercase tracking-widest group-hover:text-indigo-800 transition-colors">
                  Tap to Cycle Status
                  <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {allBeds.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-300">
             <div className="text-4xl mb-4">🛏️</div>
             <p className="text-slate-800 font-bold text-xl mb-2">No rooms configured.</p>
             <p className="text-slate-500">Please seed the hospital rooms via the Flutter application or administrative tool.</p>
          </div>
        )}
      </div>
    </div>
  );
}
