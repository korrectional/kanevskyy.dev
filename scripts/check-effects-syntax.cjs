/**
 * check-effects-syntax.js
 * Validates all canvas gallery effect files for correct syntax.
 *
 * Usage: node scripts/check-effects-syntax.js
 *
 * Reports per-file pass/fail, brace/paren balance, and a summary.
 */

const fs = require('fs');
const path = require('path');

const effectsDir = path.join(__dirname, '..', 'tools', 'canvas-gallery', 'effects');

const files = fs.readdirSync(effectsDir).filter(f => f.endsWith('.js'));

let passed = 0, failed = 0, details = [];

for (const file of files.sort()) {
  const fullPath = path.join(effectsDir, file);
  const code = fs.readFileSync(fullPath, 'utf8');
  const issues = [];

  // 1. Node syntax check via Function constructor + stub register
  let syntaxOk = true;
  try {
    Function('register', code)(function(){});
  } catch (e) {
    syntaxOk = false;
    issues.push('SYNTAX: ' + e.message.split('\n')[0].substring(0, 80));
  }

  // 2. Brace balance
  let ob = 0, cb = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') ob++;
    if (code[i] === '}') cb++;
  }
  if (ob !== cb) issues.push(`BRACE: {=${ob} }=${cb} (diff ${ob - cb})`);

  // 3. Paren balance (suppress if syntax check passed — can false-positive on regex/string literals)
  let op = 0, cp = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '(') op++;
    if (code[i] === ')') cp++;
  }
  if (op !== cp && !syntaxOk) issues.push(`PAREN: (=${op} )=${cp} (diff ${op - cp})`);

  // 4. Has register() call
  if (!code.includes('register(')) {
    issues.push('MISSING: no register() call');
  }

  // 5. Has IIFE wrapper
  if (!code.trimStart().startsWith('(function()')) {
    issues.push('MISSING: no IIFE wrapper');
  }

  if (issues.length === 0) {
    console.log('  PASS  ' + file);
    passed++;
  } else {
    console.log('  FAIL  ' + file);
    issues.forEach(issue => console.log('        ' + issue));
    failed++;
  }
}

console.log('');
console.log('─── Summary ───');
console.log(passed + '/' + (passed + failed) + ' files valid');
if (failed > 0) console.log(failed + ' file(s) need attention');
