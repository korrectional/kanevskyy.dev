// ── Canvas Gallery: boot, cards, showcase, and overlay management ──

// ── DOM references ──
const g  = document.getElementById('gallery');
const ov = document.getElementById('overlay');
const oc = document.getElementById('overlay-canvas');
const ot = document.getElementById('overlay-title');
const bP = document.getElementById('btnPause');
const bR = document.getElementById('btnRestart');
const bC = document.getElementById('btnClose');
const ocT = document.getElementById('ocToggle');
const ocC = document.getElementById('ocContent');

const sc  = document.getElementById('showcase');
const scv = document.getElementById('showcase-canvas');
const sct = document.getElementById('showcase-title');
const scg = document.getElementById('showcase-tag');
const sce = document.getElementById('showcase-explain');
const scc = document.getElementById('showcase-code');
const bl  = document.getElementById('backLink');

let ai = -1;   // active overlay effect index
let ps = 0;    // paused flag
let rn = 0;    // running flag
let rf = null; // overlay/showcase RAF id
let mr = [];   // gallery RAF ids
let io = null; // IntersectionObserver for visible thumbnails
let scStart = 0; // showcase start time

// ── Slug helpers ──
function toSlug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
var slugs = []; // slug → effect index

// ── Build a gallery card ──
function makeCard(i) {
  var e = effects[i];
  var slug = toSlug(e.name);
  slugs[slug] = i;

  var cd = document.createElement('div');
  cd.className = 'card';

  var cnv = document.createElement('canvas');

  var bd = document.createElement('div');
  bd.className = 'card-body';
  bd.innerHTML = '<h3>' + e.name + '</h3><p>' + e.desc +
    '</p><span class="tag">' + e.tag + '</span>';

  var cc = document.createElement('div');
  cc.className = 'card-code';
  var tb = document.createElement('button');
  tb.className = 'code-toggle';
  tb.textContent = 'Show code';
  var pre = document.createElement('pre');
  var co = document.createElement('code');
  co.textContent = e.code.substring(0, 300) +
    (e.code.length > 300 ? '\n\n/* … */' : '');
  pre.appendChild(co);
  cc.appendChild(tb);
  cc.appendChild(pre);
  tb.onclick = function() {
    cc.classList.toggle('open');
    tb.textContent = cc.classList.contains('open') ? 'Hide code' : 'Show code';
  };

  cd.appendChild(cnv);
  cd.appendChild(bd);
  cd.appendChild(cc);
  cd.onclick = function(ev) {
    if (ev.target.closest('.code-toggle,pre,code')) return;
    window.location.search = '?effect=' + slug;
  };

  // Store canvas ref for thumbnail start
  cd._canvas = cnv;
  cd._index = i;
  return cd;
}

// ── Start thumbnail RAF loop (resets state as if first time) ──
function startThumb(i, canvas) {
  var ctx = canvas.getContext('2d');
  var e = effects[i];
  // Clean up previous state + event listeners, then init fresh
  e.destroy(ctx);
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  canvas.width = w * 2;
  canvas.height = h * 2;
  ctx.scale(2, 2);
  e.init(ctx);

  // Interactive effects: show "hover here to interact" hint until user moves mouse
  if (e.tag === 'interactive') {
    ctx._hovered = false;
    var hoverHandler = function() {
      ctx._hovered = true;
      canvas.removeEventListener('mousemove', hoverHandler);
    };
    canvas._hoverHandler = hoverHandler;
    canvas.addEventListener('mousemove', hoverHandler);
  }

  var start = performance.now();
  var lastFrame = 0;
  (function loop(t) {
    if (t - lastFrame < 16.667) { mr[i] = requestAnimationFrame(loop); return; }
    lastFrame = t;
    var cw = canvas.clientWidth;
    var ch = canvas.clientHeight;
    e.draw(ctx, cw, ch, t - start);
    // Draw hover hint for interactive effects
    if (e.tag === 'interactive' && !ctx._hovered) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('hover here to interact', cw / 2, ch / 2);
      ctx.restore();
    }
    mr[i] = requestAnimationFrame(loop);
  })();
}

// ── Stop thumbnail RAF loop ──
function stopThumb(i) {
  if (mr[i]) { cancelAnimationFrame(mr[i]); mr[i] = null; }
  // Clean up interactive hover handler
  var canvas = document.querySelector('.card canvas[data-index="' + i + '"]');
  if (canvas && canvas._hoverHandler) {
    canvas.removeEventListener('mousemove', canvas._hoverHandler);
    delete canvas._hoverHandler;
  }
}

// ── Showcase mode ──
function startShowcase(idx) {
  var e = effects[idx];

  // Stop thumbnail loops while showcase is active
  pauseGallery();

  // Hide gallery header + back link, show showcase
  document.querySelector('header').style.display = 'none';
  g.style.display = 'none';
  ov.style.display = 'none';
  sc.style.display = 'block';
  bl.style.display = 'none';

  document.title = e.name + ' — Canvas Gallery';

  sct.textContent = e.name;
  scg.textContent = e.tag;
  sce.innerHTML = '<strong>How it works:</strong> ' + e.howItWorks;
  // Generate standalone HTML snippet from init/draw function sources
  if (!e._codeSnippet) {
    var initSrc = e.init.toString();
    var drawSrc = e.draw.toString();

    function extractBody(fn) {
      var s = fn.indexOf('{');
      if (s === -1) return '';
      var body = fn.slice(s + 1);
      var d = 1;
      for (var i = 0; i < body.length; i++) {
        if (body[i] === '{') d++;
        else if (body[i] === '}') { d--; if (d === 0) return body.slice(0, i); }
      }
      return body;
    }

    var initBody = extractBody(initSrc);
    var drawBody = extractBody(drawSrc);

    var snip = '<canvas id="c"></canvas>\n';
    snip += '<style>\n';
    snip += '*{margin:0;padding:0;box-sizing:border-box}\n';
    snip += 'body{background:#000;overflow:hidden}\n';
    snip += 'canvas{display:block;width:100vw;height:100vh}\n';
    snip += '</style>\n';
    snip += '<script>\n';
    snip += 'var c = document.getElementById("c").getContext("2d");\n';
    snip += 'var cw, ch;\n';
    snip += '\n';
    snip += 'function resize() {\n';
    snip += '  cw = c.canvas.clientWidth;\n';
    snip += '  ch = c.canvas.clientHeight;\n';
    snip += '  c.canvas.width = cw * devicePixelRatio;\n';
    snip += '  c.canvas.height = ch * devicePixelRatio;\n';
    snip += '  c.scale(devicePixelRatio, devicePixelRatio);\n';
    snip += '  ' + initBody + '\n';
    snip += '}\n';
    snip += '\n';
    snip += 'resize();\n';
    snip += 'window.addEventListener("resize", function() {\n';
    snip += '  c.setTransform(1, 0, 0, 1, 0, 0);\n';
    snip += '  resize();\n';
    snip += '});\n';
    snip += '\n';
    snip += 'var start = performance.now();\n';
    snip += '(function loop(ts) {\n';
    snip += '  cw = c.canvas.clientWidth;\n';
    snip += '  ch = c.canvas.clientHeight;\n';
    snip += '  var w = cw, h = ch, t = ts - start;\n';
    snip += '  ' + drawBody + '\n';
    snip += '  requestAnimationFrame(loop);\n';
    snip += '})(performance.now());\n';
    snip += '</script>';

    e._codeSnippet = snip;
  }
  scc.textContent = e._codeSnippet;

  // Setup showcase canvas
  var wrap = sc.querySelector('.canvas-wrap');
  var w = scv.clientWidth || wrap.clientWidth;
  var h = scv.clientHeight || wrap.clientHeight;
  scv.width = w * 2;
  scv.height = h * 2;
  var ctx = scv.getContext('2d');
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  e.init(ctx);

  // Track first mouse move for hover hint on interactive effects
  if (e.tag === 'interactive') {
    ctx._showcaseHovered = false;
    var scHover = function() {
      ctx._showcaseHovered = true;
      scv.removeEventListener('mousemove', scHover);
    };
    ctx._scHover = scHover;
    scv.addEventListener('mousemove', scHover);
  }

  scStart = performance.now();
  var lastFrame = 0;
  if (rf) cancelAnimationFrame(rf);
  (function loop(t) {
    if (t - lastFrame < 16.667) { rf = requestAnimationFrame(loop); return; }
    lastFrame = t;
    var cw = scv.clientWidth || wrap.clientWidth;
    var ch = scv.clientHeight || wrap.clientHeight;
    // Re-check size on resize
    if (Math.abs(scv.width - cw * 2) > 1) {
      scv.width = cw * 2;
      scv.height = ch * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    }
    e.draw(ctx, cw, ch, t - scStart);
    // Draw hover hint for interactive effects in showcase
    if (e.tag === 'interactive' && !ctx._showcaseHovered) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('hover here to interact', cw / 2, ch / 2);
      ctx.restore();
    }
    rf = requestAnimationFrame(loop);
  })();
}

function stopShowcase() {
  if (rf) { cancelAnimationFrame(rf); rf = null; }
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('effect');
  if (slug && slugs[slug] !== undefined) {
    try { effects[slugs[slug]].destroy(scv.getContext('2d')); } catch(e) {}
  }
  sc.style.display = 'none';
  g.style.display = '';
  document.querySelector('header').style.display = '';
  bl.style.display = '';
  document.title = 'Canvas Gallery — kanevskyy.dev';
  resumeGallery();
}

// ── Check for ?effect= parameter on load ──
function checkShowcase() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('effect');
  if (slug && slugs[slug] !== undefined) {
    startShowcase(slugs[slug]);
  }
}

// ── Build cards, init all canvases, then observe for visibility ──
effects.forEach(function(_, i) {
  var card = makeCard(i);
  g.appendChild(card);
});
requestAnimationFrame(function() {
  var canvases = document.querySelectorAll('.card canvas');
  canvases.forEach(function(cnv, i) {
    cnv.dataset.index = i;
  });
  // Only animate thumbnails that are actually visible
  io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var i = Number(entry.target.dataset.index);
      if (entry.isIntersecting && !mr[i]) {
        // Don't start thumbnails when overlay is covering the gallery
        if (!ov.classList.contains('open')) {
          startThumb(i, entry.target);
        }
      } else if (!entry.isIntersecting && mr[i]) {
        stopThumb(i);
      }
    });
  }, { rootMargin: '200px' });
  canvases.forEach(function(cnv) {
    io.observe(cnv);
  });

  // Check for showcase mode after cards are built
  checkShowcase();
});

// ── Overlay canvas setup ──
function setupOverlayCanvas() {
  oc.width = oc.clientWidth * 2;
  oc.height = oc.clientHeight * 2;
  var c = oc.getContext('2d');
  c.setTransform(2, 0, 0, 2, 0, 0);
  c._ocw = oc.clientWidth;
  c._och = oc.clientHeight;
}

// ── Gallery pause/resume ──
function pauseGallery() {
  var m = mr.slice();
  for (var j = 0; j < m.length; j++) {
    if (m[j]) { cancelAnimationFrame(m[j]); mr[j] = null; }
  }
}
function resumeGallery() {
  // Re-observe all canvases — fires callbacks immediately for current visibility
  if (io) {
    io.disconnect();
    document.querySelectorAll('.card canvas').forEach(function(cnv) {
      io.observe(cnv);
    });
  }
}

// ── Open overlay ──
function openOverlay(i) {
  pauseGallery();
  ai = i;
  rn = 1;
  ps = 0;
  ov.classList.add('open');
  ot.textContent = effects[i].name;
  bP.textContent = 'pause';
  ocC.textContent = effects[i].code;
  ocT.parentElement.classList.remove('open');
  ocT.textContent = 'Show code';
  setupOverlayCanvas();
  var ctx = oc.getContext('2d');
  effects[i].init(ctx);
  var start = performance.now();
  var lastFrame = 0;
  if (rf) cancelAnimationFrame(rf);
  (function loop(t) {
    if (t - lastFrame < 16.667) { rf = requestAnimationFrame(loop); return; }
    lastFrame = t;
    if (!rn) return;
    if (!ps) {
      var c2 = oc.getContext('2d');
      if (c2._ocw !== oc.clientWidth || c2._och !== oc.clientHeight) {
        setupOverlayCanvas();
      }
      effects[i].draw(c2, oc.clientWidth, oc.clientHeight, t - start);
    }
    rf = requestAnimationFrame(loop);
  })();
}

// ── Close overlay ──
function closeOverlay() {
  rn = 0;
  if (rf) { cancelAnimationFrame(rf); rf = null; }
  if (ai >= 0) {
    try { effects[ai].destroy(oc.getContext('2d')); } catch(e) {}
  }
  ai = -1;
  ov.classList.remove('open');
  resumeGallery();
}

// ── Event wiring ──
ocT.onclick = function() {
  ocT.parentElement.classList.toggle('open');
  ocT.textContent = ocT.parentElement.classList.contains('open')
    ? 'Hide code' : 'Show code';
};
bC.onclick = closeOverlay;
bR.onclick = function() {
  if (ai >= 0) { closeOverlay(); openOverlay(ai); }
};
bP.onclick = function() {
  ps = !ps;
  bP.textContent = ps ? 'resume' : 'pause';
};
document.onkeydown = function(e) {
  if (e.key === 'Escape' && ov.classList.contains('open')) closeOverlay();
};

// Handle popstate (back/forward) for showcase
window.addEventListener('popstate', function() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('effect');
  if (slug && slugs[slug] !== undefined) {
    startShowcase(slugs[slug]);
  } else {
    stopShowcase();
  }
});