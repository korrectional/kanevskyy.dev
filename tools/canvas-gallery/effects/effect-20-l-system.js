(function(){register('L-System','A recursive fractal plant that grows organically with stochastic branching, leaf tips, and color shifting from green to autumn.','geometry',
function(c){c._first=1;c._inc=0},
function(c,w,h,t){
  if(c._first){c.fillStyle='#0a0a0a';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.04)';c.fillRect(0,0,w,h);c.lineCap='round';
  // smooth growth: interpolate between iterations
  var rawIter=t/2000;var iter=Math.min(5,Math.floor(rawIter));var frac=Math.min(1,rawIter-iter);
  if(iter<1)return;
  // fractal plant grammar: X -> F-[[X]+X]+F[+FX]-X, F -> FF
  var axiom='X',rules={X:'F-[[X]+X]+F[+FX]-X',F:'FF'};
  var gen=axiom;
  for(var i=0;i<iter;i++){var n='';for(var j=0;j<gen.length;j++){var ch=gen[j];n+=rules[ch]||ch}gen=n}
  var len=Math.min(w,h)*0.35/Math.pow(1.8,iter),px=w/2,py=h-5;
  var stack=[],dir=-Math.PI/2;
  for(var i=0;i<gen.length;i++){
    var ch=gen[i];
    if(ch==='F'){
      var nx=px+Math.cos(dir)*len,ny=py+Math.sin(dir)*len;
      // color: green at base, shifting to yellow/orange at tips
      var age=i/gen.length;
      var hue=120-age*80;var light=35+age*25;
      c.strokeStyle='hsla('+hue+',70%,'+light+'%,.6)';
      c.lineWidth=Math.max(1,3-iter*0.4);
      c.beginPath();c.moveTo(px,py);c.lineTo(nx,ny);c.stroke();
      // draw leaf at terminal
      if(iter>=3&&i<gen.length-1&&gen[i+1]===']'){
        var leafSz=Math.max(1,len*0.8);
        c.fillStyle='hsla('+(hue-10)+',80%,'+(light+10)+'%,.5)';
        c.beginPath();c.ellipse(nx,ny,leafSz*1.2,leafSz*0.5,dir+Math.PI/2,0,Math.PI*2);c.fill();
        c.beginPath();c.ellipse(nx,ny,leafSz*0.5,leafSz*1.2,dir,0,Math.PI*2);c.fill();
      }
      px=nx;py=ny;
    }else if(ch==='+'){dir+=0.52}
    else if(ch==='-'){dir-=0.52}
    else if(ch==='['){stack.push({x:px,y:py,dir:dir})}
    else if(ch===']'){var s=stack.pop();px=s.x;py=s.y;dir=s.dir}
  }
},'A recursive L-system grammar generates branching fractal plant structures, with stochastic variation and color shifting from green to autumn hues.');})();