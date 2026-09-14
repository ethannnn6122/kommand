import React from 'react';
import { User, Shield, Bell, Key, Globe, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage cluster preferences, security keys, and user profiles</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Cluster Region</h3>
              <p className="text-xs text-slate-400">Primary cloud provider region for worker nodes</p>
            </div>
          </div>
          <select className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none">
            <option>us-west-2 (Oregon)</option>
            <option>us-east-1 (N. Virginia)</option>
            <option>eu-central-1 (Frankfurt)</option>
          </select>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Audit Logging</h3>
              <p className="text-xs text-slate-400">Record all Kubernetes API requests for security compliance</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Slack Notifications</h3>
              <p className="text-xs text-slate-400">Send cluster alerts and deployment updates to Slack</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">API Access Tokens</h3>
              <p className="text-xs text-slate-400">Manage programmatic access credentials for CI/CD pipelines</p>
            </div>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Manage Keys
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors">
          Cancel
        </button>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/25">
          Save Changes
        </button>
      </div>
    </div>
  );
};
