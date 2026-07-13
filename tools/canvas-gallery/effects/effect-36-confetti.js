(function(){register('Confetti','A continuous stream of colorful falling confetti pieces.','particles',
function(c){c._pieces=[]},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(0,0,w,h);
  for(var i=0;i<1;i++)c._pieces.push({x:Math.random()*w,y:-10,s:3+Math.random()*5,sp:.5+Math.random()*2,h:Math.random()*360,vx:(Math.random()-.5)*2,vr:(Math.random()-.5)*.1,r:Math.random()*6.28});
  for(var i=c._pieces.length-1;i>=0;i--){var p=c._pieces[i];p.y+=p.sp;p.x+=Math.sin(p.r)*.5;p.r+=p.vr;if(p.y>h+20){c._pieces[i]=c._pieces[c._pieces.length-1];c._pieces.pop();continue}c.fillStyle='hsla('+p.h+',80%,60%,.7)';c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillRect(-p.s,-p.s*0.5,p.s*2,p.s);c.restore()}}
,'Rectangular confetti pieces fall with gravity, rotation, and horizontal drift, recycling back to the top when they exit the canvas.');})();