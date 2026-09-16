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
