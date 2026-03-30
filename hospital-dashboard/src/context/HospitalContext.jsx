import React, { createContext, useContext, useState, useEffect } from "react";

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState(() => {
    return localStorage.getItem("selectedHospitalId") || null;
  });
  const [selectedHospitalData, setSelectedHospitalData] = useState(null);

  useEffect(() => {
    if (selectedHospitalId) {
      localStorage.setItem("selectedHospitalId", selectedHospitalId);
    } else {
      localStorage.removeItem("selectedHospitalId");
      setSelectedHospitalData(null);
    }
  }, [selectedHospitalId]);

  const selectHospital = (hospital) => {
    setSelectedHospitalId(hospital.id);
    setSelectedHospitalData(hospital);
  };

  const clearHospital = () => {
    setSelectedHospitalId(null);
    setSelectedHospitalData(null);
  };

  return (
    <HospitalContext.Provider
      value={{
        selectedHospitalId,
        selectedHospitalData,
        setSelectedHospitalData,
        selectHospital,
        clearHospital,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
