import * as thresholds from '../options/thresholds.js';
import * as scenarios from '../options/scenarios.js';

export class Config {
  // configs: array of parsed config files (each one an array of test entries)
  constructor(configs, availableScripts, scenarioOverride) {
    this.configs = configs;
    this.availableScripts = availableScripts;
    this.scenarioOverride = scenarioOverride;
    this.scenarios = {};
    this.thresholds = {};
    this.data = [];
  }

  getConfig() {
    for (const config of this.configs) {
      if (!Array.isArray(config)) {
        throw new Error('Config file must contain an array of tests');
      }
      for (const c of config) {
        Object.assign(this.scenarios, this._getScenarios(c));
        Object.assign(this.thresholds, this._getThresholds(c));
        this.data.push(
          ...String(c.data || '')
            .split(',')
            .filter(Boolean),
        );
      }
    }
    return [this.scenarios, this.thresholds, Array.from(new Set(this.data))];
  }

  _getThresholds(config) {
    return this._lookup(thresholds, config.thresholds, 'thresholds');
  }

  _getScenarios(config) {
    if (!this.availableScripts.includes(config.scriptName)) {
      throw new Error(
        `Unknown scriptName '${config.scriptName}'. Available: ${this.availableScripts.join(', ')}`,
      );
    }
    const name = this.scenarioOverride || config.scenarioName;
    const scenario = this._lookup(scenarios, name, 'scenario');
    // copy, so the shared scenario definitions are never mutated
    return {
      [config.scriptName]: { ...scenario, exec: config.scriptName },
    };
  }

  _lookup(source, name, kind) {
    if (!Object.prototype.hasOwnProperty.call(source, name)) {
      throw new Error(
        `Unknown ${kind} '${name}'. Available: ${Object.keys(source).join(', ')}`,
      );
    }
    return source[name];
  }
}
