import React from 'react';
import { Cpu, Plus, Layers, Play } from 'lucide-react';

export const Workloads: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workloads</h1>
          <p className="text-sm text-slate-400 mt-1">Manage pods, deployments, and cluster services</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/25">
          <Plus className="w-4 h-4" />
          <span>Deploy Workload</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Total Deployments</span>
          <div className="text-3xl font-bold text-white mt-4">12</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Active Pods</span>
          <div className="text-3xl font-bold text-white mt-4">34</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Services</span>
          <div className="text-3xl font-bold text-white mt-4">8</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-sm text-slate-400">Ingress Routes</span>
          <div className="text-3xl font-bold text-white mt-4">5</div>
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
          {[
            { name: 'auth-service', namespace: 'production', pods: '3/3', age: '14d', status: 'Running', image: 'auth:v2.1.0' },
            { name: 'api-gateway', namespace: 'production', pods: '5/5', age: '21d', status: 'Running', image: 'gateway:v1.4.2' },
            { name: 'payment-processor', namespace: 'production', pods: '2/2', age: '7d', status: 'Running', image: 'payment:v1.0.8' },
            { name: 'redis-cache', namespace: 'database', pods: '1/1', age: '45d', status: 'Running', image: 'redis:7.0' },
          ].map((item, i) => (
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
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
