import assert from 'node:assert/strict';
import test from 'node:test';

process.env.MAPBOX_ACCESS_TOKEN = '';
process.env.WAQI_API_TOKEN = '';
process.env.GEMINI_API_KEY = '';

const { processRouteAnalysis } = await import('../src/controllers/routeController.js');

const makeResponse = () => ({
  statusCode: 0,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

const validRequest = {
  origin: {
    name: 'FX Sudirman',
    coordinates: { latitude: -6.2255, longitude: 106.8041 }
  },
  destination: {
    name: 'Binus Anggrek',
    coordinates: { latitude: -6.2017, longitude: 106.7822 }
  },
  transportMode: 'motor',
  strategy: 'balance',
  medicalProfile: 'asthma'
};

test('rejects invalid route analysis requests', async () => {
  const response = makeResponse();

  await processRouteAnalysis({ body: {} }, response);

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.code, 'INVALID_ROUTE_ANALYSIS_REQUEST');
});

test('returns the typed route analysis contract with offline fallbacks', async () => {
  const response = makeResponse();

  await processRouteAnalysis({ body: validRequest }, response);

  const { data } = response.body;
  assert.equal(response.statusCode, 200);
  assert.match(data.analysisId, /^analysis_/);
  assert.equal(data.medicalProfile, 'asthma');
  assert.deepEqual(data.routes.map(route => route.id), ['route_fastest', 'route_alternative']);
  assert.equal(data.recommendedRouteId, 'route_alternative');
  assert.equal(data.dataQuality.routing.isFallback, true);
  assert.equal(data.dataQuality.airQuality.isFallback, true);
  assert.equal(data.dataQuality.insight.isFallback, true);
  assert.equal(data.routes[0].estimatedPm25InhaledUg, null);
});

test('applies pollution spike overrides only for demo analysis requests', async () => {
  const response = makeResponse();

  await processRouteAnalysis({ body: {
    ...validRequest,
    demoMode: true,
    pollutionSpike: true
  } }, response);

  assert.equal(response.body.data.routes[0].aqi, 210);
  assert.equal(response.body.data.dataQuality.airQuality.demoOverride, true);
  assert.equal(response.body.data.dataQuality.airQuality.routeAqiMethod, 'demo-override');
});