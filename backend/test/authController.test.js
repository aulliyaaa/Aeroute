import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const testDirectory = mkdtempSync(join(tmpdir(), 'aeroute-auth-'));
process.env.AEROUTE_DB_PATH = join(testDirectory, 'auth.sqlite');
process.env.JWT_SECRET = 'test-only-jwt-secret';

const controller = await import('../src/controllers/authController.js');
const storage = await import('../src/services/storageService.js');

const makeResponse = () => ({
  statusCode: 0,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
});

test('registers, authenticates, and updates a persisted user profile', async () => {
  const registration = makeResponse();
  await controller.register({ body: {
    name: 'New User',
    email: 'new@example.test',
    password: 'secure-pass-123',
    medicalProfile: 'asthma'
  } }, registration);

  assert.equal(registration.statusCode, 201);
  assert.equal(registration.body.data.user.medicalProfile, 'asthma');
  assert.equal('passwordHash' in registration.body.data.user, false);

  const duplicate = makeResponse();
  await controller.register({ body: {
    name: 'New User', email: 'NEW@example.test', password: 'secure-pass-123'
  } }, duplicate);
  assert.equal(duplicate.statusCode, 409);

  const login = makeResponse();
  await controller.login({ body: { email: 'new@example.test', password: 'secure-pass-123' } }, login);
  assert.equal(login.statusCode, 200);

  const updated = makeResponse();
  controller.updateCurrentUser({
    user: { id: registration.body.data.user.id },
    body: { medicalProfile: 'sensitive', transportMode: 'mobil', strategy: 'cleanest' }
  }, updated);
  assert.equal(updated.body.data.user.medicalProfile, 'sensitive');
  assert.equal(updated.body.data.user.transportMode, 'mobil');
  assert.equal(updated.body.data.user.strategy, 'cleanest');
  assert.equal(storage.findUserById(registration.body.data.user.id).medicalProfile, 'sensitive');
});

test.after(() => {
  storage.closeStorage();
  rmSync(testDirectory, { recursive: true, force: true });
});