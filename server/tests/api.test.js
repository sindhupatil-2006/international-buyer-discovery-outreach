const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const { initDb } = require('../src/config/database');

let server;
let baseUrl;
let authToken = '';

test.before(async () => {
  await initDb();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    server.close();
  }
});

test('GET /api/health should return ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const data = await res.json();

  assert.equal(res.status, 200);
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'International Buyer Discovery & Outreach API');
});

test('POST /api/auth/register should create a user', async () => {
  const testUser = {
    name: 'Test Exporter',
    email: `test_${Date.now()}@exporter.com`,
    password: 'password123',
    companyName: 'Global Exporters LLC'
  };

  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });

  const data = await res.json();
  assert.equal(res.status, 201);
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.equal(data.user.email, testUser.email);

  authToken = data.token;
});

test('POST /api/auth/login should authenticate user', async () => {
  const loginUser = {
    email: 'test_demo_user@exporter.com',
    password: 'password123'
  };

  // Register user first
  await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Demo Exporter',
      email: loginUser.email,
      password: loginUser.password,
      companyName: 'Demo Exporters Inc'
    })
  });

  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginUser)
  });

  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(data.token);
});

test('POST /api/buyers/search should discover buyers in demo or API mode', async () => {
  const res = await fetch(`${baseUrl}/api/buyers/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      niche: 'home decor wholesale distributors',
      country: 'United States',
      limit: 5
    })
  });

  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.buyers));
  assert.ok(data.buyers.length > 0);
  assert.ok(data.buyers[0].companyName);
  assert.ok(data.buyers[0].email);
});

test('POST /api/outreach/send should process email send in demo mode', async () => {
  const res = await fetch(`${baseUrl}/api/outreach/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      recipientEmail: 'buyer@example.com',
      companyName: 'Acme Buyers LLC',
      subject: 'Wholesale Trade Proposal for {{company}}',
      body: 'Dear Purchasing Team at {{company}}, we would like to offer factory direct supply.'
    })
  });

  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(data.outreachId);
});

test('GET /api/dashboard/stats should return aggregate dashboard metrics', async () => {
  const res = await fetch(`${baseUrl}/api/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(data.stats);
  assert.equal(typeof data.stats.totalBuyers, 'number');
  assert.equal(typeof data.stats.totalOutreach, 'number');
});
