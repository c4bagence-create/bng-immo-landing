const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/app/bng-immo-concept/meta-pixel.ts', 'utf8');
const code = ts.transpile(source, { module: ts.ModuleKind.CommonJS });
const scripts = [];
const sandbox = {
  exports: {},
  window: {},
  document: {
    querySelector: () => scripts[0] ?? null,
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  },
};
vm.runInNewContext(code, sandbox);
const { enableBngPixel, disableBngPixel, trackBngEvent, BNG_PIXEL_ID, META_SCRIPT_URL } = sandbox.exports;

disableBngPixel();
assert.equal(trackBngEvent('form_started'), false, 'No events before consent');
assert.equal(scripts.length, 0, 'No script before consent');
assert.equal(sandbox.window.fbq, undefined, 'No tracking function before consent');
enableBngPixel();
enableBngPixel(); // React effect replay or duplicate mount.
assert.equal(scripts.length, 1, 'One script only');
assert.equal(scripts[0].src, META_SCRIPT_URL);
assert.equal(scripts[0].async, true);
let queue = JSON.parse(JSON.stringify(sandbox.window.fbq.queue));
assert.equal(queue.filter(c => c[0] === 'init').length, 1, 'One init');
assert.equal(queue.filter(c => c[0] === 'trackSingle').length, 1, 'One PageView per document');
assert.deepEqual(queue.find(c => c[0] === 'trackSingle'), ['trackSingle', BNG_PIXEL_ID, 'PageView']);
assert.deepEqual(queue.find(c => c[0] === 'set'), ['set', 'autoConfig', false, BNG_PIXEL_ID]);
disableBngPixel();
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.fbq.queue.at(-1))), ['consent', 'revoke']);
enableBngPixel();
queue = JSON.parse(JSON.stringify(sandbox.window.fbq.queue));
assert.equal(queue.filter(c => c[0] === 'trackSingle').length, 1, 'Re-consent does not duplicate the visit');
assert.equal(queue.some(c => c.includes('Lead')), false, 'No conversion without a real submission');
assert.equal(queue.some(c => c.some(v => typeof v === 'object')), false, 'No custom payload or matching data');
assert.equal(trackBngEvent('project_selected', { project_id: 'jardin-alma', firstname: 'TEST', phone: 'SECRET', budget: 'SECRET' }, 'alma'), true);
assert.equal(trackBngEvent('project_selected', { project_id: 'jardin-alma' }, 'alma'), false, 'Dedup per project');
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.fbq.queue.at(-1))), ['trackSingleCustom', BNG_PIXEL_ID, 'project_selected', { project_id: 'jardin-alma' }]);
assert.equal(trackBngEvent('Lead'), false, 'Lead is not allowed without backend delivery');
trackBngEvent('form_field_interacted', { field: 'phone', project_id: 'arbitrary', seconds: Infinity, section: 'unsafe', phone: 'SECRET' }, 'phone');
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.fbq.queue.at(-1))), ['trackSingleCustom', BNG_PIXEL_ID, 'form_field_interacted', { field: 'phone' }]);
disableBngPixel();
const lengthBefore = sandbox.window.fbq.queue.length;
assert.equal(trackBngEvent('whatsapp_clicked'), false, 'Revoked consent blocks all events');
assert.equal(sandbox.window.fbq.queue.length, lengthBefore);
assert.equal(trackBngEvent('form_started', {}, 'start'), false);
enableBngPixel();
assert.equal(trackBngEvent('form_started', {}, 'start'), true, 'Rejected events are not replayed or marked as sent');
console.log('Meta pixel: consent gate, loader, init, PageView deduplication, revoke and payload checks passed.');

// Exercise the DOM observer contract without contacting Meta or capturing real users.
const events = [];
const handlers = new Map();
const timers = new Map();
let observerCallback, cleanup, tick;
let timerId = 0;
const root = { dataset: { selectedProject: 'jardin-alma' },
  addEventListener: (name, callback) => handlers.set(name, callback),
  removeEventListener: name => handlers.delete(name),
  querySelectorAll: () => [], contains: () => true };
const behaviorSandbox = {
  exports: {},
  require: name => name === 'react' ? { useEffect: f => { cleanup = f(); } } : { trackBngEvent: (...args) => events.push(args) },
  document: { hidden: false, querySelector: () => root, documentElement: { scrollHeight: 2000 } },
  innerHeight: 1000, scrollY: 500,
  IntersectionObserver: class { constructor(callback) { observerCallback = callback; } observe() {} disconnect() {} },
  setTimeout: callback => { const id = ++timerId; timers.set(id, callback); return id; },
  clearTimeout: id => timers.delete(id),
  setInterval: callback => { tick = callback; return 1; }, clearInterval: () => {},
};
vm.runInNewContext(ts.transpile(fs.readFileSync('src/app/bng-immo-concept/BehaviorTracking.tsx', 'utf8'), { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }), behaviorSandbox);
behaviorSandbox.exports.default();
const section = { id: 'paiement', getAttribute: () => null };
observerCallback([{ target: section, isIntersecting: true, intersectionRatio: 0.1 }]);
assert.equal(timers.size, 0, 'Less than 25% visible does not count');
observerCallback([{ target: section, isIntersecting: true, intersectionRatio: 0.5 }]);
assert.equal(timers.size, 1);
for (const callback of [...timers.values()]) callback();
assert.equal(events[0][0], 'section_viewed');
behaviorSandbox.document.hidden = true;
for (let i = 0; i < 30; i++) tick();
assert.equal(events.some(e => e[0] === 'engaged_visit'), false, 'Hidden time is excluded');
behaviorSandbox.document.hidden = false;
for (let i = 0; i < 30; i++) tick();
assert.equal(events.filter(e => e[0] === 'engaged_visit').length, 1);
cleanup();
assert.equal(handlers.size, 0, 'Listeners are removed on withdrawal/unmount');
console.log('Behavior observer: visibility threshold, hidden-tab exclusion, engagement and cleanup passed.');
