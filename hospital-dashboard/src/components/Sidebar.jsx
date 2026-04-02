import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useHospital } from "../context/HospitalContext";

export default function Sidebar() {
  const location = useLocation();
  const { selectedHospitalData, clearHospital } = useHospital();

  const menuItems = [
    { name: "Intelligence", path: "/", icon: "📊" },
    { name: "Bed Grid", path: "/beds", icon: "🛏️" },
    { name: "Active Queue", path: "/queue", icon: "🧍" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
  ];

  return (
    <div className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] z-50">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter flex items-center">
           <svg className="w-8 h-8 mr-2 -ml-1 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           CITY PULSE
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-1">Universal Medical Sync</p>
      </div>

      <div className="px-6 py-2 mb-6">
         <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between items-start shadow-inner">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Facility</p>
            <p className="text-sm font-black text-indigo-900 leading-tight">
              {selectedHospitalData?.name || "Initializing..."}
            </p>
         </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-white opacity-50 shadow-[0_0_10px_white]"></div>
              )}
              <span className={`text-xl mr-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"}`}>
                {item.icon}
              </span>
              <span className={`font-bold text-sm tracking-tight ${isActive ? "" : "group-hover:translate-x-1 transition-transform"}`}>
                 {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button 
          onClick={clearHospital}
          className="w-full mb-4 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-300 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
          <span>Switch Hospital</span>
        </button>
        
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center shadow-inner">
           <div className="relative flex items-center justify-center w-8 h-8 mr-3">
              <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative z-10"></div>
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Sync</p>
             <p className="text-[10px] font-bold text-slate-400">City Pulse Cloud</p>
           </div>
        </div>
      </div>
    </div>
  );
}
