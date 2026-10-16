import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const testDirectory = mkdtempSync(join(tmpdir(), 'aeroute-avatar-'));
process.env.AEROUTE_DB_PATH = join(testDirectory, 'avatar.sqlite');
process.env.AEROUTE_AVATAR_PATH = join(testDirectory, 'avatars');

const avatarController = await import('../src/controllers/avatarController.js');
const storage = await import('../src/services/storageService.js');

const makeResponse = () => ({
  statusCode: 0,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
  end() { return this; },
  sendFile(path) { this.filePath = path; return this; }
});

test('stores a verified avatar for its account and rejects invalid image data', async () => {
  const user = storage.createUser({
    id: randomUUID(),
    name: 'Avatar Owner',
    email: 'avatar@example.test',
    passwordHash: 'not-used-in-this-test',
    medicalProfile: 'standard',
    createdAt: new Date().toISOString()
  });
  const response = makeResponse();
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  await avatarController.uploadCurrentAvatar({
    user: { id: user.id },
    file: { mimetype: 'image/png', buffer: pngSignature }
  }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body.data.avatarUrl, /^\/api\/avatars\/[0-9a-f-]{36}\.png$/);
  const updatedUser = storage.findUserById(user.id);
  assert.match(updatedUser.avatarFilename, /^[0-9a-f-]{36}\.png$/);
  assert.equal(existsSync(join(testDirectory, 'avatars', updatedUser.avatarFilename)), true);

  const invalid = makeResponse();
  await avatarController.uploadCurrentAvatar({
    user: { id: user.id },
    file: { mimetype: 'image/png', buffer: Buffer.from('not an image') }
  }, invalid);
  assert.equal(invalid.statusCode, 400);

  const unsafe = makeResponse();
  avatarController.getAvatar({ params: { filename: '../avatar.sqlite' } }, unsafe);
  assert.equal(unsafe.statusCode, 404);
});

test.after(() => {
  storage.closeStorage();
  rmSync(testDirectory, { recursive: true, force: true });
});