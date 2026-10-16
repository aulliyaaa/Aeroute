import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { config } from '../config/env.js';
import { createUser, findUserByEmail, findUserById, updateUser } from '../services/storageService.js';

const supportedMedicalProfiles = new Set(['standard', 'sensitive', 'asthma', 'pregnant_child']);
const supportedTransportModes = new Set(['motor', 'mobil', 'sepeda', 'jalan']);
const supportedStrategies = new Set(['balance', 'cleanest']);

const publicUser = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  medicalProfile: user.medicalProfile,
  transportMode: user.transportMode,
  strategy: user.strategy,
  avatarUrl: user.avatarFilename ? `/api/avatars/${user.avatarFilename}` : null,
  createdAt: user.createdAt
});

const createToken = user => jwt.sign(
  { id: user.id, email: user.email },
  config.jwtSecret,
  { expiresIn: '1d' }
);

export const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  const medicalProfile = req.body?.medicalProfile ?? req.body?.medical_profile ?? 'standard';

  if (
    typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 80 ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== 'string' || password.length < 8 || password.length > 128 ||
    !supportedMedicalProfiles.has(medicalProfile)
  ) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_REGISTRATION',
      message: 'Nama, email, password (minimal 8 karakter), atau profil tidak valid.'
    });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({
      status: 'error',
      code: 'EMAIL_ALREADY_REGISTERED',
      message: 'Email sudah terdaftar.'
    });
  }

  try {
    const user = createUser({
      id: randomUUID(),
      name: name.trim(),
      email,
      passwordHash: await bcrypt.hash(password, 12),
      medicalProfile,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      status: 'success',
      data: { token: createToken(user), user: publicUser(user) }
    });
  } catch (error) {
    if (String(error.message).includes('UNIQUE constraint failed: users.email')) {
      return res.status(409).json({
        status: 'error',
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Email sudah terdaftar.'
      });
    }
    console.error('Registration failed:', error.message);
    return res.status(500).json({ status: 'error', code: 'REGISTRATION_FAILED', message: 'Registrasi gagal.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi.' });
    }

    const user = findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ status: 'error', code: 'INVALID_CREDENTIALS', message: 'Email atau password salah.' });
    }

    return res.status(200).json({
      status: 'success',
      data: { token: createToken(user), user: publicUser(user) }
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ status: 'error', code: 'LOGIN_FAILED', message: 'Login gagal.' });
  }
};

export const getCurrentUser = (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: 'error', code: 'USER_NOT_FOUND', message: 'Akun tidak ditemukan.' });
  }
  return res.status(200).json({ status: 'success', data: { user: publicUser(user) } });
};

export const updateCurrentUser = (req, res) => {
  const { name, medicalProfile, transportMode, strategy } = req.body || {};
  if (
    (name !== undefined && (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 80)) ||
    (medicalProfile !== undefined && !supportedMedicalProfiles.has(medicalProfile)) ||
    (transportMode !== undefined && !supportedTransportModes.has(transportMode)) ||
    (strategy !== undefined && !supportedStrategies.has(strategy))
  ) {
    return res.status(400).json({ status: 'error', code: 'INVALID_PROFILE', message: 'Profil tidak valid.' });
  }

  const user = updateUser(req.user.id, {
    name: name?.trim(),
    medicalProfile,
    transportMode,
    strategy
  });
  if (!user) {
    return res.status(404).json({ status: 'error', code: 'USER_NOT_FOUND', message: 'Akun tidak ditemukan.' });
  }
  return res.status(200).json({ status: 'success', data: { user: publicUser(user) } });
};