(function(){register('Smoke','Wispy smoke particles that rise and fade with realistic motion.','particles',
function(c){c._particles=[]},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.04)';c.fillRect(0,0,w,h);
  var sr=Math.min(w,h)*0.04;for(var i=0;i<3;i++)c._particles.push({x:w/2+(Math.random()-.5)*sr,y:h-10,vx:(Math.random()-.5)*.3,vy:-(0.3+Math.random()*0.8)*Math.min(w,h)/200,r:Math.max(2,Math.min(w,h)*0.006)+Math.random()*Math.min(w,h)*0.012,life:1,hue:30+Math.random()*20});
  for(var i=c._particles.length-1;i>=0;i--){var p=c._particles[i];p.x+=p.vx+Math.sin(p.y*.02+t*.001)*.2;p.y+=p.vy;p.vy*=.99;p.life-=.003;p.r+=.05;if(p.life<=0){c._particles[i]=c._particles[c._particles.length-1];c._particles.pop();continue}c.fillStyle='hsla('+p.hue+',30%,'+(30+20*p.life)+'%,'+p.life*.3+')';c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);c.fill()}}
,'Smoke particles rise with random velocity, grow in size, and fade out gradually, with a semi-transparent trail effect creating wispy volumes.');})();