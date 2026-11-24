import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { Config } from './objects/config.js';
import { Data } from './objects/data.js';
import * as scripts from './scripts/index.js';

export * from './scripts/index.js';

// Configuration comes from environment variables (pass with `k6 run -e NAME=value`):
//   BASE_URL      target under test (default: the QuickPizza demo)
//   CONFIG_FILES  comma separated config files, relative to this file
//                 (default: configs/smokeConfig.json)
//   SCENARIO      optional, overrides scenarioName of every selected test
const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';
const CONFIG_FILES = (__ENV.CONFIG_FILES || 'configs/smokeConfig.json')
  .split(',')
  .map((file) => file.trim())
  .filter((file) => file !== '');

function loadConfigFile(file) {
  let content;
  try {
    content = open(file);
  } catch (e) {
    throw new Error(
      `Cannot read config file '${file}' (CONFIG_FILES paths are relative to main.js): ${e.message}`,
    );
  }
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Config file '${file}' is not valid JSON: ${e.message}`);
  }
}

const config = new Config(
  CONFIG_FILES.map(loadConfigFile),
  Object.keys(scripts),
  __ENV.SCENARIO,
);
const [scenarios, thresholds, data] = config.getConfig();

export const options = {
  scenarios: scenarios,
  thresholds: thresholds,
};

export function setup() {
  console.info(`Executing setup, target: ${BASE_URL}`);
  return { baseUrl: BASE_URL, ...new Data(data).getData() };
}

export function handleSummary(summary) {
  return {
    stdout: textSummary(summary, { indent: ' ', enableColors: false }),
    'summary.json': JSON.stringify(summary, null, 2),
  };
}
