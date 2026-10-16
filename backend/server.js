import express from 'express';
import cors from 'cors';
import { config } from './src/config/env.js';
import apiRoutes from './src/routes/api.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Aeroute API Server Running!');
});

app.listen(config.port, () => {
  console.log(`Aeroute Backend Running on Port: ${config.port}`);
});