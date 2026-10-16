import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const testDirectory = mkdtempSync(join(tmpdir(), 'aeroute-data-'));
process.env.AEROUTE_DB_PATH = join(testDirectory, 'data.sqlite');
process.env.WAQI_API_TOKEN = '';
process.env.MAPBOX_ACCESS_TOKEN = '';

const environment = await import('../src/controllers/environmentController.js');
const trips = await import('../src/controllers/tripController.js');
const storage = await import('../src/services/storageService.js');

const makeResponse = () => ({
  statusCode: 0,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
});

test('returns environment source and validates coordinates', async () => {
  const valid = makeResponse();
  await environment.getEnvironment({ query: { latitude: '-6.2', longitude: '106.8' } }, valid);
  assert.equal(valid.statusCode, 200);
  assert.equal(valid.body.data.isFallback, true);
  assert.equal(valid.body.data.temperatureC, null);

  const invalid = makeResponse();
  await environment.getEnvironment({ query: { latitude: '500', longitude: '106.8' } }, invalid);
  assert.equal(invalid.statusCode, 400);
  assert.equal(invalid.body.code, 'INVALID_COORDINATES');
});

test('validates location queries and reports a missing Mapbox service', async () => {
  const invalid = makeResponse();
  await environment.findLocations({ query: { q: 'ab' } }, invalid);
  assert.equal(invalid.statusCode, 400);

  const unavailable = makeResponse();
  await environment.findLocations({ query: { q: 'Jakarta' } }, unavailable);
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.body.code, 'LOCATION_SEARCH_UNAVAILABLE');
});

test('stores and lists trips only under the authenticated user id', () => {
  const user = storage.createUser({
    id: randomUUID(),
    name: 'Trip Owner',
    email: 'trip-owner@example.test',
    passwordHash: 'not-used-in-this-test',
    medicalProfile: 'standard',
    createdAt: new Date().toISOString()
  });
  const now = new Date().toISOString();
  const saved = makeResponse();

  trips.saveUserTrip({ user: { id: user.id }, body: {
    origin: { name: 'Start', coordinates: { latitude: -6.2, longitude: 106.8 } },
    destination: { name: 'End', coordinates: { latitude: -6.21, longitude: 106.79 } },
    routeId: 'route_fastest',
    durationMinutes: 22,
    distanceKm: 6.1,
    aqi: 72,
    startedAt: now,
    completedAt: now
  } }, saved);

  assert.equal(saved.statusCode, 201);
  const listed = makeResponse();
  trips.listUserTrips({ user: { id: user.id } }, listed);
  assert.equal(listed.body.data.trips.length, 1);
  assert.equal(listed.body.data.trips[0].id, saved.body.data.trip.id);
});

test.after(() => {
  storage.closeStorage();
  rmSync(testDirectory, { recursive: true, force: true });
});