import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { saveHomelabConfig } from '../services/api';

export const Settings: React.FC = () => {
  const [netdataUrl, setNetdataUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [pollingInterval, setPollingInterval] = useState<number>(5000);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveHomelab = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      const response = await saveHomelabConfig({
        netdataUrl,
        apiKey,
        pollingInterval,
      });
      if (response.success) {
        setStatusMessage({ type: 'success', text: 'Homelab & NetData configuration updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update configuration.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save configuration.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure data stream and telemetry source connection details</p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-lg text-sm border ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Homelab & NetData Connection panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Homelab & NetData Configuration Data</h2>
            <p className="text-xs text-slate-400">Configure connection details for your local homelab nodes and NetData server agents</p>
          </div>
        </div>

        <form onSubmit={handleSaveHomelab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                NetData Host Agent / Server URL
              </label>
              <input
                type="url"
                value={netdataUrl}
                onChange={(e) => setNetdataUrl(e.target.value)}
                placeholder="e.g. http://192.168.1.100:19999"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Bearer or Custom Token"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Metrics Polling Interval (ms)
            </label>
            <select
              value={pollingInterval}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value={1000}>1,000 ms (Real-time)</option>
              <option value={2000}>2,000 ms</option>
              <option value={5000}>5,000 ms (Recommended)</option>
              <option value={10000}>10,000 ms</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/25"
            >
              {loading ? 'Saving Connections...' : 'Save and Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
