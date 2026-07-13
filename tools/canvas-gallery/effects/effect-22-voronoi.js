(function(){register('Voronoi','A growing voronoi diagram with animated seed points and colorful cells.','geometry',
function(c){c._pts=Array.from({length:25},function(){return{x:Math.random()*800,y:Math.random()*600,dx:(Math.random()-.5)*.5,dy:(Math.random()-.5)*.5,h:Math.random()*360}});c._first=1},
function(c,w,h,t){
  if(c._first){c.fillStyle='#0a0a0a';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.03)';c.fillRect(0,0,w,h);
  for(var i=0;i<c._pts.length;i++){var p=c._pts[i];p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>w)p.dx*=-1;if(p.y<0||p.y>h)p.dy*=-1}
  var step=Math.max(4,Math.ceil(Math.min(w,h)*0.01));for(var y=0;y<h;y+=step)for(var x=0;x<w;x+=step){var md=Infinity,mi=0;for(var i=0;i<c._pts.length;i++){var d=Math.hypot(x-c._pts[i].x,y-c._pts[i].y);if(d<md){md=d;mi=i}}c.fillStyle='hsla('+(c._pts[mi].h+t*.1)%360+',70%,'+(50-Math.min(25,md*0.1))+'%,.3)';c.fillRect(x,y,step,step)}
},'Seed points grow outward at equal speed until they meet, forming a Voronoi diagram with colored cells that animate as seeds drift.');})();