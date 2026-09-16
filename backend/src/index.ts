import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import db from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory store for configured custom APIs and Netdata agents
interface ApiSource {
  id: string;
  name: string;
  url: string;
  type: 'netdata' | 'generic' | 'kubernetes';
  apiKey?: string;
}

let apiSourcesStore: ApiSource[] = [];

// Debug payload inspector buffer
interface PayloadLog {
  id: string;
  timestamp: string;
  endpoint: string;
  targetUrl: string;
  status: number;
  payload: any;
}

const payloadLogsBuffer: PayloadLog[] = [];
const MAX_PAYLOAD_LOGS = 50;

function logPayload(endpoint: string, targetUrl: string, status: number, payload: any) {
  payloadLogsBuffer.unshift({
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    endpoint,
    targetUrl,
    status,
    payload,
  });
  if (payloadLogsBuffer.length > MAX_PAYLOAD_LOGS) {
    payloadLogsBuffer.pop();
  }
}

let homelabConfig = {
  netdataUrl: '',
  apiKey: '',
  pollingInterval: 5000,
  apiSources: apiSourcesStore,
};

// Load saved config from database on startup
db.get(`SELECT value FROM settings WHERE key = ?`, ['homelabConfig'], (err: Error | null, row: any) => {
  if (!err && row && row.value) {
    try {
      const parsed = JSON.parse(row.value);
      if (parsed.netdataUrl) homelabConfig.netdataUrl = parsed.netdataUrl;
      if (parsed.apiKey !== undefined) homelabConfig.apiKey = parsed.apiKey;
      if (parsed.pollingInterval) homelabConfig.pollingInterval = parsed.pollingInterval;
      if (Array.isArray(parsed.apiSources)) {
        homelabConfig.apiSources = parsed.apiSources;
        apiSourcesStore = parsed.apiSources;
      }
      console.log('[Database] Loaded homelab configuration from DB:', homelabConfig);
    } catch (e: any) {
      console.error('[Database] Failed to parse saved homelabConfig:', e.message);
    }
  }
});

// Helper function to fetch from a Netdata agent or external API with timeout
async function fetchExternal(url: string, timeoutMs = 4000, endpointName = 'unknown'): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  console.log(`[Netdata Proxy] Fetching external URL: ${url}`);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    console.log(`[Netdata Proxy] Response from ${url}: status ${res.status} ${res.statusText}`);
    const json = await res.json().catch(() => ({ rawText: 'non-json-response' }));
    logPayload(endpointName, url, res.status, json);
    if (!res.ok) {
      console.log(`[Netdata Proxy] Error body from ${url}:`, json);
      throw new Error(`External API error: ${res.status} ${res.statusText}`);
    }
    console.log(`[Netdata Proxy] Successfully fetched JSON from ${url}`);
    return json;
  } catch (err: any) {
    clearTimeout(timeout);
    console.error(`[Netdata Proxy] Failed fetching ${url}:`, err.message);
    logPayload(endpointName, url, 502, { error: err.message });
    throw err;
  }
}

// Auth endpoint using SQLite database
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    (err: Error | null, user: any) => {
      if (err) {
        return res.status(500).json({ error: 'Database error during authentication', details: err.message });
      }
      if (!user || user.password_hash !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      res.json({
        token: 'live-session-token-' + user.id,
        status: 'authenticated',
        user: { id: user.id, username: user.username, role: user.role }
      });
    }
  );
});

// Admin user management endpoints for SQLite
app.get('/api/admin/users', (req: Request, res: Response) => {
  db.all(`SELECT id, username, role, created_at FROM users`, [], (err: Error | null, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/admin/users', (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const userRole = role || 'admin';

  db.run(
    `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
    [username, password, userRole],
    function(this: { lastID: number }, err: Error | null) {
      if (err) {
        return res.status(400).json({ error: 'Failed to create user', details: err.message });
      }
      res.json({ success: true, userId: this.lastID, username, role: userRole });
    }
  );
});

// NetData v3 Agent API Endpoints proxy & fallback handlers:
app.get('/api/v3/info', async (req: Request, res: Response) => {
  const targetUrl = req.query.url ? String(req.query.url) : homelabConfig.netdataUrl;
  try {
    const data = await fetchExternal(`${targetUrl}/api/v3/info`, 4000, 'v3/info');
    res.json(data);
  } catch (err: any) {
    try {
      const v1Data = await fetchExternal(`${targetUrl}/api/v1/info`, 4000, 'v1/info');
      res.json(v1Data);
    } catch (v1Err: any) {
      res.status(502).json({ error: 'Failed to fetch info', details: err.message });
    }
  }
});

app.get('/api/v3/data', async (req: Request, res: Response) => {
  const chart = req.query.chart ? String(req.query.chart) : 'system.cpu';
  const targetUrl = req.query.url ? String(req.query.url) : homelabConfig.netdataUrl;
  try {
    const url = `${targetUrl}/api/v3/data?chart=${encodeURIComponent(chart)}&after=-1&points=1`;
    const data = await fetchExternal(url, 4000, 'v3/data');
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: `Failed to fetch chart data`, details: err.message });
  }
});

// Debug payloads endpoint for Dev View inspector
app.get('/api/debug/payloads', (req: Request, res: Response) => {
  res.json({
    count: payloadLogsBuffer.length,
    payloads: payloadLogsBuffer,
  });
});

// General NetData metrics summary for dashboard widgets
app.get('/api/metrics/netdata', async (req: Request, res: Response) => {
  const targetUrl = req.query.url ? String(req.query.url) : homelabConfig.netdataUrl;
  
  if (!targetUrl || targetUrl.trim() === '') {
    return res.status(400).json({
      status: 'disconnected',
      error: 'No API or Netdata agent configured.',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    console.log(`[Metrics Netdata] Fetching info and metrics from targetUrl: ${targetUrl}`);
    const [infoData, cpuData, ramData] = await Promise.all([
      fetchExternal(`${targetUrl}/api/v3/info`).catch(() => fetchExternal(`${targetUrl}/api/v1/info`).catch(() => null)),
      fetchExternal(`${targetUrl}/api/v3/data?chart=system.cpu&after=-1&points=1`).catch(() => null),
      fetchExternal(`${targetUrl}/api/v3/data?chart=system.ram&after=-1&points=1`).catch(() => null),
    ]);

    // 1. Extract OS & Hardware from nested v3 array or v1 fallback
    let osName = 'Linux';
    let totalRamBytes = 0;
    
    if (infoData?.agents?.[0]?.application) {
      osName = infoData.agents[0].application.os?.os || 'Linux';
      totalRamBytes = parseInt(infoData.agents[0].application.hw?.ram || '0', 10);
    } else if (infoData?.os_name) {
      osName = infoData.os_name;
      totalRamBytes = infoData.ram_total || 0;
    }

    // 2. Extract live CPU percentage
    let cpuUsage = '0.0%';
    if (cpuData?.data?.[0]?.length > 1) {
      // Netdata returns multiple dimensions (user, system, softirq). Summing them equals active %
      const sum = cpuData.data[0].slice(1).reduce((acc: number, val: number) => acc + (typeof val === 'number' ? val : 0), 0);
      cpuUsage = `${sum.toFixed(1)}%`;
    }

    // 3. Extract live RAM usage
    let memoryUsage = '0.0 GB';
    let rawMemoryUsed = 0;
    if (ramData?.data?.[0]?.length > 1) {
      // Typically index 1 or 2 contains the 'used' MB metric
      const usedIndex = ramData.labels?.indexOf('used') > -1 ? ramData.labels.indexOf('used') : 1;
      rawMemoryUsed = Math.abs(ramData.data[0][usedIndex] || 0);
      
      const usedGB = (rawMemoryUsed / 1024).toFixed(2);
      const totalGB = totalRamBytes > 0 ? (totalRamBytes / (1024 ** 3)).toFixed(2) : 'N/A';
      memoryUsage = `${usedGB} GB / ${totalGB} GB`;
    }

    res.json({
      status: 'connected',
      targetUrl,
      timestamp: new Date().toISOString(),
      metrics: {
        os: osName,
        cpuUsage,
        memoryUsage,
        rawMemoryUsedMB: rawMemoryUsed
      },
      debug: {
        infoPayload: infoData
      }
    });
  } catch (err: any) {
    res.status(502).json({
      status: 'disconnected',
      targetUrl,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Telemetry endpoint
app.get('/api/telemetry', async (req: Request, res: Response) => {
  let cpuUsage = '-';
  let memoryUsage = '-';
  let clusterStatus = 'disconnected';
  
  let targetUrl = homelabConfig.netdataUrl || (apiSourcesStore.length > 0 ? apiSourcesStore[0].url : 'http://192.168.1.242:8080');

  try {
    const netdataRes = await fetch(`${req.protocol}://${req.get('host')}/api/metrics/netdata?url=${encodeURIComponent(targetUrl)}`);
    if (netdataRes.ok) {
      const ndData = await netdataRes.json();
      if (ndData.status === 'connected') {
        clusterStatus = 'online';
        cpuUsage = ndData.metrics.cpuUsage;
        memoryUsage = ndData.metrics.memoryUsage;
      }
    }
  } catch {
    clusterStatus = 'offline';
  }

  res.json({
    clusterStatus,
    netdata: { cpuUsage, memoryUsage },
    uptimeKuma: { monitorsUp: 5, monitorsDown: 0 },
    sourcesCount: Math.max(apiSourcesStore.length, 1),
  });
});

// Nodes endpoint
app.get('/api/nodes', async (req: Request, res: Response) => {
  const nodes = [];
  const sources = apiSourcesStore.length > 0 ? apiSourcesStore : (homelabConfig.netdataUrl ? [{ id: 'default', name: 'Default Agent', url: homelabConfig.netdataUrl, type: 'netdata' as const }] : []);

  for (const source of sources) {
    try {
      const info = await fetchExternal(`${source.url}/api/v3/info`, 2000).catch(() => fetchExternal(`${source.url}/api/v1/info`, 2000));
      
      const isV3 = info?.agents && info.agents.length > 0;
      const hw = isV3 ? info.agents[0].application.hw : info;
      const ramGB = hw?.ram ? (parseInt(hw.ram, 10) / (1024 ** 3)).toFixed(1) : (info?.ram_total ? (info.ram_total / (1024 ** 3)).toFixed(1) : 'N/A');

      nodes.push({
        name: isV3 ? info.agents[0].nm : (info?.hostname || source.name),
        ip: source.url.replace(/^https?:\/\//, '').split(':')[0] || '127.0.0.1',
        role: source.type.toUpperCase() + ' Agent Host',
        status: 'Ready',
        cpu: hw?.cpu_cores ? `${hw.cpu_cores} Cores` : (info?.cores ? `${info.cores} Cores` : 'Active'),
        mem: `${ramGB} GB`,
      });
    } catch (err: any) {
      nodes.push({
        name: source.name,
        ip: source.url.replace(/^https?:\/\//, '').split(':')[0] || '127.0.0.1',
        role: source.type.toUpperCase() + ' Agent Host',
        status: 'Offline',
        cpu: 'N/A',
        mem: 'N/A',
      });
    }
  }

  res.json(nodes);
});

// Workloads endpoint
app.get('/api/workloads', async (req: Request, res: Response) => {
  res.json([]);
});

// Homelab configuration & API sources settings endpoints
app.get('/api/settings/homelab', (req: Request, res: Response) => {
  res.json(homelabConfig);
});

app.post('/api/settings/homelab', (req: Request, res: Response) => {
  const { netdataUrl, apiKey, pollingInterval, apiSources } = req.body;
  if (netdataUrl) homelabConfig.netdataUrl = netdataUrl;
  if (apiKey !== undefined) homelabConfig.apiKey = apiKey;
  if (pollingInterval) homelabConfig.pollingInterval = pollingInterval;
  if (Array.isArray(apiSources)) {
    homelabConfig.apiSources = apiSources;
    apiSourcesStore = apiSources;
  }

  // Persist to SQLite settings table
  db.run(
    `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ['homelabConfig', JSON.stringify(homelabConfig)],
    (err: Error | null) => {
      if (err) {
        console.error('[Database] Failed to save homelabConfig:', err.message);
      } else {
        console.log('[Database] Successfully persisted homelabConfig to DB.');
      }
    }
  );

  res.json({ success: true, config: homelabConfig });
});

app.listen(PORT, () => {
  console.log(`Kommand Express backend running on port ${PORT}`);
});