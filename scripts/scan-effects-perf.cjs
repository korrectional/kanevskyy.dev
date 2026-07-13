/**
 * scan-effects-perf.cjs
 * Scans all canvas gallery effects for known performance anti-patterns.
 *
 * Usage: node scripts/scan-effects-perf.cjs
 *
 * Reports per-file findings with file/line context.
 */

const fs = require('fs');
const path = require('path');

const effectsDir = path.join(__dirname, '..', 'tools', 'canvas-gallery', 'effects');
const files = fs.readdirSync(effectsDir).filter(f => f.endsWith('.js')).sort();

const checks = [
  {
    pattern: /\.splice\(i,1\)/g,
    label: 'splice(i,1) in loop — O(n²) deletion, use swap-pop',
    severity: 'HIGH',
  },
  {
    pattern: /globalCompositeOperation\s*=/g,
    label: 'globalCompositeOperation toggle — expensive per-frame state change',
    severity: 'MED',
  },
  {
    pattern: /new Array\(/g,
    label: 'new Array() in draw function — per-frame allocation, reuse instead',
    severity: 'MED',
  },
  {
    pattern: /Array\.from/g,
    label: 'Array.from() — creates intermediate array, prefer for loop',
    severity: 'LOW',
  },
  {
    pattern: /\bArray\.prototype/g,
    label: 'Array.prototype method — potential per-frame allocation',
    severity: 'LOW',
  },
  {
    pattern: /c\.globalAlpha/g,
    label: 'globalAlpha toggle — prefer hsla alpha instead',
    severity: 'LOW',
  },
  {
    pattern: /Math\.random\(\)\s*\*\s*\d{3,}(?!\s*[./])/g,
    label: 'Hardcoded large pixel value — should be canvas-relative (w/h)',
    severity: 'MED',
  },
  {
    pattern: /\.sort\(/g,
    label: '.sort() in draw function — O(n log n) per frame, use insertion pass',
    severity: 'MED',
  },
];

let totalFiles = 0, totalIssues = 0;

for (const file of files) {
  const fullPath = path.join(effectsDir, file);
  const code = fs.readFileSync(fullPath, 'utf8');
  const lines = code.split('\n');
  const fileIssues = [];

  for (const check of checks) {
    check.pattern.lastIndex = 0;
    let match;
    while ((match = check.pattern.exec(code)) !== null) {
      // Find the line number
      const lineNum = code.substring(0, match.index).split('\n').length;
      const lineText = lines[lineNum - 1].trim().substring(0, 100);
      fileIssues.push({ severity: check.severity, label: check.label, line: lineNum, text: lineText });
    }
  }

  if (fileIssues.length > 0) {
    console.log(`${file}:`);
    for (const issue of fileIssues) {
      console.log(`  [${issue.severity}] L${issue.line} ${issue.label}`);
      console.log(`         ${issue.text}`);
    }
    totalFiles++;
    totalIssues += fileIssues.length;
    console.log('');
  }
}

console.log(`─── Summary ───`);
console.log(`${totalFiles}/${files.length} files have issues`);
console.log(`${totalIssues} total findings`);