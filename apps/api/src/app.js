import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import { getTrustProxyConfig } from './config/trustProxy.js';

const app = express();

app.set('trust proxy', getTrustProxyConfig());

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
// OAuth callbacks and their referrers can contain single-use credentials.
app.use(morgan(':method :safe-path :status :response-time ms'));
morgan.token('safe-path', (req) => req.path);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Analytics routes have been removed from the router configuration.
app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
