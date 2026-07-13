(function(){register('Orbital','Small planets orbit a central sun with a trail effect. Click or move mouse to disturb orbits.','interactive',
function(c){
  c._planets=[];c._mx=0;c._my=0;c._init=true;
  for(var i=0;i<20;i++){
    var a=Math.random()*Math.PI*2,sp=0.5+Math.random()*2;
    c._planets.push({x:0,y:0,ox:0,oy:0,vx:-Math.sin(a)*sp*0.5,vy:Math.cos(a)*sp*0.5,speed:sp,hue:Math.random()*360});
  }
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
  c.canvas.addEventListener('mousemove',c._evt);c._evtd=function(){c._mx=-9999;c._my=-9999};c.canvas.addEventListener('mouseleave',c._evtd);
},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(0,0,w,h);
  var cx=w/2,cy=h/2;
  if(c._init){c._init=false;for(var i=0;i<c._planets.length;i++){var p=c._planets[i];var a=Math.atan2(p.vy,-p.vx);p.x=cx+Math.cos(a)*(30+Math.random()*200);p.y=cy+Math.sin(a)*(30+Math.random()*200)}}
  c.fillStyle='#ffdd44';c.beginPath();c.arc(cx,cy,8,0,Math.PI*2);c.fill();
  for(var i=0;i<c._planets.length;i++){
    var p=c._planets[i];
    var dx=cx-p.x,dy=cy-p.y,d=Math.hypot(dx,dy)||1;
    var g=800/(d*d);
    p.vx+=dx/d*g;p.vy+=dy/d*g;
    var mdx=c._mx-p.x,mdy=c._my-p.y,md=Math.hypot(mdx,mdy)||1;
    if(md<150){var push=(1-md/150)*0.3;p.vx-=mdx/md*push;p.vy-=mdy/md*push}
    p.x+=p.vx;p.y+=p.vy;
    c.beginPath();c.arc(p.x,p.y,3+Math.sin(i+t*.01)*1,0,Math.PI*2);
    c.fillStyle='hsla('+p.hue+',80%,'+(50+20*Math.sin(i+t*.02))+'%,.8)';c.fill();
  }
},
function(c){try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}},'Small planets orbit a central mass with realistic gravitational physics, and the mouse cursor disturbs their orbits with an additional gravitational pull.');})();