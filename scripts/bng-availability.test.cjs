const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', code)(module.exports, module);
  return module.exports;
}
const { ALMA_LOTS, ALMA_STOCK_CHECKED, ALMA_AVAILABLE_COUNT } = load('src/app/bng-immo-concept/alma-availability.ts');
assert.equal(ALMA_AVAILABLE_COUNT, 7);
const { PROJECTS } = load('src/app/bng-immo-concept/projects.ts');
assert.equal(PROJECTS.at(-1).id, 'plaza-view');
assert.equal(PROJECTS.at(-1).name, 'El Messaoudi Home');
assert.equal(PROJECTS.at(-1).delivered, true);
assert.equal(PROJECTS.at(-1).soldOut, true);
assert.equal(PROJECTS.at(-1).photos.length, 9);
for (const photo of PROJECTS.at(-1).photos) assert.ok(fs.existsSync('public' + photo.src));
assert.equal(ALMA_LOTS.length, 11);
assert.equal(new Set(ALMA_LOTS.map(lot => lot.id)).size, 11);
assert.deepEqual(ALMA_LOTS.map(lot => lot.id), ['V01','V07','V28','V55','V56','V57','V60','V71','V72','V74','V75']);
assert.ok(ALMA_LOTS.every(lot => lot.surface === 179 && lot.price > 0));
assert.equal(ALMA_STOCK_CHECKED, '2026-09-21');
assert.equal(PROJECTS.find(p => p.id === 'jardin-alma').price, Math.min(...ALMA_LOTS.map(lot => lot.price)));
for (const lot of ALMA_LOTS) {
  const paid = PROJECTS.find(p => p.id === 'jardin-alma').payments.reduce((sum, step) => sum + lot.price * step.percent / 100, 0);
  assert.equal(paid, lot.price);
}
console.log('Alma inventory: source snapshot validated; current displayed availability is 7 lots.');
