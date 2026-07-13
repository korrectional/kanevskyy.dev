(function(){register('Bubbles','Floating colorful bubbles that drift upward and pop at the surface.','particles',
function(c){c._bubbles=[]},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(0,0,w,h);
  if(Math.random()<.1)c._bubbles.push({x:Math.random()*w,y:h+5,r:3+Math.random()*12,sp:.3+Math.random()*1.2,phase:Math.random()*6.28,hue:Math.random()*360});
  for(var i=c._bubbles.length-1;i>=0;i--){var b=c._bubbles[i];b.y-=b.sp;b.x+=Math.sin(b.phase+t*.001)*.3;if(b.y<-b.r){c._bubbles[i]=c._bubbles[c._bubbles.length-1];c._bubbles.pop();continue}c.fillStyle='hsla('+b.hue+',60%,70%,.15)';c.beginPath();c.arc(b.x,b.y,b.r,0,Math.PI*2);c.fill();c.strokeStyle='hsla('+b.hue+',60%,80%,.4)';c.lineWidth=1;c.beginPath();c.arc(b.x,b.y,b.r,0,Math.PI*2);c.stroke();c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.3,0,Math.PI*2);c.fill()}}
,'Bubbles rise with buoyancy, wobble with sinusoidal motion, and pop with a small burst effect when they reach the surface.');})();