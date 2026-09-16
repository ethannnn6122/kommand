/**
 * Kommand Frontend API Client
 * Provides robust typed methods to communicate with the Express backend proxy
 * and connected homelab/NetData services.
 */

const API_BASE = '/api';

export interface ClusterTelemetry {
  clusterStatus: string;
  netdata: {
    cpuUsage: string;
    memoryUsage: string;
  };
  uptimeKuma: {
    monitorsUp: number;
    monitorsDown: number;
  };
}

export interface NodeInfo {
  name: string;
  ip: string;
  role: string;
  status: string;
  cpu: string;
  mem: string;
}

export interface WorkloadInfo {
  name: string;
  namespace: string;
  pods: string;
  age: string;
  status: string;
  image: string;
}

export interface HomelabConfig {
  netdataUrl: string;
  apiKey: string;
  pollingInterval: number;
}

/**
 * Fetch general cluster telemetry and status metrics
 */
export async function fetchTelemetry(): Promise<ClusterTelemetry> {
  const response = await fetch(`${API_BASE}/telemetry`);
  if (!response.ok) {
    throw new Error(`Failed to fetch telemetry: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch connected Kubernetes/homelab nodes status
 */
export async function fetchNodes(): Promise<NodeInfo[]> {
  const response = await fetch(`${API_BASE}/nodes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch nodes: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch cluster workloads and deployments
 */
export async function fetchWorkloads(): Promise<WorkloadInfo[]> {
  const response = await fetch(`${API_BASE}/workloads`);
  if (!response.ok) {
    throw new Error(`Failed to fetch workloads: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NetData specific metrics
 */
export async function fetchNetDataMetrics(): Promise<any> {
  const response = await fetch(`${API_BASE}/metrics/netdata`);
  if (!response.ok) {
    throw new Error(`Failed to fetch NetData metrics: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Save homelab connection settings (NetData URL & API keys)
 */
export async function saveHomelabConfig(config: HomelabConfig): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/settings/homelab`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error(`Failed to save homelab configuration: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NetData v3 Info
 */
export async function fetchNetDataV3Info(url?: string): Promise<any> {
  const query = url ? `?url=${encodeURIComponent(url)}` : '';
  const response = await fetch(`${API_BASE}/v3/info${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Netdata v3 info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NetData v3 Nodes
 */
export async function fetchNetDataV3Nodes(url?: string): Promise<any> {
  const query = url ? `?url=${encodeURIComponent(url)}` : '';
  const response = await fetch(`${API_BASE}/v3/nodes${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Netdata v3 nodes: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NetData v3 Alerts
 */
export async function fetchNetDataV3Alerts(url?: string): Promise<any> {
  const query = url ? `?url=${encodeURIComponent(url)}` : '';
  const response = await fetch(`${API_BASE}/v3/alerts${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Netdata v3 alerts: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NetData v3 Chart Data
 */
export async function fetchNetDataV3Data(chart = 'system.cpu', after = '-1', points = '1', url?: string): Promise<any> {
  const params = new URLSearchParams({ chart, after, points });
  if (url) params.append('url', url);
  const response = await fetch(`${API_BASE}/v3/data?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Netdata v3 data for ${chart}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch Debug Payload Inspector logs
 */
export async function fetchDebugPayloads(): Promise<any> {
  const response = await fetch(`${API_BASE}/debug/payloads`);
  if (!response.ok) {
    throw new Error(`Failed to fetch debug payload logs: ${response.statusText}`);
  }
  return response.json();
}
