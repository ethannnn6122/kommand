import React from 'react';
import { Activity, Server, Cpu, HardDrive, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const metrics = [
    {
      title: 'Active Nodes',
      value: '12 / 12',
      change: '+0%',
      trend: 'neutral',
      icon: Server,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'CPU Utilization',
      value: '42.8%',
      change: '+4.2%',
      trend: 'up',
      icon: Cpu,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Memory Usage',
      value: '78.2 GB',
      change: '-1.5%',
      trend: 'down',
      icon: HardDrive,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Total Requests / sec',
      value: '1,428',
      change: '+12.3%',
      trend: 'up',
      icon: Activity,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        const isUp = metric.trend === 'up';
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
              <span className={`flex items-center text-xs font-semibold ${isUp ? 'text-emerald-400' : metric.trend === 'down' ? 'text-amber-400' : 'text-slate-400'}`}>
                {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : metric.trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5 mr-1" /> : null}
                {metric.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
