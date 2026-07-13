(function(){register('Rymd','A 3D starfield where stars flow toward your mouse — navigate through space with a gentle gravitational pull.','interactive',
function(c){
  c._mx=-9999;c._my=-9999;
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
  c.canvas.addEventListener('mousemove',c._evt);
  c._evtd=function(){c._mx=-9999;c._my=-9999};
  c.canvas.addEventListener('mouseleave',c._evtd);
  c._init=true;
},
function(c,w,h,t){
  // One-time init: allocate stars once we know dimensions
  if(c._init){
    c._init=false;
    var count=Math.floor((w+h)/6);
    c._stars=new Array(count);
    for(var i=0;i<count;i++){
      c._stars[i]={
        x:Math.random()*w,y:Math.random()*h,
        z:0.2+Math.random()*0.8,
        vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5,
        h:Math.random()*360
      };
    }
  }

  // Fade trail
  c.fillStyle='rgba(0,0,0,0.08)';
  c.fillRect(0,0,w,h);

  var stars=c._stars,len=stars.length;
  var mx=c._mx,my=c._my;
  var isActive=mx>-1000&&my>-1000;
  var cx=w/2,cy=h/2;

  for(var i=0;i<len;i++){
    var s=stars[i];

    // Mouse attraction: stars flow toward cursor
    if(isActive){
      var dx=mx-s.x,dy=my-s.y;
      var dist=Math.sqrt(dx*dx+dy*dy)||1;
      var pull=0.003*s.z;
      if(dist>5){
        s.vx+=dx/dist*pull;
        s.vy+=dy/dist*pull;
      }
    }

    // Damping
    s.vx*=0.97;
    s.vy*=0.97;

    s.x+=s.vx;
    s.y+=s.vy;

    // Wrap around edges
    if(s.x<0)s.x=w;
    else if(s.x>w)s.x=0;
    if(s.y<0)s.y=h;
    else if(s.y>h)s.y=0;

    // Draw star with tail
    var sz=1+s.z*1.5;
    var alpha=0.4+s.z*0.6;
    c.strokeStyle='hsla('+s.h+',80%,65%,'+alpha+')';
    c.lineWidth=sz;
    c.lineCap='round';
    c.beginPath();
    c.moveTo(s.x,s.y);
    c.lineTo(s.x-s.vx*5,s.y-s.vy*5);
    c.stroke();

    // Bright core
    c.fillStyle='hsla('+s.h+',80%,90%,'+(alpha*0.6)+')';
    c.beginPath();
    c.arc(s.x,s.y,sz*0.4,0,Math.PI*2);
    c.fill();
  }
},
function(c){
  try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}}
,'Stars in 3D space are gently attracted toward the mouse cursor with a force proportional to depth, creating a flowing gravitational swarm effect.');})();