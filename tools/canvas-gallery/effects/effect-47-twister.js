(function(){register('Twister','Twisting columns of light that rotate like a tornado.','retro',
function(c){},
function(c,w,h,t){
  c.fillStyle='rgba(0,0,0,.04)';c.fillRect(0,0,w,h);var cx=w/2,cy=h/2;
  for(var i=0;i<30;i++){var hue=(i*12+t*.1)%360;var col=i/30*Math.min(w,h)*0.4;for(var j=0;j<20;j++){var a=j/20*Math.PI*2+t*.002+i*0.3;var r=col+10*Math.sin(j*0.5+t*.003+i*0.2);var x=cx+Math.cos(a)*r,y=cy+i*12-100+Math.sin(t*.001+i*0.5)*20;if(y<0||y>h)continue;c.fillStyle='hsla('+hue+',80%,'+(30+20*Math.sin(j*0.3+t*.004))+'%,.3)';c.fillRect(x-1,y-1,2,2)}}}
,'Rotating columns of light particles are distributed along a vertical axis with sinusoidal offset, creating a tornado-like spiral effect.');})();