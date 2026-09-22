const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const scripts = [];
const sandbox = { exports: {}, window: {}, document: {
  querySelector: () => scripts[0] ?? null,
  createElement: () => ({}), head: { appendChild: item => scripts.push(item) },
} };
vm.runInNewContext(ts.transpile(fs.readFileSync('src/app/bng-immo-concept/clarity-tracking.ts', 'utf8'), { module: ts.ModuleKind.CommonJS }), sandbox);
const { enableBngClarity, disableBngClarity, BNG_CLARITY_URL } = sandbox.exports;
disableBngClarity();
assert.equal(scripts.length, 0);
assert.equal(sandbox.window.clarity, undefined);
enableBngClarity(); enableBngClarity();
assert.equal(scripts.length, 1);
assert.equal(scripts[0].src, BNG_CLARITY_URL);
assert.equal(scripts[0].async, true);
let queue = JSON.parse(JSON.stringify(sandbox.window.clarity.q));
assert.deepEqual(queue[0], ['consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' }]);
assert.equal(queue.filter(v => v[0] === 'set').length, 1);
disableBngClarity();
queue = JSON.parse(JSON.stringify(sandbox.window.clarity.q));
assert.deepEqual(queue.at(-2), ['consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' }]);
assert.deepEqual(queue.at(-1), ['stop']);
enableBngClarity();
assert.equal(scripts.length, 1);
assert.ok(sandbox.window.clarity.q.some(v => v[0] === 'start'));
assert.equal(sandbox.window.clarity.q.some(v => v[0] === 'identify'), false);
assert.ok(fs.readFileSync('src/app/bng-immo-concept/ProjectQualification.tsx', 'utf8').includes('data-clarity-mask="true"'));
console.log('Clarity: exact project, consent gate, single loader, revoke/stop/resume, no identity, form masking: passed.');
