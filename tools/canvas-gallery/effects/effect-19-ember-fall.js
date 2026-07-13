(function(){register('Ember Fall','Warm glowing embers burst from your mouse, falling with gravity and bouncing off the ground.','interactive,particles',
function(c){
  c._mx=-9999;c._my=-9999;
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
  c.canvas.addEventListener('mousemove',c._evt);
  c._evtd=function(){c._mx=-9999;c._my=-9999};
  c.canvas.addEventListener('mouseleave',c._evtd);
  c._init=true;
},
function(c,w,h,t){
  if(c._init){
    c._init=false;
    c._particles=[];
    c._nextSpawn=0;
  }
  // Trail fade
  c.fillStyle='rgba(0,0,0,0.15)';
  c.fillRect(0,0,w,h);
  // Spawn particles at mouse position
  if(c._mx>-1000&&c._my>-1000&&t>c._nextSpawn){
    c._nextSpawn=t+20;
    for(var k=0;k<3;k++){
      var r0=Math.max(2,Math.min(w,h)*0.008);
      c._particles.push({
        x:c._mx+(Math.random()-0.5)*4,
        y:c._my+(Math.random()-0.5)*4,
        r:r0,
        r0:r0,
        rIncrement:r0*-0.01,
        vx:(Math.random()-0.5)*0.8,
        vy:Math.random()*-0.5-0.5,
        vxMult:(10+Math.random()*10)*0.1,
        vyMult:-(2+Math.random()*4)*0.1,
        gravity:0.3,
        hue:30+Math.random()*30,
        light:50+Math.random()*50,
        bounced:false,
        life:0,
        maxLife:50+Math.random()*50
      });
    }
  }
  // Update & draw particles
  var ps=c._particles;
  for(var i=ps.length-1;i>=0;i--){
    var p=ps[i];
    p.x+=p.vx;
    p.vy+=p.gravity;
    p.y+=p.vy;
    p.r+=p.rIncrement;
    // Bounce off ground
    if(p.y>h-p.r0){
      if(!p.bounced){
        p.vx*=p.vxMult;
      }else{
        p.vx*=0.9;
      }
      p.bounced=true;
      p.vy*=p.vyMult;
      p.y=h-p.r0;
    }
    p.life++;
    // Draw with glow
    var alpha=Math.max(0,1-p.life/p.maxLife);
    if(p.r>0&&alpha>0){
      c.fillStyle='hsla('+p.hue+',100%,'+p.light+'%,'+alpha+')';
      c.beginPath();
      c.arc(p.x,p.y,Math.max(0.5,p.r),0,Math.PI*2);
      c.fill();
    }
    // Remove dead particles (swap-pop)
    if(p.r<=0||p.life>p.maxLife||alpha<=0){
      ps[i]=ps[ps.length-1];ps.pop();
    }
  }
  // Cap total particles
  if(ps.length>500)ps.splice(0,ps.length-500);
},
function(c){
  try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}
},'Warm-colored particles spawn at the mouse cursor and fall with gravity, bouncing off the ground with energy loss on each impact.');})();