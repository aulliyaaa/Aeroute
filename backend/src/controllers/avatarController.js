import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findUserById, updateUser } from '../services/storageService.js';

const controllerDirectory = dirname(fileURLToPath(import.meta.url));
const avatarDirectory = resolve(
  process.env.AEROUTE_AVATAR_PATH || resolve(controllerDirectory, '../../data/avatars')
);
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const extensionByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Format foto harus PNG, JPEG, atau WebP.'));
    }
    return callback(null, true);
  }
});

export const receiveAvatar = (req, res, next) => upload.single('avatar')(req, res, error => {
  if (!error) return next();
  const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  return res.status(status).json({
    status: 'error',
    code: error.code === 'LIMIT_FILE_SIZE' ? 'AVATAR_TOO_LARGE' : 'INVALID_AVATAR',
    message: error.message
  });
});

const hasImageSignature = (mimeType, buffer) => {
  if (mimeType === 'image/png') {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/webp') {
    return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  }
  return false;
};

export const uploadCurrentAvatar = async (req, res) => {
  if (!req.file || !hasImageSignature(req.file.mimetype, req.file.buffer)) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_AVATAR',
      message: 'File bukan gambar PNG, JPEG, atau WebP yang valid.'
    });
  }

  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: 'error', code: 'USER_NOT_FOUND', message: 'Akun tidak ditemukan.' });
  }

  const filename = `${randomUUID()}${extensionByMimeType[req.file.mimetype]}`;
  await mkdir(avatarDirectory, { recursive: true });
  await writeFile(resolve(avatarDirectory, filename), req.file.buffer, { flag: 'wx' });

  try {
    updateUser(user.id, { avatarFilename: filename });
  } catch (error) {
    await rm(resolve(avatarDirectory, filename), { force: true });
    throw error;
  }

  if (user.avatarFilename) {
    await rm(resolve(avatarDirectory, user.avatarFilename), { force: true });
  }

  return res.status(200).json({
    status: 'success',
    data: { avatarUrl: `/api/avatars/${filename}` }
  });
};

export const getAvatar = (req, res) => {
  const { filename } = req.params;
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(filename)) {
    return res.status(404).end();
  }

  const filePath = resolve(avatarDirectory, filename);
  return res.sendFile(filePath, error => {
    if (error && !res.headersSent) res.status(404).end();
  });
};