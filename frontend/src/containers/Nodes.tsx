import React from 'react';
import { Server, Shield, HardDrive, RefreshCw } from 'lucide-react';

export const Nodes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cluster Nodes</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and monitor cluster compute instances</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Nodes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Nodes</span>
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-4">4</div>
          <span className="text-xs text-emerald-400 mt-2 inline-block">100% Healthy</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">CPU Allocation</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-4">64.2%</div>
          <span className="text-xs text-slate-400 mt-2 inline-block">16 / 24 Cores Used</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Memory Usage</span>
            <HardDrive className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-4">48.5 GB</div>
          <span className="text-xs text-slate-400 mt-2 inline-block">of 64 GB Total</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Active Nodes</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {[
            { name: 'node-alpha-01', ip: '10.0.1.10', role: 'Control Plane', status: 'Ready', cpu: '42%', mem: '58%' },
            { name: 'node-alpha-02', ip: '10.0.1.11', role: 'Worker', status: 'Ready', cpu: '78%', mem: '82%' },
            { name: 'node-beta-01', ip: '10.0.2.20', role: 'Worker', status: 'Ready', cpu: '34%', mem: '45%' },
            { name: 'node-beta-02', ip: '10.0.2.21', role: 'Worker', status: 'Ready', cpu: '52%', mem: '60%' },
          ].map((node, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
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
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
