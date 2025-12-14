import express from 'express';
import cors from 'cors';
import { appConfig } from './config.js';
import healthRouter from './routes/health.js';
import userVaultsRouter from './routes/userVaults.js';
import merchantRouter from './routes/merchant.js';
import agentsRouter from './routes/agents.js';
import analyticsRouter from './routes/analytics.js';
import payAndCallRouter from './routes/payAndCall.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/user/vaults', userVaultsRouter);
app.use('/api/merchant', merchantRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/pay-and-call', payAndCallRouter);

// Start server
app.listen(appConfig.port, () => {
    console.log(`🚀 ShadowStream backend running on port ${appConfig.port}`);
    console.log(`   Environment: ${appConfig.nodeEnv}`);
    console.log(`   Health check: http://localhost:${appConfig.port}/health`);
});

export default app;
