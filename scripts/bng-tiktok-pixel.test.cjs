const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/app/bng-immo-concept/tiktok-pixel.ts', 'utf8');
const code = ts.transpile(source, { module: ts.ModuleKind.CommonJS });
const scripts = [];
const sandbox = {
  exports: {},
  window: {},
  document: {
    querySelector: selector => scripts.find(script => selector.includes('analytics.tiktok.com') && script.src?.startsWith('https://analytics.tiktok.com')) ?? null,
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  },
  encodeURIComponent,
};
vm.runInNewContext(code, sandbox);
const { enableBngTikTokPixel, disableBngTikTokPixel, trackBngTikTokEvent, BNG_TIKTOK_PIXEL_ID, TIKTOK_SCRIPT_URL } = sandbox.exports;

disableBngTikTokPixel();
assert.equal(scripts.length, 0, 'No TikTok script before consent');
assert.equal(trackBngTikTokEvent('form_started', {}), false, 'No TikTok event before consent');
enableBngTikTokPixel();
enableBngTikTokPixel();
assert.equal(scripts.length, 1, 'TikTok loader is appended once');
assert.equal(scripts[0].async, true);
assert.equal(scripts[0].src, `${TIKTOK_SCRIPT_URL}?sdkid=${BNG_TIKTOK_PIXEL_ID}&lib=ttq`);
let queue = JSON.parse(JSON.stringify(sandbox.window.ttq));
assert.equal(queue.filter(call => call[0] === 'page').length, 1, 'One PageView per document');
assert.equal(queue.filter(call => call[0] === 'grantConsent').length, 2, 'Consent can be reaffirmed without another page view');
assert.equal(trackBngTikTokEvent('project_selected', { project_id: 'jardin-alma' }), true);
queue = JSON.parse(JSON.stringify(sandbox.window.ttq));
assert.deepEqual(queue.at(-1), ['track', 'project_selected', { project_id: 'jardin-alma' }]);
disableBngTikTokPixel();
queue = JSON.parse(JSON.stringify(sandbox.window.ttq));
assert.deepEqual(queue.slice(-2), [['disableCookie'], ['revokeConsent']]);
const lengthBefore = queue.length;
assert.equal(trackBngTikTokEvent('form_started', {}), false);
assert.equal(sandbox.window.ttq.length, lengthBefore, 'No event after consent withdrawal');
enableBngTikTokPixel();
queue = JSON.parse(JSON.stringify(sandbox.window.ttq));
assert.equal(queue.filter(call => call[0] === 'page').length, 1, 'Re-consent does not duplicate PageView');
assert.equal(queue.some(call => call.includes('SubmitForm') || call.includes('Contact')), false, 'No lead event without CRM success');
console.log('TikTok pixel: consent gate, loader, PageView deduplication, custom event and revoke checks passed.');
