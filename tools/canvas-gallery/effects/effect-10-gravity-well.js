(function(){register('Gravity Well','A grid of colored dots that form a landscape, warping under your mouse like a gravity well.','interactive',
  function(c){
    c._ps=[];c._mx=-9999;c._my=-9999;c._init=false;
    c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
    c._evtd=function(){c._mx=-9999;c._my=-9999};
    c.canvas.addEventListener('mousemove',c._evt);
    c.canvas.addEventListener('mouseleave',c._evtd);
  },
  function(c,w,h,t){
    if(!c._init){
      c._ps=[];c._colors=[];
      var spacing=Math.min(w,h)/26;
      var cols=Math.floor(w/spacing)+1;
      var rows=Math.floor(h/spacing)+1;
      var ox=(w-(cols-1)*spacing)/2,oy=(h-(rows-1)*spacing)/2;
      for(var r=0;r<rows;r++)for(var col=0;col<cols;col++){
        var hx=ox+col*spacing,hy=oy+r*spacing;
        c._ps.push({x:hx,y:hy,homeX:hx,homeY:hy,vx:0,vy:0});
        // precompute home color — sunset landscape
        var nx=hx/w,ny=hy/h,r,g,b;
        if(ny<0.55){
          var st=ny/0.55;r=30+st*200;g=50+st*100;b=180-st*150;
          var sd=Math.hypot(nx-0.5,ny-0.5);
          if(sd<0.07){r=255;g=255-sd/0.07*120;b=200-sd/0.07*200}
        }else{
          var gt=(ny-0.55)/0.45;r=40+gt*50;g=90-gt*50;b=30-gt*20;
        }
        c._colors.push('rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+',.6)');
      }
      c._init=true;
    }
    c.fillStyle='rgba(0,0,0,.1)';c.fillRect(0,0,w,h);
    var ps=c._ps,cls=c._colors,mx=c._mx,my=c._my,active=mx>-1000;
    for(var i=0;i<ps.length;i++){
      var p=ps[i];
      var dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy)||1;
      if(active){
        var grav=120/(d*d+100);
        p.vx+=dx/d*grav;p.vy+=dy/d*grav;
        if(d<100){
          var orb=2.5/(d+10);
          p.vx+=-dy/d*orb;p.vy+=dx/d*orb;
        }
      }
      p.vx*=0.97;p.vy*=0.97;
      p.vx+=(p.homeX-p.x)*0.002;p.vy+=(p.homeY-p.y)*0.002;
      p.x+=p.vx;p.y+=p.vy;
      // use precomputed home color
      c.fillStyle=cls[i];
      c.beginPath();c.arc(p.x,p.y,Math.max(1,1.5),0,Math.PI*2);c.fill();
    }
  },
  function(c){try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}}
,'A grid of dots forms a sunset landscape (blue sky, orange horizon, bright sun, green ground) that warps around the mouse like a gravity well.');})();