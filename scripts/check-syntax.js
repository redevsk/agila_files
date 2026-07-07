const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath.endsWith('.js') ? [fullPath] : [];
  });
}

const files = walk(path.join(__dirname, '..', 'src'));
const failures = files.filter((file) => {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  return result.status !== 0;
});

if (failures.length > 0) {
  process.exit(1);
}

console.log(`Syntax OK (${files.length} files)`);
