import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const packageDir = path.resolve(process.cwd(), 'node_modules', 'ts-tiled-converter');
const packageJsonPath = path.join(packageDir, 'package.json');
const distEntry = path.join(packageDir, 'dist', 'index.js');

if (!fs.existsSync(packageDir) || !fs.existsSync(packageJsonPath)) {
  console.log('[postinstall] ts-tiled-converter not found, skipping.');
  process.exit(0);
}

if (fs.existsSync(distEntry)) {
  console.log('[postinstall] ts-tiled-converter dist already present, skipping build.');
  process.exit(0);
}

console.log('[postinstall] ts-tiled-converter dist missing, running local build...');

const result = spawnSync('npx', ['tsc', '-p', 'tsconfig.json', '--skipLibCheck', '--lib', 'ES2021,DOM'], {
  cwd: packageDir,
  shell: true,
  stdio: 'inherit',
});

if (result.status !== 0) {
  console.error('[postinstall] ts-tiled-converter build failed.');
  process.exit(result.status ?? 1);
}

if (!fs.existsSync(distEntry)) {
  console.error('[postinstall] build ended but dist/index.js is still missing.');
  process.exit(1);
}

console.log('[postinstall] ts-tiled-converter build completed successfully.');
