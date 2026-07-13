(function(){register('Fractal Fern','The classic Barnsley fern fractal rendered with thousands of colored dots.','generative',
function(c){c._first=1},
function(c,w,h,t){
  if(c._first){c.fillStyle='#0a0a0a';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.02)';c.fillRect(0,0,w,h);var x=0,y=0;
  for(var i=0;i<50;i++){var r=Math.random();var nx,ny;if(r<.01){nx=0;ny=.16*y}else if(r<.86){nx=.85*x+.04*y;ny=-.04*x+.85*y+1.6}else if(r<.93){nx=.2*x-.26*y;ny=.23*x+.22*y+1.6}else{nx=-.15*x+.28*y;ny=.26*x+.24*y+.44}
    x=nx;y=ny;var px=w/2+x*w/12,py=h-y*h/12;if(px>0&&px<w&&py>0&&py<h){var hue=(140+py*0.1+t*.05)%360;c.fillStyle='hsla('+hue+',80%,'+(30+y*2)+'%,.6)';c.fillRect(px,py,1.5,1.5)}}}
,'The Barnsley fern fractal uses four affine transformations chosen with weighted probabilities to generate a self-similar plant structure.');})();