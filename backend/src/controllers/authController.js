import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const users = [];

export const register = async (req, res) => {
  try {
    const { name, email, password, medical_profile } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi!' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: name || 'User AeroPath',
      email,
      password: hashedPassword,
      medical_profile: medical_profile || 'Asma / Paru-paru'
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, config.jwtSecret, { expiresIn: '1d' });

    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil!',
      data: {
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, medical_profile: newUser.medical_profile }
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Email atau password salah!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Email atau password salah!' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1d' });

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil!',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, medical_profile: user.medical_profile }
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};