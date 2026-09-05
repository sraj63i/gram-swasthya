import { useState } from 'react';
import { X, Pill, Plus } from 'lucide-react';

export interface MedicineFormData {
  name: string;
  category: 'Antibiotics' | 'Analgesics' | 'Maternal Care' | 'Chronic Care' | 'First Aid';
  stockUnits: number;
  minThreshold: number;
  unitType: string;
  expiryDate: string;
  location: string;
}

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (medicine: MedicineFormData) => void;
}

export default function AddMedicineModal({ isOpen, onClose, onAddMedicine }: AddMedicineModalProps) {
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    category: 'Analgesics',
    stockUnits: 0,
    minThreshold: 100,
    unitType: 'Tablets',
    expiryDate: '',
    location: 'Main Store - Bay A',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.expiryDate) return;

    onAddMedicine(formData);
    onClose();

    setFormData({
      name: '',
      category: 'Analgesics',
      stockUnits: 0,
      minThreshold: 100,
      unitType: 'Tablets',
      expiryDate: '',
      location: 'Main Store - Bay A',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-brand-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">Add New Stock Item</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-100 hover:text-white p-1 rounded-lg hover:bg-brand-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medicine Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Ciprofloxacin 500mg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MedicineFormData['category'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Antibiotics">Antibiotics</option>
                <option value="Analgesics">Analgesics</option>
                <option value="Maternal Care">Maternal Care</option>
                <option value="Chronic Care">Chronic Care</option>
                <option value="First Aid">First Aid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Unit Type
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Tablets, Vials"
                value={formData.unitType}
                onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Initial Stock Units
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stockUnits}
                onChange={(e) => setFormData({ ...formData, stockUnits: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Dispensary Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Main Store - Bay B"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}