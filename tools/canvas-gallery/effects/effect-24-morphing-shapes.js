(function(){register('Morphing Shapes','Smooth transitions between geometric shapes with flowing color gradients.','geometry',
function(c){},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.03)';c.fillRect(0,0,w,h);
  var cx=w/2,cy=h/2,r=Math.min(w,h)*0.3;
  var morph=Math.floor((Math.sin(t*.0003)+1)/2*6),pts=5+morph;
  c.beginPath();
  for(var i=0;i<=pts;i++){var a=i/pts*Math.PI*2-Math.PI/2+t*.0004;var rad=r*(0.7+0.3*Math.sin(a*3+t*.001));var x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;i===0?c.moveTo(x,y):c.lineTo(x,y)}
  c.closePath();var hue=t*.05%360;
  c.fillStyle='hsla('+hue+',80%,60%,.3)';c.fill();c.strokeStyle='hsla('+(hue+60)+',80%,70%,.6)';c.lineWidth=2;c.stroke();
},'Vertices interpolate between different geometric shapes (circle, square, triangle) while a gradient hue cycles continuously.');})();