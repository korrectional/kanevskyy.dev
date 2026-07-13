# Task for delegate

Edit the file `C:/Users/david/src/--misc/kanevskyy.dev/tools/canvas-gallery/effects/effect-02-particle-swarm.js` to make all particles blue and yellow instead of rainbow colors.

Current code in the IIFE:
```js
(function(){register('Particle Swarm','Hundreds of colorful particles that follow your mouse with fluid motion.','interactive',
function(c){c._ps=Array.from({length:200},function(){return{x:Math.random()*c.canvas.width,y:Math.random()*c.canvas.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,hue:Math.random()*360,life:1}});c._mx=c.canvas.width/2;c._my=c.canvas.height/2;c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};c.canvas.addEventListener('mousemove',c._evt);c._evtd=function(){c._mx=c.canvas.width/2;c._my=c.canvas.height/2};c.canvas.addEventListener('mouseleave',c._evtd)},
function(c,w,h,t){var ps=c._ps;c.fillStyle='rgba(0,0,0,.12)';c.fillRect(0,0,w,h);for(var i=ps.length-1;i>=0;i--){var p=ps[i];p.life-=.003;if(p.life<=0){ps.splice(i,1);continue}var dx=c._mx-p.x,dy=c._my-p.y,d=Math.hypot(dx,dy)||1;p.vx+=dx/d*.3;p.vy+=dy/d*.3;p.vx+=(Math.random()-.5)*.08;p.vy+=(Math.random()-.5)*.08;p.vx*=.96;p.vy*=.96;p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;var a=Math.min(1,60/d);c.beginPath();c.arc(p.x,p.y,2,0,Math.PI*2);c.fillStyle='hsla('+(p.hue+t*.3)+',80%,60%,'+(a*Math.max(.2,p.life))+')';c.fill()}while(ps.length<200){var ang=Math.random()*Math.PI*2;ps.push({x:c._mx+Math.cos(ang)*(100+Math.random()*200),y:c._my+Math.sin(ang)*(100+Math.random()*200),vx:Math.cos(ang)*(Math.random()+.5),vy:Math.sin(ang)*(Math.random()+.5),hue:Math.random()*360,life:.3+Math.random()*.7})}},
function(c){try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}},'Each particle is attracted to the mouse with spring-like force while random noise prevents settling, creating a fluid swarming effect.');})();
```

**Changes needed:**

1. In init (`function(c)`): Change `hue:Math.random()*360` to `hue:Math.random()<.5?0:1` (flag: 0=blue, 1=yellow)

2. In draw (`function(c,w,h,t)`): Change the color line from:
   `c.fillStyle='hsla('+(p.hue+t*.3)+',80%,60%,'+(a*Math.max(.2,p.life))+')';`
   to:
   `c.fillStyle='hsla('+(p.hue===0?210:50)+',80%,60%,'+(a*Math.max(.2,p.life))+')';`
   
   This renders blue (hue 210) or yellow (hue 50) based on the flag, and removes the t*0.3 rainbow cycling.

3. In the spawn section (`while(ps.length<200){...}`): Change `hue:Math.random()*360` to `hue:Math.random()<.5?0:1`

Make only these 3 changes. Use `edit` tool with oldText/newText matching.

## Acceptance Contract
Acceptance level: checked
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Implement the requested change without widening scope

Required evidence: changed-files, tests-added, commands-run, residual-risks, no-staged-files

Finish with a fenced JSON block tagged `acceptance-report` in this shape:
Use empty arrays when no items apply; array fields contain strings unless object entries are shown.
```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "specific proof"
    }
  ],
  "changedFiles": [
    "src/file.ts"
  ],
  "testsAddedOrUpdated": [
    "test/file.test.ts"
  ],
  "commandsRun": [
    {
      "command": "command",
      "result": "passed",
      "summary": "short result"
    }
  ],
  "validationOutput": [
    "validation output or concise summary"
  ],
  "residualRisks": [
    "none"
  ],
  "noStagedFiles": true,
  "diffSummary": "short description of the diff",
  "reviewFindings": [
    "blocker: file.ts:12 - issue found, or no blockers"
  ],
  "manualNotes": "anything else the parent should know"
}
```