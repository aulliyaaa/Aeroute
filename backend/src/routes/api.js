import express from 'express';
import { register, login } from '../controllers/authController.js';
import { processRouteAnalysis } from '../controllers/routeController.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/get-route-and-exposure', processRouteAnalysis);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Aeroute Backend Active!' });
});

export default router;