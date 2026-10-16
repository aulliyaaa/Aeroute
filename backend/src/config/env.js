import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  waqiToken: process.env.WAQI_API_TOKEN || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'aeropath_secret'
};