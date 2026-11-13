import { BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, AdditiveBlending } from 'three';
export class Particles {
 constructor(scene){
  const data=[];let seed=371;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let i=0;i<350;i++){const r=17+rand()*45,a=rand()*Math.PI*2;data.push(Math.cos(a)*r,(rand()-.5)*35,Math.sin(a)*r);}
  this.geometry=new BufferGeometry();this.geometry.setAttribute('position',new Float32BufferAttribute(data,3));
  this.material=new ShaderMaterial({uniforms:{uOpacity:{value:0},uTime:{value:0}},vertexShader:'uniform float uTime; void main(){vec3 p=position; p.y+=sin(uTime*.025+position.x)*.03;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(18./max(-mv.z,1.),.6,1.4);}',fragmentShader:'uniform float uOpacity;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(.6,.49,.34,(1.-smoothstep(.1,.5,r))*uOpacity);}',transparent:true,depthTest:false,depthWrite:false,blending:AdditiveBlending});
  this.points=new Points(this.geometry,this.material);scene.add(this.points);
 }
 update(time,progress,explore){this.material.uniforms.uTime.value=time;this.material.uniforms.uOpacity.value=explore?.07:(progress>.19&&progress<.8?.1:0);}
 setQuality(preset){this.geometry.setDrawRange(0,preset.particles);}
 dispose(){this.geometry.dispose();this.material.dispose();}
}
