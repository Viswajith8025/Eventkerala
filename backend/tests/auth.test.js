const request = require('supertest');
const app = require('../src/app');
const { connect, close, clear } = require('./setup');

beforeAll(async () => await connect());
afterAll(async () => await close());
afterEach(async () => await clear());

describe('Authentication API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should not register user with existing email', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'User 1',
        email: 'duplicate@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'User 2',
        email: 'duplicate@example.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(400);
  });

  it('should login an existing user', async () => {
    const userData = {
      name: 'Login Test',
      email: 'login@example.com',
      password: 'password123'
    };

    // Register first
    await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    // Then login
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
