// One-time handoff: bundle official BNG images; no third-party gallery scraping.
import fs from 'node:fs/promises';
import path from 'node:path';
const prefix = 'https://bngimmo.com/images/projets/';
const files = ['src/app/bng-immo-concept/projects.ts', 'src/app/jardin-alma-concept/project-data.ts', 'src/app/m-resort-concept/MResortConcept.tsx'];
const sources = await Promise.all(files.map(file => fs.readFile(file, 'utf8')));
const paths = new Set();
for (const source of sources) {
  for (const match of source.matchAll(/https:\/\/bngimmo\.com\/images\/projets\/([^"`\s]+)/g)) if (!match[1].includes('${')) paths.add(match[1]);
  for (const match of source.matchAll(/photo\("([^"]+)"/g)) paths.add(match[1]);
}
const manifest = [];
for (const asset of paths) {
  if (asset.includes('..')) throw new Error('Unsafe asset path');
  const target = path.join('public/bng-projects', asset);
  const response = await fetch(prefix + asset);
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Asset failed: ${asset} (${response.status})`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(target, bytes);
  manifest.push({ source: prefix + asset, local: '/' + target.replace(/^public\//, ''), bytes: bytes.length });
}
// Mechanical replacement only after every download succeeded.
for (let i = 0; i < files.length; i++) await fs.writeFile(files[i], sources[i].replaceAll(prefix, '/bng-projects/'));
await fs.writeFile('docs/media-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Bundled ${manifest.length} official images.`);
