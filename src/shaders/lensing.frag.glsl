// The Schwarzschild null-orbit effective force in a fixed ray plane:
// d²r/dλ² = -3/2 rs |r × dr/dλ|² r / |r|⁵, with rs = 1.
// Adaptive midpoint integration; finite camera normalization, step count,
// disk emission and photon-ring accent are visualization approximations.
vec3 gravity(vec3 p,float angularMomentumSquared){float r2=max(dot(p,p),.05);return -1.5*angularMomentumSquared*p/(r2*r2*sqrt(r2));}
vec3 backgroundStars(vec3 direction){
 // A deterministic procedural cube-sphere sky: thousands of subpixel stars.
 // Sampling the outgoing ray direction naturally includes gravitational lensing.
 vec3 d=normalize(direction),ad=abs(d);vec2 uv;float face;
 if(ad.x>ad.y&&ad.x>ad.z){uv=d.yz/ad.x;face=d.x>0.?1.:2.;}
 else if(ad.y>ad.z){uv=d.xz/ad.y;face=d.y>0.?3.:4.;}
 else{uv=d.xy/ad.z;face=d.z>0.?5.:6.;}
 vec2 grid=(uv*.5+.5)*uStarGrid;vec2 cell=floor(grid);
 float seed=hash31(vec3(cell,face*17.));
 float cloud=noise3(d*3.2)*.65+noise3(d*8.)*.35;
 float band=exp(-pow((d.y+d.x*.35-.12)*4.,2.));
 vec3 sky=vec3(.008,.011,.017)+vec3(.04,.029,.018)*band*cloud*cloud;
 if(seed<.982)return sky;
 vec2 center=.25+.5*vec2(hash31(vec3(cell,face*31.)),hash31(vec3(cell,face*47.)));
 vec2 delta=fract(grid)-center;
 float star=exp(-dot(delta,delta)/.035);
 float bright=.2+.8*hash31(vec3(cell,face*83.));
 vec3 tint=mix(vec3(.65,.75,1.),vec3(1.,.88,.69),hash31(vec3(cell,face*61.)));
 return sky+tint*star*bright*2.2*uStarBrightness;
}
vec3 traceRay(vec3 origin,vec3 direction){
 vec3 p=origin,v=direction;
 float h2=dot(cross(p,v),cross(p,v));
 vec3 light=vec3(0.);float transmission=1.;float closest=length(p);bool captured=false;
 for(int i=0;i<160;i++){
  if(i>=uSteps)break;
  float r=length(p);closest=min(closest,r);
  if(r<1.015){captured=true;break;}
  if(r>max(length(origin)+5.,34.)&&dot(p,v)>0.)break;
  float stepSize=clamp(r*.11,.028,2.6)*uStepScale;
  vec3 a=gravity(p,h2);
  vec3 midP=p+v*stepSize*.5;
  vec3 midV=v+a*stepSize*.5;
  vec3 nextP=p+midV*stepSize;
  vec3 nextV=v+gravity(midP,h2)*stepSize;
  // Ray/disk intersection in world space, including secondary lensed images.
  if(p.y*nextP.y<0.){
   float t=clamp(p.y/(p.y-nextP.y),0.,1.);
   vec3 hit=mix(p,nextP,t);
   vec4 emission=diskEmission(hit,midV);
   light+=transmission*emission.rgb*emission.a;
   transmission*=1.-emission.a*.88;
  }else if(abs(midP.y)<.045){
   // A finite-height emissive slab keeps the disk coherent exactly edge-on.
   vec4 emission=diskEmission(midP,midV);
   emission.a*=min(1.,stepSize*.3);
   light+=transmission*emission.rgb*emission.a;
   transmission*=1.-emission.a*.88;
  }
  p=nextP;v=nextV;
 }
 if(!captured)light+=backgroundStars(v)*transmission;
 // Narrow critical-impact-parameter accent, distinct from the horizon at rs=1.
 float impact=sqrt(h2);
 float critical=2.5980762;
 float ring=exp(-pow((impact-critical)/.035,2.));
 float phi=atan(direction.y,direction.x);
 light+=vec3(1.9,.82,.24)*ring*.16*transmission;
 return light;
}
