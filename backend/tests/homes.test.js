const app= require('../app')
const request = require('supertest');

describe('Home API', () => {
  it('should pass a placeholder test', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });
});