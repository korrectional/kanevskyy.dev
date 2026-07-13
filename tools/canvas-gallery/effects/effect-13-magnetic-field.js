(function(){register('Magnetic Field','Tiny particles trace colorful magnetic field lines in real time.','interactive',
function(c){
  c._pts=[];c._mx=-9999;c._my=-9999;c._init=false;c._evtd=function(){c._mx=-9999;c._my=-9999};
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
  c.canvas.addEventListener('mousemove',c._evt);c.canvas.addEventListener('mouseleave',c._evtd)
},
function(c,w,h,t){
  if(!c._init){
    for(var i=0;i<150;i++){
      var x=Math.random()*w,y=Math.random()*h;
      if(Math.hypot(x-c._mx,y-c._my)<150){x=Math.random()*w;y=Math.random()*h}
      c._pts.push({x:x,y:y,vx:0,vy:0,h:Math.random()*360})
    }
    c._init=true
  }
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(0,0,w,h);
  for(var i=0;i<c._pts.length;i++){
    var p=c._pts[i];
    var dx=p.x-c._mx,dy=p.y-c._my,d=Math.hypot(dx,dy)||1;
    var f=5000*Math.min(w,h)/800/(d*d);
    p.vx-=dy/d*f*0.3;p.vy+=dx/d*f*0.3;
    p.vx*=.97;p.vy*=.97;
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>w||p.y<0||p.y>h){
      var x=Math.random()*w,y=Math.random()*h;
      if(Math.hypot(x-c._mx,y-c._my)<150){x=Math.random()*w;y=Math.random()*h}
      p.x=x;p.y=y;p.vx=0;p.vy=0;p.h=Math.random()*360
    }
    c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(p.x,p.y,1.5,0,Math.PI*2);c.fill()
  }
},
function(c){try{c.canvas.removeEventListener('mousemove',c._evt)}catch(e){}try{c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}}
,'Tiny particles trace magnetic field lines by responding to the mouse cursor as a magnetic pole, with smooth interpolation creating flowing arc patterns.');})();