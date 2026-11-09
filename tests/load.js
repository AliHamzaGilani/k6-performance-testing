// Load test: ramps to typical traffic, holds it, then ramps down.
// Per-endpoint thresholds let one slow endpoint fail the run on its own.
import { sleep } from 'k6';
import { defaultThresholds } from '../lib/config.js';
import { getRecommendation, openHomePage } from '../lib/pizza-api.js';

const TARGET_VUS = Number(__ENV.TARGET_VUS || 20);

export const options = {
  scenarios: {
    browsing_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: TARGET_VUS },
        { duration: '3m', target: TARGET_VUS },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    ...defaultThresholds,
    'http_req_duration{name:POST /api/pizza}': ['p(95)<1000'],
    'http_req_duration{name:GET /}': ['p(95)<500'],
  },
};

export default function () {
  openHomePage();
  sleep(Math.random() * 2 + 1); // think time: 1-3 s
  getRecommendation();
  sleep(Math.random() * 2 + 1);
}
