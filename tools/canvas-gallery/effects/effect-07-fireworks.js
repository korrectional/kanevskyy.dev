(function(){register('Fireworks','Bursting particle fireworks at your mouse cursor with colorful trails.','interactive',
function(c){
  c._fwks=[];c._t=0;c._mx=-1;c._my=-1;
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};c._evtd=function(){c._mx=-1;c._my=-1}
  c.canvas.addEventListener('mousemove',c._evt);c.canvas.addEventListener('mouseleave',c._evtd)
},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.15)';c.fillRect(0,0,w,h);
  if(Math.random()<.07){
    var cx,cy,hue;
    if(c._mx>=0&&c._my>=0){cx=c._mx;cy=c._my}else{cx=w*0.1+Math.random()*(w*0.8);cy=h*0.05+Math.random()*(h*0.4)}
    hue=Math.random()*360;var n=80+Math.random()*40|0,fwks=c._fwks;
    for(var i=0;i<n;i++){fwks.push({x:cx,y:cy,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6-2,h:hue+Math.random()*60,life:1,decay:.008+Math.random()*.012})}
  }
  c._fwks=c._fwks.filter(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.life-=p.decay;if(p.life<=0)return!1;var a=p.life;c.beginPath();c.arc(p.x,p.y,p.life*2.5,0,Math.PI*2);c.fillStyle='hsla('+p.h+',90%,60%,'+a+')';c.fill();return!0})
},
function(c){try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}}
,'Bursts of colorful particles explode outward from a point, with gravity pulling them down and fade-out creating natural trails.');})();