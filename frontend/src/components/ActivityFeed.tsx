import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Server } from 'lucide-react';
import { fetchTelemetry } from '../services/api';

export const ActivityFeed: React.FC = () => {
  const [offline, setOffline] = useState<boolean>(true);

  useEffect(() => {
    fetchTelemetry()
      .then((data: any) => {
        if (data.clusterStatus === 'online') {
          setOffline(false);
        } else {
          setOffline(true);
        }
      })
      .catch(() => setOffline(true));
  }, []);

  const activities = [
    {
      id: 1,
      type: 'success',
      title: 'Cluster telemetry synchronized',
      description: 'Connected to backend successfully and streaming live metrics',
      time: 'Just now',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 2,
      type: 'info',
      title: 'NetData agent polling active',
      description: 'Polling host system telemetry metrics via backend proxy',
      time: 'Ongoing',
      icon: Server,
      color: 'text-indigo-400',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Cluster Activity Feed</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
          offline ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          {offline ? 'Backend Offline' : 'Live Connected'}
        </span>
      </div>

      <div className="space-y-4">
        {offline ? (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Cannot reach backend service. Activity stream paused.</span>
          </div>
        ) : (
          activities.map((activity) => {
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
          })
        )}
      </div>
    </div>
  );
};
