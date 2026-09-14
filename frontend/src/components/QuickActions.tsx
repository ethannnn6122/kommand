import React from 'react';
import { Play, RefreshCw, Terminal, PlusCircle, ShieldAlert } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    { title: 'Deploy Service', description: 'Push a new container or version', icon: PlusCircle, color: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
    { title: 'Restart Cluster', description: 'Perform rolling restart of nodes', icon: RefreshCw, color: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' },
    { title: 'Run Diagnostics', description: 'Check health & network connectivity', icon: Terminal, color: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' },
    { title: 'Security Audit', description: 'Run vulnerability scan on pods', icon: ShieldAlert, color: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              className={`p-4 rounded-xl flex flex-col items-start transition-all text-left ${action.color} shadow-sm group`}
            >
              <div className="p-2.5 rounded-lg bg-white/10 mb-3 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm mb-1">{action.title}</span>
              <span className="text-xs text-slate-400">{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
