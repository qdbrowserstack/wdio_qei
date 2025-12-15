const fs = require('fs');
const path = require('path');
require('dotenv').config();
const secrets = require('./config/secrets.json');

const failedSpecsFile = './failed-tests.json';

// Initialize the failed tests array if the file does not exist
if (!fs.existsSync(failedSpecsFile)) {
  fs.writeFileSync(failedSpecsFile, JSON.stringify([], null, 2));
}

exports.config = {
  user: secrets.BROWSERSTACK_USERNAME,
  key: secrets.BROWSERSTACK_ACCESS_KEY,
  specs: ['./test/specs/*-test.js'],
  maxInstances: 1,

  capabilities: [{
    browserName: 'chrome',
    'bstack:options': {
      os: 'Windows',
      osVersion: '11',
      projectName: 'WDIO Retry',
      buildName: `WDIO Build ${Date.now()}`,
      sessionName: `Run ${Date.now()}`
    }
  }],

  logLevel: 'info',
  framework: 'mocha',
//If need reports we can add here
  reporters: [
    'spec',
    ['junit', {
      outputDir: './reports/junit',
      outputFileFormat: () => `results_${Date.now()}.xml`
    }]
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  services: ['browserstack'],

  // Capture spec file path before each test
  before: function (capabilities, specs) {
    currentSpecFile = specs[0]; // capture spec path
  },
    
  // Track failed tests
  afterTest: function (test, context, { error, result, duration, passed, retries }) {
    if (!passed && currentSpecFile) {
      let failedSpecs = [];
      const failedFileName = path.basename(currentSpecFile); // Extract file name
      if (fs.existsSync(failedSpecsFile)) {
        failedSpecs = JSON.parse(fs.readFileSync(failedSpecsFile, 'utf8'));
      }
      if (!failedSpecs.includes(failedFileName)) {
      failedSpecs.push(failedFileName);
      fs.writeFileSync(failedSpecsFile, JSON.stringify(failedSpecs, null, 2));
      console.log(`Added failed spec: ${failedFileName}`);
      }
    }
  },
};
