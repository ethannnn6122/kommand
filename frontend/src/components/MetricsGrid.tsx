import React, { useEffect, useState } from 'react';
import { Activity, Server, Cpu, HardDrive, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { fetchTelemetry, ClusterTelemetry } from '../services/api';

export const MetricsGrid: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ClusterTelemetry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('disconnected');

  useEffect(() => {
    // Initial fetch
    const getTelemetry = async () => {
      try {
        const data = await fetchTelemetry() as any;
        if (data.clusterStatus === 'online') {
          setTelemetry(data);
          setStatus('online');
          setError(null);
        } else {
          setTelemetry(null);
          setStatus('disconnected');
          setError(data.unconfigured ? 'No API configured. Please configure at least one API in settings.' : 'Cluster is offline.');
        }
      } catch (err: any) {
        setStatus('disconnected');
        setTelemetry(null);
        setError(err.message || 'Failed to connect to Kommand backend');
      }
    };

    getTelemetry();

    // Setup polling every 5 seconds for real-time homelab dashboard updates
    const interval = setInterval(getTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = status === 'online' && telemetry !== null;

  const metrics = [
    {
      title: 'Active Nodes',
      value: isConnected ? '4 / 4' : 'Disconnected',
      change: isConnected ? '+0%' : 'No Data',
      trend: 'neutral',
      icon: Server,
      color: isConnected ? 'text-indigo-400' : 'text-slate-500',
      bg: isConnected ? 'bg-indigo-500/10' : 'bg-slate-800',
    },
    {
      title: 'CPU Utilization (NetData)',
      value: isConnected ? telemetry.netdata.cpuUsage : 'Disconnected',
      change: isConnected ? '+4.2%' : 'No Data',
      trend: 'up',
      icon: Cpu,
      color: isConnected ? 'text-emerald-400' : 'text-slate-500',
      bg: isConnected ? 'bg-emerald-500/10' : 'bg-slate-800',
    },
    {
      title: 'Memory Usage (NetData)',
      value: isConnected ? telemetry.netdata.memoryUsage : 'Disconnected',
      change: isConnected ? '-1.5%' : 'No Data',
      trend: 'down',
      icon: HardDrive,
      color: isConnected ? 'text-amber-400' : 'text-slate-500',
      bg: isConnected ? 'bg-amber-500/10' : 'bg-slate-800',
    },
    {
      title: 'Monitors Up / Down',
      value: isConnected ? `${telemetry.uptimeKuma.monitorsUp} / ${telemetry.uptimeKuma.monitorsDown}` : 'Disconnected',
      change: isConnected ? '100% Up' : 'No Data',
      trend: 'up',
      icon: Activity,
      color: isConnected ? 'text-cyan-400' : 'text-slate-500',
      bg: isConnected ? 'bg-cyan-500/10' : 'bg-slate-800',
    },
  ];

  return (
    <div className="space-y-4">
      {status === 'disconnected' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-400 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <div>
              <span className="font-semibold text-white">Status: Disconnected / Unconfigured.</span> Please configure at least one API or Netdata agent in Settings to begin streaming live data.
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const isUp = metric.trend === 'up' && !error;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">{metric.title}</span>
                <div className={`p-3 rounded-lg ${metric.bg} ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-white tracking-tight">{metric.value}</h3>
                <span className={`flex items-center text-xs font-semibold ${!isConnected ? 'text-slate-500' : isUp ? 'text-emerald-400' : metric.trend === 'down' ? 'text-amber-400' : 'text-slate-400'}`}>
                  {isUp && isConnected ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : metric.trend === 'down' && isConnected ? <ArrowDownRight className="w-3.5 h-3.5 mr-1" /> : null}
                  {metric.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
