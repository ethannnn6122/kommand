import React, { useEffect, useState } from 'react';
import { fetchDebugPayloads } from '../services/api';

interface PayloadLog {
  id: string;
  timestamp: string;
  endpoint: string;
  targetUrl: string;
  status: number;
  payload: any;
}

export const DevPayloadInspector: React.FC = () => {
  const [logs, setLogs] = useState<PayloadLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<PayloadLog | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadPayloads = async () => {
    try {
      setLoading(true);
      const data = await fetchDebugPayloads();
      if (data && data.payloads) {
        setLogs(data.payloads);
        if (!selectedLog && data.payloads.length > 0) {
          setSelectedLog(data.payloads[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load debug payloads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayloads();
    if (!autoRefresh) return;
    const interval = setInterval(loadPayloads, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            Dev View: Netdata v3 Raw Payload Inspector
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time inspection buffer capturing incoming Netdata v3 & v1 API proxy responses. Missing fields fall back to <code className="text-emerald-400 font-mono">'?'</code>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            Auto-refresh (4s)
          </label>
          <button
            onClick={loadPayloads}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
          >
            {loading ? 'Refreshing...' : 'Refresh Payloads'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-hidden flex flex-col h-[650px]">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Captured Requests ({logs.length})</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No telemetry payloads captured yet. Trigger dashboard or node refresh to capture requests.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedLog?.id === log.id
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-semibold text-indigo-400">/{log.endpoint}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.status >= 200 && log.status < 300
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate font-mono">{log.targetUrl}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payload JSON Inspector Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Payload Detail Inspector</h3>
              {selectedLog && (
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {selectedLog.endpoint} @ {selectedLog.targetUrl}
                </p>
              )}
            </div>
            {selectedLog && (
              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md font-mono">
                {new Date(selectedLog.timestamp).toISOString()}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-hidden bg-slate-950 rounded-lg border border-slate-800/80 p-4 font-mono text-xs text-emerald-300 overflow-y-auto">
            {selectedLog ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(selectedLog.payload, null, 2)}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                Select a captured request payload on the left to inspect raw JSON data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
