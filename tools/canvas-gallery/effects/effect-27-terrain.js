(function(){register('Terrain','A 3D terrain landscape generated with Perlin noise that scrolls like a flyover.','generative',
function(c){c._n=new PerlinNoise();c._first=1},
function(c,w,h,t){
  if(c._first){c.fillStyle='#0a0a0a';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.03)';c.fillRect(0,0,w,h);
  var step=Math.max(4,Math.ceil(Math.min(w,h)*0.012)),off=t*.00008,sinx=Math.sin(t*.002),siny=Math.sin(t*.002);
  for(var y=0;y<h;y+=step){var sy=Math.sin(y*.03)*15;for(var x=0;x<w;x+=step){var hgt=c._n.noise2d(x*.008+off,y*.008+off)*100+Math.sin(x*.02)*20*sinx+sy;var hue=140+hgt*0.5;if(hgt>10)hue=30;if(hgt<-10)hue=220;c.fillStyle='hsla('+hue+',60%,'+(30+hgt*0.3)+'%,.6)';c.fillRect(x,y,step,step)}}
},'Perlin noise generates a heightmap that scrolls horizontally, rendered as a filled 3D terrain profile with a gradient from blue to green to white.');})();