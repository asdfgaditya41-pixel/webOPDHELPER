import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const hospitalId = "metro_hospital_heart_institute";

export const seedSampleData = async () => {
  try {
    console.log("⚡ Seeding Sample Data...");

    // 1. Seed Beds
    const beds = [
      { bedId: "101", type: "ICU", status: "available", hospitalId },
      { bedId: "102", type: "ICU", status: "occupied", patientId: "P-8821", hospitalId },
      { bedId: "103", type: "Oxygen", status: "available", hospitalId },
      { bedId: "104", type: "General", status: "reserved", hospitalId },
      { bedId: "105", type: "General", status: "available", hospitalId },
      { bedId: "201", type: "Oxygen", status: "available", hospitalId },
      { bedId: "202", type: "Oxygen", status: "occupied", patientId: "P-9102", hospitalId },
      { bedId: "203", type: "General", status: "available", hospitalId },
    ];

    for (const bed of beds) {
      await addDoc(collection(db, "beds"), bed);
    }

    // 2. Seed Queue
    const queue = [
      { patientName: "Rahul Sharma", tokenNumber: "101", status: "waiting", hospitalId, timestamp: serverTimestamp() },
      { patientName: "Anita Singh", tokenNumber: "102", status: "waiting", hospitalId, timestamp: serverTimestamp() },
      { patientName: "Dr. Vikram", tokenNumber: "103", status: "completed", hospitalId, timestamp: serverTimestamp() },
    ];

    for (const patient of queue) {
      await addDoc(collection(db, "queue"), patient);
    }

    console.log("✅ Sample data seeded successfully!");
    alert("Sample data seeded! Refresh to see changes if they don't auto-update immediately.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    alert("Seeding failed. Check console for details.");
  }
};
