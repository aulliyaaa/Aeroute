# Aeroute

## Local setup

Requirements: Node.js 22.13 or newer (the backend uses Node's built-in SQLite module).

1. Install dependencies in `backend` and `frontend` with `npm install`.
2. Copy `backend/.env.example` to `backend/.env`. Mapbox and WAQI tokens enable routing, geocoding, and live air-quality data. Gemini is optional; the backend returns a clearly marked fallback when it is unavailable.
3. Copy `frontend/.env.example` to `frontend/.env.local` if the API is not at `http://localhost:5000/api`.
4. Start `npm run dev` in `backend`, then `npm run dev` in `frontend`.

Accounts and completed trips are stored in `backend/data/aeroute.sqlite`; passwords are hashed. The file is ignored by Git. Demo trips stay in browser memory and are not persisted to an account.

## Production notes

Set `JWT_SECRET` to a random value of at least 32 characters and set `CORS_ORIGINS` to the deployed frontend origin. SQLite is intended for a single backend instance with persistent local storage; use a managed database before deploying multiple instances or serverless workers.

Route AQI is currently estimated from air-quality data at the origin. Per-segment pollution measurements and inhaled PM2.5 dose are not yet provided by the data services.