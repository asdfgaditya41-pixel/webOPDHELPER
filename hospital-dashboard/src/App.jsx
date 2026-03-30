import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HospitalProvider, useHospital } from "./context/HospitalContext";
import HospitalSelect from "./pages/HospitalSelect";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Queue from "./pages/Queue";
import Inventory from "./pages/Inventory";
import Sidebar from "./components/Sidebar";

function AppContent() {
  const { selectedHospitalId } = useHospital();

  if (!selectedHospitalId) {
    return <HospitalSelect />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Premium Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <HospitalProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HospitalProvider>
  );
}

export default App;
