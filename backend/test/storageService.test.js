import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const testDirectory = mkdtempSync(join(tmpdir(), 'aeroute-storage-'));
process.env.AEROUTE_DB_PATH = join(testDirectory, 'test.sqlite');

const storage = await import('../src/services/storageService.js');

test('persists users and trips in SQLite', () => {
  const now = new Date().toISOString();
  const user = storage.createUser({
    id: randomUUID(),
    name: 'Aero Test',
    email: 'AERO@example.test',
    passwordHash: 'hashed-password',
    medicalProfile: 'asthma',
    createdAt: now
  });

  assert.equal(storage.findUserByEmail('aero@EXAMPLE.test').id, user.id);
  assert.equal(storage.updateUser(user.id, {
    name: 'Updated User',
    medicalProfile: 'sensitive'
  }).medicalProfile, 'sensitive');

  const trip = storage.createTrip({
    id: randomUUID(),
    userId: user.id,
    analysisId: 'analysis_test',
    origin: { name: 'Origin', coordinates: { latitude: -6.2, longitude: 106.8 } },
    destination: { name: 'Destination', coordinates: { latitude: -6.21, longitude: 106.79 } },
    routeId: 'route_fastest',
    durationMinutes: 24,
    distanceKm: 6.2,
    aqi: 42,
    pm25UgM3: 12,
    exposureReductionPercent: 18,
    startedAt: now,
    completedAt: now,
    createdAt: now
  });

  assert.equal(storage.listTripsForUser(user.id)[0].id, trip.id);
  assert.deepEqual(trip.origin.coordinates, { latitude: -6.2, longitude: 106.8 });
});

test.after(() => {
  storage.closeStorage();
  rmSync(testDirectory, { recursive: true, force: true });
});