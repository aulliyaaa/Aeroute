import express from 'express';
import { getCurrentUser, login, register, updateCurrentUser } from '../controllers/authController.js';
import { processRouteAnalysis } from '../controllers/routeController.js';
import { findLocations, getEnvironment } from '../controllers/environmentController.js';
import { listUserTrips, saveUserTrip } from '../controllers/tripController.js';
import { getAvatar, receiveAvatar, uploadCurrentAvatar } from '../controllers/avatarController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.put('/auth/profile', authenticateToken, updateCurrentUser);
router.post('/auth/avatar', authenticateToken, receiveAvatar, uploadCurrentAvatar);
router.get('/avatars/:filename', getAvatar);
router.post('/get-route-and-exposure', processRouteAnalysis);
router.get('/environment', getEnvironment);
router.get('/locations/search', findLocations);
router.get('/trips', authenticateToken, listUserTrips);
router.post('/trips', authenticateToken, saveUserTrip);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Aeroute Backend Active!' });
});

export default router;