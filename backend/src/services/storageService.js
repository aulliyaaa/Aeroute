import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serviceDirectory = dirname(fileURLToPath(import.meta.url));
const databasePath = resolve(
  process.env.AEROUTE_DB_PATH || resolve(serviceDirectory, '../../data/aeroute.sqlite')
);

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    medical_profile TEXT NOT NULL,
    transport_mode TEXT NOT NULL DEFAULT 'motor',
    strategy TEXT NOT NULL DEFAULT 'balance',
    avatar_filename TEXT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_id TEXT,
    origin_json TEXT NOT NULL,
    destination_json TEXT NOT NULL,
    route_id TEXT NOT NULL,
    duration_minutes REAL NOT NULL,
    distance_km REAL NOT NULL,
    aqi REAL NOT NULL,
    pm25_ug_m3 REAL,
    exposure_reduction_percent REAL,
    started_at TEXT NOT NULL,
    completed_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS trips_user_completed_idx ON trips(user_id, completed_at DESC);
`);

const userColumns = new Set(database.prepare('PRAGMA table_info(users)').all().map(column => column.name));
if (!userColumns.has('transport_mode')) {
  database.exec("ALTER TABLE users ADD COLUMN transport_mode TEXT NOT NULL DEFAULT 'motor'");
}
if (!userColumns.has('strategy')) {
  database.exec("ALTER TABLE users ADD COLUMN strategy TEXT NOT NULL DEFAULT 'balance'");
}
if (!userColumns.has('avatar_filename')) {
  database.exec('ALTER TABLE users ADD COLUMN avatar_filename TEXT');
}

const toUser = row => row && ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  medicalProfile: row.medical_profile,
  transportMode: row.transport_mode,
  strategy: row.strategy,
  avatarFilename: row.avatar_filename,
  createdAt: row.created_at
});

const toTrip = row => row && ({
  id: row.id,
  analysisId: row.analysis_id,
  origin: JSON.parse(row.origin_json),
  destination: JSON.parse(row.destination_json),
  routeId: row.route_id,
  durationMinutes: row.duration_minutes,
  distanceKm: row.distance_km,
  aqi: row.aqi,
  pm25UgM3: row.pm25_ug_m3,
  exposureReductionPercent: row.exposure_reduction_percent,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  createdAt: row.created_at
});

export const findUserByEmail = email => toUser(
  database.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase())
);

export const findUserById = id => toUser(
  database.prepare('SELECT * FROM users WHERE id = ?').get(id)
);

export const createUser = user => {
  database.prepare(`
    INSERT INTO users (
      id, name, email, password_hash, medical_profile, transport_mode, strategy, avatar_filename, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    user.id,
    user.name,
    user.email.trim().toLowerCase(),
    user.passwordHash,
    user.medicalProfile,
    user.transportMode || 'motor',
    user.strategy || 'balance',
    user.avatarFilename || null,
    user.createdAt
  );
  return findUserById(user.id);
};

export const updateUser = (id, updates) => {
  const user = findUserById(id);
  if (!user) return null;

  database.prepare(`
    UPDATE users
    SET name = ?, medical_profile = ?, transport_mode = ?, strategy = ?, avatar_filename = ?
    WHERE id = ?
  `).run(
    updates.name ?? user.name,
    updates.medicalProfile ?? user.medicalProfile,
    updates.transportMode ?? user.transportMode,
    updates.strategy ?? user.strategy,
    updates.avatarFilename ?? user.avatarFilename ?? null,
    id
  );
  return findUserById(id);
};

export const createTrip = trip => {
  database.prepare(`
    INSERT INTO trips (
      id, user_id, analysis_id, origin_json, destination_json, route_id,
      duration_minutes, distance_km, aqi, pm25_ug_m3,
      exposure_reduction_percent, started_at, completed_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    trip.id,
    trip.userId,
    trip.analysisId || null,
    JSON.stringify(trip.origin),
    JSON.stringify(trip.destination),
    trip.routeId,
    trip.durationMinutes,
    trip.distanceKm,
    trip.aqi,
    trip.pm25UgM3 ?? null,
    trip.exposureReductionPercent ?? null,
    trip.startedAt,
    trip.completedAt,
    trip.createdAt
  );
  return toTrip(database.prepare('SELECT * FROM trips WHERE id = ?').get(trip.id));
};

export const listTripsForUser = (userId, limit = 50) => database.prepare(`
  SELECT * FROM trips WHERE user_id = ? ORDER BY completed_at DESC LIMIT ?
`).all(userId, Math.max(1, Math.min(100, limit))).map(toTrip);

export const closeStorage = () => database.close();