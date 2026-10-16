import express from 'express';
import cors from 'cors';
import { config } from './src/config/env.js';
import apiRoutes from './src/routes/api.js';

const app = express();

const allowedOrigins = new Set(config.corsOrigins);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin tidak diizinkan oleh CORS.'));
  }
}));
app.use(express.json({ limit: '32kb' }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Aeroute API Server Running!');
});

app.listen(config.port, () => {
  console.log(`Aeroute Backend Running on Port: ${config.port}`);
});