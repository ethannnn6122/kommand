import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Layers, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchWorkloads, WorkloadInfo } from '../services/api';

export const Workloads: React.FC = () => {
  const [workloads, setWorkloads] = useState<WorkloadInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getWorkloads = async () => {
    setLoading(true);
    try {
      const data = await fetchWorkloads();
      setWorkloads(data);
      if (data.length === 0) {
        setError('No live data stream configured or connected.');
      } else {
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workloads from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkloads();
    const interval = setInterval(getWorkloads, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workloads</h1>
          <p className="text-sm text-slate-400 mt-1">Manage pods, deployments, and cluster services</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={getWorkloads}
            disabled={loading}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/25">
            <Plus className="w-4 h-4" />
            <span>Deploy Workload</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Backend Offline / No Live Data:</span> {error}. Please ensure the backend service is running and configured correctly.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Total Deployments</span>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : (loading && workloads.length === 0 ? '...' : workloads.length)}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Active Pods</span>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : (loading && workloads.length === 0 ? '...' : workloads.reduce((acc, w) => acc + parseInt(w.pods.split('/')[0] || '0', 10), 0))}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Services</span>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : (workloads.length > 0 ? workloads.length * 2 : 0)}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Ingress Routes</span>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : '-'}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Active Deployments</h3>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-medium">All Namespaces</span>
          </div>
        </div>
        <div className="divide-y divide-slate-800">
          {workloads.map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.namespace} • Image: {item.image}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Pods Ready</p>
                  <p className="text-sm font-medium text-white">{item.pods}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Age</p>
                  <p className="text-sm font-medium text-white">{item.age}</p>
                </div>
                <span className={`px-3 py-1 border rounded-full text-xs font-medium ${
                  item.status === 'Running'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
          {workloads.length === 0 && !loading && !error && (
            <div className="p-8 text-center text-sm text-slate-400">No active workloads found.</div>
          )}
          {error && (
            <div className="p-8 text-center text-sm text-red-400 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <span>Unable to retrieve live workloads due to backend disconnection.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
