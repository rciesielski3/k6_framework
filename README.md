# k6_framework

[![k6 smoke](https://github.com/rciesielski3/k6_framework/actions/workflows/k6.yml/badge.svg)](https://github.com/rciesielski3/k6_framework/actions/workflows/k6.yml)

A small, config-driven structure for [k6](https://k6.io) tests: scripts, scenarios,
thresholds and test data live in separate modules, and a JSON config file picks
which combination runs. It ships with one safe example, a smoke test against the
public [QuickPizza](https://quickpizza.grafana.com) demo.

## Origin

This is my personal sandbox, built after a performance-testing training and kept
as a reminder of how to structure k6 tests. It started from the structure I was
shown there (separate scripts / scenarios / thresholds / config), and I have
changed it since. It is not a product and carries no warranty.

What I changed on top of the original structure:

- Removed `xk6-exec` and the bash config generator (and its `tree` dependency).
  Configuration now comes from plain environment variables, so stock k6 is enough.
- Fixed broken imports (leftover directory names).
- Replaced the dead crocodile API example with QuickPizza, endpoints checked
  against its [OpenAPI spec](https://github.com/grafana/quickpizza/blob/main/quickpizza-openapi.yaml)
  and live responses.
- Added a `smoke` scenario and thresholds, `handleSummary` writing `summary.json`,
  clear errors for bad config, and a manual GitHub Actions workflow.

## Target and etiquette

The only target this repo is meant for is the QuickPizza demo, with tiny load:
the smoke scenario is 2 VUs, 2 iterations each, ~20 requests, with sleeps, done in
under 30 seconds. It registers a few throwaway users on the demo. The demo is a
shared public service, so do not raise the load, and do not point this at hosts
you do not own or have permission to test. The long scenarios in
`options/scenarios.js` (`stages30m10vu`, `load30m10vu`, `iterations100`) are for
your **own environment only**.

## Quick start

Requires [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) (tested with v1.4.1). No xk6 build.

```sh
k6 run main.js                                       # all defaults
k6 run main.js -e BASE_URL=https://quickpizza.grafana.com
npm run smoke                                        # same, via npm
```

Environment variables (pass with `-e NAME=value`):

| Variable       | Default                               | Meaning                                                                           |
| -------------- | ------------------------------------- | --------------------------------------------------------------------------------- |
| `BASE_URL`     | `https://quickpizza.grafana.com`      | Target under test                                                                 |
| `CONFIG_FILES` | `configs/smokeConfig.json`            | Comma separated config files, paths relative to `main.js`                         |
| `SCENARIO`     | (unset: use `scenarioName` in config) | Override the scenario of every selected test (a name from `options/scenarios.js`) |

A missing config file, unknown script, scenario or thresholds name fails
immediately with a message listing what is available.

Smoke thresholds (`options/thresholds.js`): `http_req_failed < 1%`, `checks > 99%`,
`http_req_duration p(95) < 800ms`. They are an availability gate, not a performance
claim; with ~20 requests percentiles are coarse and one failure is already 5%.
If a threshold fails, k6 exits with code 99.

Every run writes `summary.json` (via `handleSummary`) next to where you run it.

## Writing your own test

1. Create a script in `scripts/` and export it from `scripts/index.js`.
2. Pick or add a scenario in `options/scenarios.js` and thresholds in `options/thresholds.js`.
3. Add a config file in `configs/`: an array of tests, each with
   - `scriptName`: export name from `scripts/index.js`
   - `scenarioName`: name from `options/scenarios.js`
   - `thresholds`: name from `options/thresholds.js`
   - `data`: data sets to prepare in `setup()` (see `objects/data.js`; currently `pizza`)
4. Run it: `k6 run main.js -e CONFIG_FILES=configs/myConfig.json`.

`objects/requests.js` wraps k6 http calls with tags, a `describe` group and
[k6chaijs](https://jslib.k6.io/k6chaijs/) checks on status and JSON body;
`objects/quickpizza.js` is an example client built on it.

## Run in CI (manual)

The workflow `.github/workflows/k6.yml` runs only on demand, with no schedule and
no push/PR triggers: Actions tab, "k6 smoke", "Run workflow" (optionally change the
target URL). It runs eslint, then the smoke test using `grafana/setup-k6-action` and
`grafana/run-k6-action`, and uploads `summary.json` as the `k6-summary` artifact.
Or from the CLI: `gh workflow run k6.yml` then `gh run watch`.

## Lint

```sh
npm ci
npm run eslint
```
