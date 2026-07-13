(function(){register('Particle Swarm','Hundreds of colorful particles that follow your mouse with fluid motion.','interactive',
function(c){
  var w=c.canvas.clientWidth,h=c.canvas.clientHeight;c._ps=[];c._mx=w/2;c._my=h/2;
  for(var i=0;i<200;i++){c._ps.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,hue:Math.random()<.5?0:1,life:Math.random()})}
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};c.canvas.addEventListener('mousemove',c._evt);
  c._evtd=function(){c._mx=c.canvas.clientWidth/2;c._my=c.canvas.clientHeight/2};c.canvas.addEventListener('mouseleave',c._evtd);c._fbg='rgba(0,0,0,.12)';c._h0='hsla(210,80%,60%,';c._h1='hsla(50,80%,60%,'
},
function(c,w,h,t){
  var ps=c._ps;c.fillStyle=c._fbg;c.fillRect(0,0,w,h);
  for(var i=0;i<200;i++){
    var p=ps[i];p.life-=.003;
    if(p.life<=0){var a=Math.random()*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);p.x=c._mx+ca*(100+Math.random()*200);p.y=c._my+sa*(100+Math.random()*200);p.vx=ca*(Math.random()+.5);p.vy=sa*(Math.random()+.5);p.life=.3+Math.random()*.7;p.hue=Math.random()<.5?0:1;continue}
    var dx=c._mx-p.x,dy=c._my-p.y,d=Math.hypot(dx,dy)||1;p.vx+=dx/d*.3;p.vy+=dy/d*.3;p.vx+=(Math.random()-.5)*.08;p.vy+=(Math.random()-.5)*.08;p.vx*=.96;p.vy*=.96;p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
    var a=Math.min(1,60/d);c.beginPath();c.arc(p.x,p.y,2,0,Math.PI*2);c.fillStyle=(p.hue===0?c._h0:c._h1)+(a*Math.max(.2,p.life))+')';c.fill()
  }
},
function(c){try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}},'Each particle is attracted to the mouse with spring-like force while random noise prevents settling, creating a fluid swarming effect.');})();