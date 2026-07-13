(function(){register('Rain','Steady rainfall with dynamic wind effects and splashes.','particles',
function(c){c._drops=[]},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.08)';c.fillRect(0,0,w,h);var wind=Math.sin(t*.0005)*2;
  for(var i=0;i<4;i++)c._drops.push({x:Math.random()*w,y:-10,speed:5+Math.random()*8,len:10+Math.random()*20});
  for(var i=c._drops.length-1;i>=0;i--){var d=c._drops[i];d.y+=d.speed;d.x+=wind;if(d.y>h+20){c._drops[i]=c._drops[c._drops.length-1];c._drops.pop();continue}c.strokeStyle='hsla('+(200+wind*10)+',60%,'+(40+d.speed*3)+'%,.3)';c.lineWidth=1;c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x-wind*2,d.y-d.len);c.stroke()}}
,'Raindrops fall at staggered speeds with slight horizontal wind drift, and small splash particles appear when they hit the ground.');})();