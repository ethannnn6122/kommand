# Kommand
A centralized, split-architecture dashboard built for hybrid Kubernetes homelabs. It utilizes an external web hub and a local cluster agent to provide real-time telemetry, local AI model management, and persistent status reporting.

### Tech Stack
* Frontend Framework: React via Vite
* Styling & UI: Tailwind CSS paired with shadcn/ui
* API Proxy (Backend): A lightweight Node.js/Express backend to proxy requests

### Core Features
* Telemetry Widgets: Fetch metrics from local Netdata and Uptime Kuma deployments
* Local Model Manager: Manage local LLMs (add, remove) and control llama.cpp (start/stop)
* Shortcuts: Ability to add links to live deployments
* Local JWT Authentication
* Zero-Trust Routing: All communication between the local cluster agent and the external VPS hub flows securely through a VPN (NetBird) gateway.

### Deployment Architecture
Kommand uses a highly resilient Agent-Server model to ensure continuous monitoring and secure internal access:

* The VPS Hub (External): Hosts the React frontend (Vite + Tailwind CSS + shadcn/ui) and a lightweight receiver API. This serves as the always-online dashboard.
* The Cluster Agent (Internal): A Node.js/Express pod deployed inside the K3s default namespace. It securely polls local services and pushes encrypted state payloads to the VPS Hub via the NetBird tunnel.
* Offline Awareness: Because the Cluster Agent acts as an active heartbeat monitor, the VPS Hub can immediately reflect a "Cluster Down" status if your home loses power or the control plane crashes.
