import React, { useEffect, useState } from 'react';
import { Server, Shield, HardDrive, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchNodes, NodeInfo } from '../services/api';

export const Nodes: React.FC = () => {
  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getNodes = async () => {
    setLoading(true);
    try {
      const data = await fetchNodes();
      setNodes(data);
      if (data.length === 0) {
        setError('No live data stream configured or connected.');
      } else {
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch node list from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNodes();
    // Automatic refresh interval of 10 seconds for node metrics
    const interval = setInterval(getNodes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cluster Nodes</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and monitor cluster compute instances</p>
        </div>
        <button
          onClick={getNodes}
          disabled={loading}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Nodes'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Backend Offline / No Live Data:</span> {error}. Node telemetry is currently unavailable.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Nodes</span>
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : (loading && nodes.length === 0 ? '...' : nodes.length)}</div>
          <span className={`text-xs mt-2 inline-block ${error ? 'text-red-400' : 'text-emerald-400'}`}>
            {error ? 'Offline' : '?% Healthy'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">CPU Allocation</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : '%'}</div>
          <span className="text-xs text-slate-400 mt-2 inline-block">Average CPU utilization</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Memory Usage</span>
            <HardDrive className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-4">{error ? '—' : '%'}</div>
          <span className="text-xs text-slate-400 mt-2 inline-block">Average memory allocation</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Active Nodes</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {nodes.map((node, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${node.status === 'Ready' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{node.name}</h4>
                  <p className="text-xs text-slate-400">{node.ip} • {node.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <p className="text-xs text-slate-400">CPU</p>
                  <p className="text-sm font-medium text-white">{node.cpu}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Memory</p>
                  <p className="text-sm font-medium text-white">{node.mem}</p>
                </div>
                <span className={`px-3 py-1 border rounded-full text-xs font-medium ${
                  node.status === 'Ready'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {node.status}
                </span>
              </div>
            </div>
          ))}
          {nodes.length === 0 && !loading && !error && (
            <div className="p-6 text-center text-sm text-slate-400">No nodes found.</div>
          )}
          {error && (
            <div className="p-8 text-center text-sm text-red-400 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <span>Unable to retrieve nodes. Backend service is offline.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
