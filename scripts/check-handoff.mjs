import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]); }
const sourceFiles = walk('src').filter(file => /\.(tsx?|css)$/.test(file));
let checked = 0;
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  assert.ok(!/@\/lib\/(supabase|posthog)|fame-prod\.com|51\.255\.165\.115|orzlfzxbpoalohcvcdux/.test(source), `Internal dependency in ${file}`);
  for (const match of source.matchAll(/["'`(](\/(?:m-resort-concept|bng-2026|bng-projects)\/[^"'`\s)]+\.(?:jpg|jpeg|png|webp|svg|mp4|woff2))/g)) {
    if (match[1].includes('${')) continue;
    assert.ok(fs.existsSync('public' + match[1]), `Missing asset ${match[1]} in ${file}`);
    checked++;
  }
}
const manifest = JSON.parse(fs.readFileSync('docs/media-manifest.json', 'utf8'));
for (const asset of manifest) assert.equal(fs.statSync('public' + asset.local).size, asset.bytes);
for (const file of walk('public')) assert.ok(fs.statSync(file).size < 100 * 1024 * 1024, `GitHub large-file limit: ${file}`);
assert.ok(!fs.existsSync('.env.local'));
assert.ok(!fs.existsSync('.env'));
console.log(`Handoff: ${sourceFiles.length} source files, ${checked} local references, ${manifest.length} bundled official images checked.`);
