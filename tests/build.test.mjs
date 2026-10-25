import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

test('build output exists', () => {
  assert.ok(existsSync('dist/index.html'), 'dist/index.html is missing');
});

test('page has the app mount point', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /id="root"/);
});

test('build produced JavaScript assets', () => {
  const files = readdirSync('dist/assets');
  assert.ok(files.some((f) => f.endsWith('.js')), 'no .js files in dist/assets');
});
