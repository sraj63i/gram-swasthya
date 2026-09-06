import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMedicines, updateMedicineStock } from '../services/api';

export const MedicineInventory: React.FC = () => {
  const { i18n } = useTranslation();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [selectedMed, setSelectedMed] = useState<any | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(10);
  const [isRestockOpen, setIsRestockOpen] = useState<boolean>(false);
  
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newMedData, setNewMedData] = useState({
    name: '',
    batch: '',
    stock: 0,
    unit: 'Tablets'
  });

  const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'en';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    getMedicines()
      .then((response) => {
        setMedicines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching inventory from Django:', error);
        setMedicines([
          { id: 1, name: 'Paracetamol 500mg', batch: 'B202', stock: 12, unit: 'Tablets' },
          { id: 2, name: 'ORS Packets', batch: 'O901', stock: 0, unit: 'Packs' },
          { id: 3, name: 'Amoxicillin 250mg', batch: 'A104', stock: 5, unit: 'Strips' },
        ]);
        setLoading(false);
      });
  };

  // Open Restock Modal
  const openRestockModal = (med: any) => {
    setSelectedMed(med);
    setCustomAmount(10); // default custom value
    setIsRestockOpen(true);
  };

  // Submit Restock
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed || customAmount <= 0) return;

    const newStockTotal = (selectedMed.stock || 0) + Number(customAmount);

    try {
      if (typeof updateMedicineStock === 'function') {
        await updateMedicineStock(selectedMed.id, newStockTotal);
      }
    } catch (error) {
      console.warn('Backend update failed, applying local state update:', error);
    } finally {
      setMedicines((prev) =>
        prev.map((item) => (item.id === selectedMed.id ? { ...item, stock: newStockTotal } : item))
      );
      setIsRestockOpen(false);
      setSelectedMed(null);
    }
  };

  // Submit New Medicine
  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedData.name) return;

    const newEntry = {
      id: Date.now(),
      ...newMedData,
      stock: Number(newMedData.stock)
    };

    setMedicines((prev) => [newEntry, ...prev]);
    setIsAddOpen(false);
    setNewMedData({ name: '', batch: '', stock: 0, unit: 'Tablets' });
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600 font-medium">Loading medicine inventory...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentLang === 'hi' ? 'दवा सूची एवं स्टॉक' : currentLang === 'mr' ? 'औषध साठा सूची' : 'Medicine Inventory & Stock'}
        </h2>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <span>➕</span> Add New Medicine
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-600">
              <th className="p-4">Medicine Name</th>
              <th className="p-4">Batch No</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {medicines.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{med.name}</td>
                <td className="p-4 text-gray-500 font-mono text-xs">{med.batch || 'N/A'}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      med.stock > 10
                        ? 'bg-emerald-100 text-emerald-800'
                        : med.stock > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {med.stock} {med.unit || 'units'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openRestockModal(med)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95"
                  >
                    <span>⇆</span> Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 1. CUSTOM RESTOCK MODAL */}
      {isRestockOpen && selectedMed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Restock Medicine</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedMed.name} (Current: {selectedMed.stock} {selectedMed.unit})</p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                {[5, 10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomAmount(amt)}
                    className={`flex-1 py-1 rounded text-xs font-semibold border ${
                      customAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestockOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD NEW MEDICINE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Medicine</h3>

            <form onSubmit={handleAddMedicineSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ciprofloxacin 500mg"
                  value={newMedData.name}
                  onChange={(e) => setNewMedData({ ...newMedData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="e.g. B902"
                    value={newMedData.batch}
                    onChange={(e) => setNewMedData({ ...newMedData, batch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newMedData.stock}
                    onChange={(e) => setNewMedData({ ...newMedData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit Type</label>
                <select
                  value={newMedData.unit}
                  onChange={(e) => setNewMedData({ ...newMedData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Tablets">Tablets</option>
                  <option value="Strips">Strips</option>
                  <option value="Packs">Packs</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Vials">Vials</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineInventory;