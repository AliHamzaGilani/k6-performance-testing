// Shared settings for every test. Override with: k6 run -e BASE_URL=... -e API_TOKEN=...
export const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

// QuickPizza accepts this public demo token for anonymous pizza recommendations.
export const API_TOKEN = __ENV.API_TOKEN || 'abcdef0123456789';

export const jsonHeaders = {
  'Content-Type': 'application/json',
  Authorization: `token ${API_TOKEN}`,
};

/** Service-level objectives shared by all tests. A breached threshold fails the run (non-zero exit). */
export const defaultThresholds = {
  http_req_failed: ['rate<0.01'], // under 1% errors
  http_req_duration: ['p(95)<800', 'p(99)<1500'], // ms
  checks: ['rate>0.99'],
};
