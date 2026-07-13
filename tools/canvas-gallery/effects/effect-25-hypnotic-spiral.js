(function(){register('Hypnotic Spiral','A continuously rotating spiral tunnel that creates a mesmerizing optical illusion.','geometry',
function(c){},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.03)';c.fillRect(0,0,w,h);var cx=w/2,cy=h/2;
  for(var i=0;i<360;i+=6){var a=i*Math.PI/180+t*.002;var r=5+i/360*Math.min(w,h)*0.45;var x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;var hue=(i+t*.2)%360;c.fillStyle='hsla('+hue+',80%,'+(30+20*Math.sin(i*0.1+t*.003))+'%,.4)';c.fillRect(x,y,2+Math.sin(i*0.05+t*.005)*2,2+Math.cos(i*0.05+t*.005)*2)}
  for(var i=0;i<12;i++){var a=i/12*Math.PI*2+t*.001;var x=cx+Math.cos(a)*Math.min(w,h)*0.45,y=cy+Math.sin(a)*Math.min(w,h)*0.45;c.strokeStyle='hsla('+(i*30+t*.1)+',80%,60%,.15)';c.lineWidth=1;c.beginPath();c.moveTo(cx,cy);c.lineTo(x,y);c.stroke()}
},'A rotating spiral tunnel creates an optical illusion by drawing concentric arcs that shift in hue and radius, with the center appearing to recede into depth.');})();