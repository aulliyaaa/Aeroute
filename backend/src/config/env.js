import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || 'aeropath_secret';

if (isProduction && jwtSecret.length < 32) {
  throw new Error('JWT_SECRET wajib berisi minimal 32 karakter di production.');
}

export const config = {
  port: process.env.PORT || 5000,
  mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  waqiToken: process.env.WAQI_API_TOKEN || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  jwtSecret,
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
};