import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Database, CheckCircle2, ArrowUpRight, AlertTriangle } from 'lucide-react';

// Self-contained Offline Record Interface
export interface OfflineRecord {
  id: string;
  type: 'ASHA_SYMPTOM' | 'STOCK_UPDATE' | 'GRIEVANCE';
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCED';
}

const STORAGE_KEY = 'gram_swasthya_offline_queue';

// Internal Storage Helper Functions
const getOfflineQueue = (): OfflineRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveToOfflineQueue = (type: OfflineRecord['type'], payload: any): OfflineRecord => {
  const currentQueue = getOfflineQueue();
  const newRecord: OfflineRecord = {
    id: `OFFLINE-${Date.now()}`,
    type,
    payload,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING',
  };

  const updated = [newRecord, ...currentQueue];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRecord;
};

const clearSyncedQueue = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export default function OfflineSyncManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState<OfflineRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testModule, setTestModule] = useState<'ASHA_SYMPTOM' | 'STOCK_UPDATE' | 'GRIEVANCE'>('ASHA_SYMPTOM');
  const [sampleNote, setSampleNote] = useState('');

  useEffect(() => {
    setQueue(getOfflineQueue());
  }, []);

  const handleToggleNetwork = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);

    if (nextState && queue.length > 0) {
      triggerSync();
    }
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleNote.trim()) return;

    const payload = {
      note: sampleNote,
      recordedBy: 'Field Agent / ASHA',
      location: 'Block Kalyanpur Sub-Centre',
    };

    if (isOnline) {
      alert('Network Online: Record posted directly to central server!');
    } else {
      saveToOfflineQueue(testModule, payload);
      setQueue(getOfflineQueue());
      setSampleNote('');
    }
  };

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      clearSyncedQueue();
      setQueue([]);
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-900 text-white p-6 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" /> IndexedDB / Local Storage Adapter
          </div>
          <h2 className="text-xl font-bold">Offline Sync Engine (PWA Capable)</h2>
          <p className="text-emerald-100 text-xs mt-1">
            Guarantees uninterrupted operation in zero-connectivity rural zones by queuing actions locally until signal returns.
          </p>
        </div>

        {/* Network Toggle Simulator */}
        <button
          type="button"
          onClick={handleToggleNetwork}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
            isOnline
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
          }`}
        >
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{isOnline ? 'Network Status: ONLINE' : 'Network Status: OFFLINE (Simulated)'}</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Simulator */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" /> Offline Action Simulator
          </h3>
          <p className="text-xs text-slate-500">
            Switch network status to <strong>OFFLINE</strong> above and submit data to observe local browser queueing in real time.
          </p>

          <form onSubmit={handleSimulateSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Module</label>
              <select
                value={testModule}
                onChange={(e: any) => setTestModule(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ASHA_SYMPTOM">ASHA Symptom Logger</option>
                <option value="STOCK_UPDATE">Medicine Inventory Dispatch</option>
                <option value="GRIEVANCE">Grievance Ticket Submission</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Record Content / Note</label>
              <textarea
                rows={3}
                placeholder="e.g. Logged 3 cases of seasonal fever in Rampur village..."
                value={sampleNote}
                onChange={(e) => setSampleNote(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 ${
                isOnline ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isOnline ? 'Post Directly to Server' : 'Queue Locally (Offline Storage)'}
            </button>
          </form>
        </div>

        {/* Right Column: Active Local Queue */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-slate-800 text-sm">IndexedDB Pending Queue</h3>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                {queue.length} items
              </span>
            </div>

            {queue.length > 0 && isOnline && (
              <button
                type="button"
                onClick={triggerSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing Server...' : 'Force Manual Sync'}</span>
              </button>
            )}
          </div>

          {queue.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-xs font-semibold text-slate-700">Storage In-Sync</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No pending offline transactions. All field records are synchronized with central servers.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {!isOnline && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Network currently offline. Queued records will automatically upload once signal is restored.</span>
                </div>
              )}

              {queue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                        {item.id}
                      </span>
                      <span className="font-bold text-slate-800">{item.type}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] italic">"{item.payload.note}"</p>
                    <p className="text-[10px] text-slate-400">Time: {item.timestamp} | Status: {item.status}</p>
                  </div>

                  <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-full shrink-0">
                    QUEUED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}