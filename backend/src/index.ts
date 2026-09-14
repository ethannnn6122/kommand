import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  // handle local JWT authorization
})

// Health check endpoint
app.get('/api/metrics/netdata', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/metrics/uptime', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Telemetry endpoint placeholder
app.get('/api/telemetry', (req: Request, res: Response) => {
  res.json({
    clusterStatus: 'online',
    netdata: { cpuUsage: '14.2%', memoryUsage: '45.8%' },
    uptimeKuma: { monitorsUp: 12, monitorsDown: 0 }
  });
});

// Models endpoint placeholder
app.get('/api/models', (req: Request, res: Response) => {
  res.json({
    models: [
      { id: 'llama-3-8b', name: 'Llama 3 8B Instruct', status: 'running', vram: '5.2 GB' },
      { id: 'mistral-7b', name: 'Mistral 7B OpenOrca', status: 'stopped', vram: '0 GB' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Kommand Express backend running on port ${PORT}`);
});
