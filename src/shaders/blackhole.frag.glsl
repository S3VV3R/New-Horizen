precision highp float;
varying vec2 vUv;
uniform float uTime,uAspect,uTanFov,uStepScale,uDetail,uStarBrightness,uInterior,uReduced,uStarGrid;
uniform int uSteps;
uniform vec3 uCamera;
uniform mat4 uCameraMatrix;

/* ACCRETION */
/* LENSING */
void main(){
 vec2 uv=vUv*2.-1.;
 vec3 dir=normalize((uCameraMatrix*vec4(uv.x*uAspect*uTanFov,uv.y*uTanFov,-1.,0.)).xyz);
 vec3 color;
 if(uInterior>.999){color=vec3(0.);}else{color=traceRay(uCamera,dir);}
 if(uInterior>0.){
  float angle=atan(uv.y,uv.x);float radius=length(uv*vec2(uAspect,1.));
  float arcs=pow(max(0.,sin(radius*16.-uTime*.12+sin(angle*3.)*.9)),32.);
  float fade=exp(-radius*2.2)*smoothstep(.0,.8,radius);
  vec3 unknown=vec3(.1,.07,.042)*arcs*fade;
  color=mix(color,unknown,smoothstep(0.,1.,uInterior));
 }
 float vignette=1.-.32*pow(length(vUv-.5)*1.3,2.);
 color*=vignette;
 color+=vec3(.0015,.0017,.0024);
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
