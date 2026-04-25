const request = require('supertest');
const app = require('../src/app');
const { connect, close, clear } = require('./setup');

beforeAll(async () => await connect());
afterAll(async () => await close());
afterEach(async () => await clear());

describe('Events API', () => {
  it('should fetch all approved events', async () => {
    const res = await request(app).get('/api/v1/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 404 for non-existent event', async () => {
    const res = await request(app).get('/api/v1/events/650000000000000000000001');
    expect(res.status).toBe(404);
  });
});
