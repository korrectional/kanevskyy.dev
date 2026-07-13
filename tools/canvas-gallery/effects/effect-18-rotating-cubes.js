(function(){register('Rotating Cubes','A cluster of 3D wireframe cubes rotating in space with depth.','geometry',
function(c){c._cubes=[];for(var i=0;i<12;i++)c._cubes.push({x:(Math.random()-.5)*4,y:(Math.random()-.5)*4,z:(Math.random()-.5)*4,s:.6+Math.random()*.8,rx:Math.random()*6.28,ry:Math.random()*6.28,sp:.3+Math.random()*.5,h:Math.random()*360});c._first=1},
function(c,w,h,t){
  if(c._first){c.fillStyle='#000';c.fillRect(0,0,w,h);c._first=0}
  c.fillStyle='rgba(0,0,0,.08)';c.fillRect(0,0,w,h);
  var cx=w/2,cy=h/2,sc=Math.min(w,h)*0.2;
  var cubes=c._cubes;
  // Depth-sort using insertion pass (cubes move slowly, near-sorted)
  for(var i=1;i<cubes.length;i++){var tmp=cubes[i],j=i-1;while(j>=0&&cubes[j].z<tmp.z){cubes[j+1]=cubes[j];j--}cubes[j+1]=tmp}
  for(var i=0;i<cubes.length;i++){
    var cu=cubes[i];cu.rx+=cu.sp*.02;cu.ry+=cu.sp*.03;
    var rx=cu.rx+t*.001,ry=cu.ry+t*.0015;
    var crx=Math.cos(rx),srx=Math.sin(rx),cry=Math.cos(ry),sry=Math.sin(ry);
    var s=cu.s;
    // Compute 8 vertices inline (no array allocation)
    var v=[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    for(var k=0;k<8;k++){
      var xx=(k&1?s:-s),yy=(k&2?s:-s),zz=(k&4?s:-s);
      var y1=yy*crx-zz*srx,z1=yy*srx+zz*crx;
      var x1=xx*cry+z1*sry,z2=-xx*sry+z1*cry;
      v[k]=[x1+cu.x,y1+cu.y,z2+cu.z];
    }
    var edges=[[0,1],[0,2],[1,3],[2,3],[4,5],[4,6],[5,7],[6,7],[0,4],[1,5],[2,6],[3,7]];
    for(var e=0;e<edges.length;e++){
      var p1=v[edges[e][0]],p2=v[edges[e][1]];
      var d1=1/(p1[2]+5),x1=cx+p1[0]*sc*d1,y1=cy+p1[1]*sc*d1;
      d1=1/(p2[2]+5);var x2=cx+p2[0]*sc*d1,y2=cy+p2[1]*sc*d1;
      var hue=(cu.h+i*20+t*.1)%360;
      c.strokeStyle='hsla('+hue+',80%,60%,.5)';c.lineWidth=1;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
    }
  }
},'A cluster of 3D wireframe cubes rotates in space using perspective projection, with each cube spinning at a slightly different rate for visual depth.');})();