const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const failedTestsFile = 'failed-tests.json';

// Clear failed-tests.json
fs.writeFileSync(failedTestsFile, JSON.stringify([], null, 2));
console.log('Cleared failed-tests.json');


// Run the initial test cases
try {
  execSync('npx wdio run wdio.conf.js', { stdio: 'inherit' });
} catch (e) {
  console.log('Test run completed with failures.');
}