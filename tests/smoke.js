// Smoke test: 1 user, 1 minute. Proves the scripts and the system work before heavier runs.
import { sleep } from 'k6';
import { defaultThresholds } from '../lib/config.js';
import { getRecommendation, openHomePage } from '../lib/pizza-api.js';

export const options = {
  vus: 1,
  duration: '1m',
  thresholds: defaultThresholds,
};

export default function () {
  openHomePage();
  getRecommendation();
  sleep(1);
}
