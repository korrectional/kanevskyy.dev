/**
 * dump-effects.cjs
 * Dumps all canvas gallery effects into one combined output for quick review.
 *
 * Usage: node scripts/dump-effects.cjs              # full output
 *        node scripts/dump-effects.cjs --meta        # filenames + stats only
 *        node scripts/dump-effects.cjs --grep splice # find files containing 'splice'
 */

const fs = require('fs');
const path = require('path');

const effectsDir = path.join(__dirname, '..', 'tools', 'canvas-gallery', 'effects');
const files = fs.readdirSync(effectsDir).filter(f => f.endsWith('.js')).sort();

const mode = process.argv[2] || 'all';
const search = process.argv[3] || '';

for (const file of files) {
  const fullPath = path.join(effectsDir, file);
  const code = fs.readFileSync(fullPath, 'utf8');

  if (mode === '--grep') {
    if (code.includes(search)) {
      console.log(`${file}: contains "${search}"`);
    }
    continue;
  }

  if (mode === '--meta') {
    const lines = code.split('\n').length;
    const size = code.length;
    const name = code.match(/register\('([^']+)/);
    const tags = code.match(/','([^']+)'/);
    console.log(`${file}: ${name ? name[1] : '?'} | ${lines} lines | ${size}B | ${tags ? tags[1] : '?'}`);
    continue;
  }

  // Full dump with header
  console.log(`\n${'='.repeat(60)}`);
  console.log(`FILE: ${file}`);
  console.log(`LINES: ${code.split('\n').length}`);
  console.log(`${'='.repeat(60)}`);
  console.log(code);
}
