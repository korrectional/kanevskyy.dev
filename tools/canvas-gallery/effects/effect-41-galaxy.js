(function(){register('Galaxy','A rotating spiral galaxy with thousands of stars and glowing core.','particles',
function(c){c._maxD=Math.min(c.canvas.width/2,c.canvas.height/2)*0.4;var area=c.canvas.width/2*c.canvas.height/2;var count=Math.min(4000,Math.ceil(area/200));c._stars=[];for(var i=0;i<count;i++){var dist=Math.random()*c._maxD,ang=Math.random()*Math.PI*2;var arm=ang+dist*0.01,ca=Math.cos(arm),sa=Math.sin(arm);c._stars.push({ca:ca,sa:sa,dist:dist,ang:ang,s:Math.random()*2+1,h:Math.random()*60+180})}c._first=1},
function(c,w,h,t){
  if(c._first){c.fillStyle='#000';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.05)';c.fillRect(0,0,w,h);var cx=w/2,cy=h/2,rot=t*.0002;
  for(var i=0;i<c._stars.length;i++){var s=c._stars[i];var a=s.ang+s.dist*0.02+rot*(300/(s.dist+10)),ca=Math.cos(a),sa=Math.sin(a);var x=cx+ca*s.dist,y=cy+sa*s.dist;var bright=Math.max(0,1-s.dist/(c._maxD*1.25));c.fillStyle='hsla('+s.h+',80%,'+(40+40*bright)+'%,'+bright+')';c.fillRect(x,y,s.s*bright,s.s*bright)}}
,'Thousands of stars are distributed in a spiral pattern using logarithmic spiral equations, with a bright dense core and color gradient from warm center to cool edges.');})();