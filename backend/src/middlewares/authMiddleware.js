import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Akses ditolak! Token tidak ditemukan.' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Token tidak valid atau kedaluwarsa.' });
    }
    req.user = user;
    next();
  });
};