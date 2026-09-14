import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Server } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      title: 'PLACEHOLDER Deployment successful',
      description: 'kommand-backend-v2.1.0 deployed to US-West cluster',
      time: '2 mins ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 2,
      type: 'warning',
      title: 'PLACEHOLDER High memory usage detected',
      description: 'Node worker-node-4 exceeded 85% memory allocation',
      time: '14 mins ago',
      icon: AlertCircle,
      color: 'text-amber-400',
    },
    {
      id: 3,
      type: 'info',
      title: 'PLACEHOLDER Rolling restart completed',
      description: 'All replicas for auth-service restarted successfully',
      time: '1 hour ago',
      icon: Server,
      color: 'text-indigo-400',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Cluster Activity Feed</h3>
        <button className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
          View All Logs
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-slate-800/40 border border-slate-800">
              <div className={`p-2 rounded-lg bg-slate-800 ${activity.color} mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{activity.title}</h4>
                  <span className="flex items-center text-xs text-slate-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
