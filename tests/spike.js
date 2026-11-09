// Spike test: a sudden burst of arrivals, measured as a fixed request rate rather than a user count.
import { defaultThresholds } from '../lib/config.js';
import { getRecommendation } from '../lib/pizza-api.js';

const PEAK_RPS = Number(__ENV.PEAK_RPS || 30);

export const options = {
  scenarios: {
    traffic_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 2,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 100,
      stages: [
        { duration: '30s', target: 2 },
        { duration: '10s', target: PEAK_RPS }, // spike
        { duration: '1m', target: PEAK_RPS },
        { duration: '10s', target: 2 }, // recovery
        { duration: '30s', target: 2 },
      ],
    },
  },
  thresholds: {
    ...defaultThresholds,
    // Allow a looser tail during the spike, but errors must stay low.
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  getRecommendation();
}
