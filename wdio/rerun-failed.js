const fs = require('fs');
const { execSync } = require('child_process');
const failedSpecsFile = './failed-tests.json';

if (!fs.existsSync(failedSpecsFile)) {
  console.log('No failed specs to rerun.');
  process.exit(0);
}

const specs = JSON.parse(fs.readFileSync(failedSpecsFile, 'utf-8'));
if (!specs.length) {
  console.log('✅ No failed specs found.');
  process.exit(0);
}

for (const spec of specs) {
  console.log(`🔁 Rerunning failed spec: ${spec}`);
  try {
    execSync(`npx wdio run wdio.conf.js --spec ${spec}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Spec failed again: ${spec}`);
    // We let it fail, but continue running the rest
  }
}

// ❌ Do not clear failed-tests.json here
