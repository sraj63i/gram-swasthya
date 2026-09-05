import { useState } from 'react';
import { Pill, Search, AlertTriangle, CheckCircle, PackagePlus, ArrowDownUp } from 'lucide-react';
import AddMedicineModal from './AddMedicineModal';
import type { MedicineFormData } from './AddMedicineModal';
interface Medicine {
  id: string;
  name: string;
  category: 'Antibiotics' | 'Analgesics' | 'Maternal Care' | 'Chronic Care' | 'First Aid';
  stockUnits: number;
  minThreshold: number;
  unitType: string;
  expiryDate: string;
  location: string;
}

const INITIAL_INVENTORY: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    stockUnits: 14900,
    minThreshold: 300,
    unitType: 'Tablets',
    expiryDate: '2027-08-15',
    location: 'Main Store - Bay A',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    stockUnits: 85,
    minThreshold: 200,
    unitType: 'Capsules',
    expiryDate: '2026-11-30',
    location: 'Main Store - Bay B',
  },
  {
    id: '3',
    name: 'Iron & Folic Acid',
    category: 'Maternal Care',
    stockUnits: 2100,
    minThreshold: 500,
    unitType: 'Tablets',
    expiryDate: '2028-01-10',
    location: 'Sub-Centre Stockroom',
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    category: 'Chronic Care',
    stockUnits: 120,
    minThreshold: 250,
    unitType: 'Tablets',
    expiryDate: '2027-04-20',
    location: 'Main Store - Bay C',
  },
  {
    id: '5',
    name: 'ORS Packets',
    category: 'First Aid',
    stockUnits: 640,
    minThreshold: 150,
    unitType: 'Sachets',
    expiryDate: '2027-12-01',
    location: 'Sub-Centre Stockroom',
  },
];

export default function MedicineInventory() {
  const [inventory, setInventory] = useState<Medicine[]>(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Antibiotics', 'Analgesics', 'Maternal Care', 'Chronic Care', 'First Aid'];

  const handleAddMedicine = (newMedicine: MedicineFormData) => {
    const item: Medicine = {
      id: (inventory.length + 1).toString(),
      ...newMedicine,
    };
    setInventory([item, ...inventory]);
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventory.filter(item => item.stockUnits <= item.minThreshold).length;

  return (
    <div className="space-y-6">
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Items</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{inventory.length}</h3>
          </div>
          <div className="p-3 bg-brand-50 rounded-lg">
            <Pill className="w-6 h-6 text-brand-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Status</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">Healthy</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Main Inventory Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Essential Medicine Stock</h2>
              <p className="text-slate-500 text-sm mt-1">Real-time inventory levels for PHC and Sub-Centre dispensaries.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors self-start sm:self-auto shadow-sm"
            >
              <PackagePlus className="w-4 h-4" />
              Add Stock Item
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicine or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Medicine Details</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Stock Level</th>
                <th className="py-3.5 px-6">Expiry Date</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInventory.map((item) => {
                const isLowStock = item.stockUnits <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLowStock ? 'text-amber-600' : 'text-slate-800'}`}>
                          {item.stockUnits} {item.unitType}
                        </span>
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      {item.expiryDate}
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      {item.location}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
                        <ArrowDownUp className="w-3.5 h-3.5" /> Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />
    </div>
  );
}