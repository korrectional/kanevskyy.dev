(function(){register('Shadow Cubes','Rotating colored squares cast dynamic shadows from a light source that follows your mouse.','interactive,geometry',
function(c){
  c._mx=-9999;c._my=-9999;
  c._boxes=[];
  c._colors=['#f5c156','#e6616b','#5cd3ad'];
  c._init=false;
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
  c._evtd=function(){c._mx=-9999;c._my=-9999};
  c.canvas.addEventListener('mousemove',c._evt);
  c.canvas.addEventListener('mouseleave',c._evtd);
},
function(c,w,h,t){
  var i;
  if(!c._init){
    c._boxes=[];
    var count=Math.max(6,Math.floor(w*h/20000));
    for(i=0;i<count;i++){
      c._boxes.push({
        half_size:Math.floor(Math.random()*50+1),
        x:Math.random()*w,
        y:Math.random()*h,
        r:Math.random()*Math.PI,
        color:c._colors[Math.floor(Math.random()*c._colors.length)]
      });
    }
    c._init=true;
  }
  // background
  c.fillStyle='#2c343f';
  c.fillRect(0,0,w,h);
  // light position
  var lx=c._mx,ly=c._my;
  if(lx<-1000){lx=w*0.3;ly=h*0.3}
  var maxDim=Math.max(w,h),sl=maxDim*2;
  // ambient gradient
  var grad=c.createRadialGradient(lx,ly,0,lx,ly,maxDim);
  grad.addColorStop(0,'#3b4654');
  grad.addColorStop(1,'#2c343f');
  c.fillStyle=grad;
  c.beginPath();
  c.arc(lx,ly,maxDim,0,Math.PI*2);
  c.fill();
  // light glow
  grad=c.createRadialGradient(lx,ly,0,lx,ly,Math.max(10,Math.min(w,h)*0.015));
  grad.addColorStop(0,'#ffffff');
  grad.addColorStop(1,'#3b4654');
  c.fillStyle=grad;
  c.beginPath();
  c.arc(lx,ly,Math.max(5,Math.min(w,h)*0.025),0,Math.PI*2);
  c.fill();
  // single pass: update + shadow + box
  var boxes=c._boxes;
  for(i=0;i<boxes.length;i++){
    var b=boxes[i],spd=(60-b.half_size)/20;
    b.r+=spd*0.002;b.x+=spd;b.y+=spd;
    if(b.y-b.half_size>h)b.y-=h+100;
    if(b.x-b.half_size>w)b.x-=w+100;
    // precompute once, use trig identities for the other 3 corners
    var sr=b.r,hs=b.half_size,sinR=Math.sin(sr),cosR=Math.cos(sr);
    var dx0=b.x+hs*sinR,dy0=b.y+hs*cosR;
    var dx1=b.x+hs*cosR,dy1=b.y-hs*sinR;
    var dx2=b.x-hs*sinR,dy2=b.y-hs*cosR;
    var dx3=b.x-hs*cosR,dy3=b.y+hs*sinR;
    // shadow projections: ex = dx - sl*(lx-dx)/dist  (replaces atan2+sin+cos)
    var d0=Math.hypot(lx-dx0,ly-dy0)||1,ex0=dx0-sl*(lx-dx0)/d0,ey0=dy0-sl*(ly-dy0)/d0;
    var d1=Math.hypot(lx-dx1,ly-dy1)||1,ex1=dx1-sl*(lx-dx1)/d1,ey1=dy1-sl*(ly-dy1)/d1;
    var d2=Math.hypot(lx-dx2,ly-dy2)||1,ex2=dx2-sl*(lx-dx2)/d2,ey2=dy2-sl*(ly-dy2)/d2;
    var d3=Math.hypot(lx-dx3,ly-dy3)||1,ex3=dx3-sl*(lx-dx3)/d3,ey3=dy3-sl*(ly-dy3)/d3;
    // draw 4 shadow quads
    c.fillStyle='#2c343f';
    c.beginPath();c.moveTo(dx0,dy0);c.lineTo(dx1,dy1);c.lineTo(ex1,ey1);c.lineTo(ex0,ey0);c.fill();
    c.beginPath();c.moveTo(dx1,dy1);c.lineTo(dx2,dy2);c.lineTo(ex2,ey2);c.lineTo(ex1,ey1);c.fill();
    c.beginPath();c.moveTo(dx2,dy2);c.lineTo(dx3,dy3);c.lineTo(ex3,ey3);c.lineTo(ex2,ey2);c.fill();
    c.beginPath();c.moveTo(dx3,dy3);c.lineTo(dx0,dy0);c.lineTo(ex0,ey0);c.lineTo(ex3,ey3);c.fill();
    // draw box
    c.beginPath();c.moveTo(dx0,dy0);c.lineTo(dx1,dy1);c.lineTo(dx2,dy2);c.lineTo(dx3,dy3);
    c.fillStyle=b.color;c.fill();
  }
},
function(c){
  try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}
}
,'Rotating colored squares cast dynamically computed shadow polygons projected away from the mouse-driven light source.');})();