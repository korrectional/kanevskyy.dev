// ── Shared utilities for Canvas Gallery effects ──

class PerlinNoise {
  constructor(){this.p=new Uint8Array(512);for(let i=0;i<256;i++)this.p[i]=i;for(let i=255;i>0;i--){let j=Math.random()*i|0;[this.p[i],this.p[j]]=[this.p[j],this.p[i]]}for(let i=0;i<256;i++)this.p[i+256]=this.p[i]}
  fade(t){return t*t*t*(t*(t*6-15)+10)}
  lerp(a,b,t){return a+t*(b-a)}
  grad(h,x,y){let u=h&3;let v=u<2?x:y;let w=u<2?y:x;return((u&1)?-v:v)+((u&2)?-w:w)}
  noise2d(x,y){let X=x|0&255,Y=y|0&255;x-=x|0;y-=y|0;let u=this.fade(x),v=this.fade(y);let aa=this.p[this.p[X]+Y],ab=this.p[this.p[X]+Y+1],ba=this.p[this.p[X+1]+Y],bb=this.p[this.p[X+1]+Y+1];return this.lerp(this.lerp(this.grad(this.p[aa],x,y),this.grad(this.p[ba],x-1,y),u),this.lerp(this.grad(this.p[ab],x,y-1),this.grad(this.p[bb],x-1,y-1),u),v)}
}

window.PerlinNoise = PerlinNoise;