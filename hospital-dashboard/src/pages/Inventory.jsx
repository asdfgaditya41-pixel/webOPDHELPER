import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useRealtimeCollection } from '../hooks/useRealtimeCollection';
import { db } from '../services/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Inventory() {
  const { selectedHospitalId } = useHospital();
  
  // Use collection path `hospitals/{id}/inventory`
  const { data: inventory, loading } = useRealtimeCollection(`hospitals/${selectedHospitalId}/inventory`);

  const [newItemName, setNewItemName] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newThreshold, setNewThreshold] = useState("");

  const handleUpdateStock = async (itemId, currentStock, change) => {
    const newStockVal = Math.max(0, currentStock + change);
    try {
      await updateDoc(doc(db, `hospitals/${selectedHospitalId}/inventory`, itemId), {
        stock: newStockVal,
        last_updated: serverTimestamp()
      });
    } catch (e) {
      console.error("Error updating stock:", e);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newStock || !newThreshold) return;
    try {
      await addDoc(collection(db, `hospitals/${selectedHospitalId}/inventory`), {
        name: newItemName,
        stock: parseInt(newStock),
        threshold: parseInt(newThreshold),
        last_updated: serverTimestamp()
      });
      setNewItemName("");
      setNewStock("");
      setNewThreshold("");
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  if (loading) {
    return <div className="p-6">Loading inventory...</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 mt-2">Manage medical supplies and track low stock.</p>
        </header>

        {/* Add New Item Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Supply</h2>
          <form onSubmit={handleAddItem} className="flex space-x-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Item Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. N95 Masks" value={newItemName} onChange={e => setNewItemName(e.target.value)} required />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Initial Stock</label>
              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" value={newStock} onChange={e => setNewStock(e.target.value)} required min="0" />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Threshold</label>
              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" value={newThreshold} onChange={e => setNewThreshold(e.target.value)} required min="0" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 h-12">
              Add Item
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {inventory.map((item) => {
                const isLow = item.stock <= item.threshold;
                return (
                  <tr key={item.id} className={`hover:bg-slate-50 transition-colors duration-150 ${isLow ? 'bg-rose-50/50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-400">Alert when ≤ {item.threshold}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-2xl font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>{item.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isLow ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-100 text-rose-700 font-mono">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 font-mono">
                          SUFFICIENT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleUpdateStock(item.id, item.stock, -1)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold text-xl transition-colors">
                          -
                        </button>
                        <button onClick={() => handleUpdateStock(item.id, item.stock, 1)} className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center font-bold text-xl transition-colors">
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {inventory.length === 0 && (
            <div className="text-center py-20">
               <p className="text-slate-400 text-lg">Inventory is empty. Add a new supply to start tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
