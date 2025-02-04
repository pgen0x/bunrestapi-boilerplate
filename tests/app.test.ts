import { describe, expect, test } from 'bun:test';
import request from 'supertest';
import { app } from '../src/app';

describe('App', () => {
  test('Health Check Endpoint', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});
