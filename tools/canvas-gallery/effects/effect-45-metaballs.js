(function(){register('Metaballs','Marching blobby metaballs that merge and split organically.','retro',
function(c){var cw=c.canvas.width/2,ch=c.canvas.height/2;c._balls=[];for(var i=0;i<6;i++)c._balls.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,r:Math.min(cw,ch)*.04+Math.random()*Math.min(cw,ch)*.06,h:Math.random()*360});c._first=1},
function(c,w,h,t){
  if(c._first){c.fillStyle='#000';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.04)';c.fillRect(0,0,w,h);
  for(var i=0;i<c._balls.length;i++){var b=c._balls[i];b.x+=b.vx;b.y+=b.vy;if(b.x<0||b.x>w)b.vx*=-1;if(b.y<0||b.y>h)b.vy*=-1}
  var step=Math.max(3,Math.ceil(Math.min(w,h)*0.006));for(var y=0;y<h;y+=step)for(var x=0;x<w;x+=step){var sum=0;for(var i=0;i<c._balls.length;i++){var b=c._balls[i];var d=Math.hypot(x-b.x,y-b.y);if(d<1)d=1;sum+=b.r*b.r/(d*d)}if(sum>.8){var hue=(c._balls[0].h+x*.2+y*.3+t*.05)%360;var light=40+Math.min(20,sum*5);c.fillStyle='hsla('+hue+',70%,'+light+'%,.6)';c.fillRect(x,y,step,step)}}}
,'Metaballs use marching squares to find the boundary of overlapping circular fields, creating organic blobby shapes that merge and separate.');})();