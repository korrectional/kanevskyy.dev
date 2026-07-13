(function(){register('Helix Ribbon','A glowing ribbon that spirals upward from the canvas center, its speed and twist following your mouse position.','interactive',
function(c){
  c._mx=-9999;c._my=-9999;
  c._time=0;
  c._velocity=0.1;
  c._velocityTarget=0.1;
  c._evt=function(e){var r=c.canvas.getBoundingClientRect();c._mx=e.clientX-r.left;c._my=e.clientY-r.top};
  c._evtd=function(){c._mx=-9999;c._my=-9999};
  c.canvas.addEventListener('mousemove',c._evt);
  c.canvas.addEventListener('mouseleave',c._evtd);
},
function(c,w,h,t){
  var mx=c._mx,my=c._my;
  if(mx>-1000&&my>-1000){
    var speed=0.05+(my-h/2)/h*0.4;
    var twist=(mx-w/2)/w*0.3;
    c._velocityTarget=Math.max(0.01,speed+twist);
  }else{
    c._velocityTarget=0.1;
  }
  c._time+=c._velocity;
  c._velocity+=(c._velocityTarget-c._velocity)*0.3;
  c.fillStyle='rgba(0,0,0,0.08)';
  c.fillRect(0,0,w,h);
  var cx=w/2,cy=h/2;
  var MAX_OFFSET=Math.min(w,h)*0.65;
  var SPACING=4;
  var POINTS=MAX_OFFSET/SPACING;
  var PEAK=MAX_OFFSET*0.25;
  var POINTS_PER_LAP=6;
  var peakOffset=MAX_OFFSET*0.5;
  c.lineWidth=Math.max(1,Math.min(w,h)*0.003);
  c.beginPath();
  var timeMod=c._time%SPACING;
  var invLap=1/POINTS_PER_LAP;
  var invMax=1/MAX_OFFSET;
  var halfVal=0.5;  // peakOffset/MAX_OFFSET
  var shearVal=0.2; // cx=w/2 => x/cx*w = x*2
  for(var i=POINTS;i>0;i--){
    var value=i*SPACING+timeMod;
    var angle=value*invLap;
    var ax=Math.sin(angle)*Math.PI;
    var ay=Math.cos(angle)*Math.PI;
    var x=ax*value;
    var y=ay*value*0.35;
    var o=1-(Math.min(value,PEAK)/PEAK);
    y-=o*o*peakOffset;
    y+=value*halfVal;
    y+=x*shearVal;
    var alpha=1-value*invMax;
    c.strokeStyle='hsla(0,0%,100%,'+alpha.toFixed(3)+')';
    c.lineTo(cx+x,cy+y);
    c.stroke();
    c.beginPath();
    c.moveTo(cx+x,cy+y);
  }
  c.lineTo(cx,cy-peakOffset);
  c.lineTo(cx,0);
  c.stroke();
},
function(c){
  try{c.canvas.removeEventListener('mousemove',c._evt);c.canvas.removeEventListener('mouseleave',c._evtd)}catch(e){}
}
,'A single continuous ribbon spirals upward from center with its speed and twist modulated by the mouse position.');})();