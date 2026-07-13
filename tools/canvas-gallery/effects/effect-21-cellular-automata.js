(function(){register('Cellular Automata','Conway Game of Life with colorful evolving cells in a toroidal grid.','geometry',
function(c){c._grid=[];c._w=0;c._h=0;c._first=1},
function(c,w,h,t){
  if(c._first){c._first=0;c._w=60;c._h=40;c._grid=Array.from({length:c._w*c._h},function(){return Math.random()<.3?1:0});c._next=new Array(c._w*c._h)}
  var gw=c._w,gh=c._h,cs=Math.min(w/gw,h/gh),ox=(w-gw*cs)/2,oy=(h-gh*cs)/2;
  c.fillStyle='rgba(0,0,0,.04)';c.fillRect(0,0,w,h);
  var g=c._grid,ng=c._next;
  for(var y=0;y<gh;y++)for(var x=0;x<gw;x++){
    var idx=y*gw+x,n=0;
    for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){if(dx===0&&dy===0)continue;n+=g[((y+dy+gh)%gh)*gw+((x+dx+gw)%gw)]}
    ng[idx]=(g[idx]===1?(n===2||n===3?1:0):(n===3?1:0));
  }
  for(var y=0;y<gh;y++)for(var x=0;x<gw;x++){if(ng[y*gw+x]){c.fillStyle='hsla('+((x*6+y*9)+t*.2)%360+',80%,60%,.7)';c.fillRect(ox+x*cs,oy+y*cs,cs-1,cs-1)}}
  var t=c._grid;c._grid=c._next;c._next=t;
},'Conway Game of Life evolves cells based on neighbor counts: live cells with 2-3 neighbors survive, dead cells with 3 neighbors become alive.');})();