import React from 'react';
import { LayoutDashboard, Terminal, Server, Cpu, Settings, Bell, Search, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nodes', label: 'Nodes', icon: Server },
    { id: 'workloads', label: 'Workloads', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <Terminal className="w-8 h-8 text-indigo-400" />
        <span className="text-xl font-bold tracking-wider text-white">KOMMAND</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400">Cluster Status</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-emerald-400">All Systems Normal</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
