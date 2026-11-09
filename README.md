# k6 Performance Testing

![k6 Performance Tests](https://github.com/AliHamzaGilani/k6-performance-testing/actions/workflows/k6.yml/badge.svg)

Performance and API test suite for [QuickPizza](https://quickpizza.grafana.com), Grafana's public demo app, built with **[k6](https://k6.io)**.

Every request also runs **functional checks**: status codes, response content and business rules like topping limits and vegetarian options. The same scripts therefore serve as API tests and load tests.

## Highlights

- **Three test types**: smoke, load (`ramping-vus`) and spike (`ramping-arrival-rate`)
- **SLO thresholds** fail the run automatically: error rate, p95/p99 latency, check pass rate
- **Per-endpoint thresholds** using request tags
- Shared request layer (`lib/pizza-api.js`) and config (`lib/config.js`)
- Randomized payloads and think time for realistic traffic
- Settings via environment variables (`BASE_URL`, `TARGET_VUS`, `PEAK_RPS`)
- **GitHub Actions**: smoke on every push and PR, load test nightly, any test on demand

## Project structure

```
lib/
  config.js       base URL, auth header, shared thresholds
  pizza-api.js    requests + checks
tests/
  smoke.js        1 VU, 1 minute
  load.js         ramp to 20 VUs, hold 3 minutes
  spike.js        2 -> 30 requests/second burst
```

## Run it

Install k6 ([instructions](https://grafana.com/docs/k6/latest/set-up/install-k6/)), then:

```bash
k6 run tests/smoke.js
k6 run -e TARGET_VUS=50 tests/load.js
k6 run -e PEAK_RPS=60 tests/spike.js
k6 run tests/load.js --summary-export=results/summary.json
```

Please keep load on the public demo modest. Point `BASE_URL` at your own environment for heavier runs.

## Thresholds

| Metric | Smoke / load | Spike |
| --- | --- | --- |
| Error rate | < 1% | < 5% |
| p95 latency | < 800 ms | < 2000 ms |
| p99 latency | < 1500 ms | n/a |
| Checks passing | > 99% | > 99% |
