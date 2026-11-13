import { PerspectiveCamera, Vector3, MathUtils } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { CameraTimeline } from '../animation/CameraTimeline.js';
export class CameraController {
 constructor(canvas){
  this.camera=new PerspectiveCamera(43,innerWidth/innerHeight,.01,1000);this.mode='cinematic';this.progress=0;this.targetProgress=0;this.interior=0;this.target=new Vector3();this.timeline=new CameraTimeline();
  this.controls=new OrbitControls(this.camera,canvas);this.controls.enabled=false;canvas.style.touchAction='pan-y';this.controls.enableDamping=true;this.controls.dampingFactor=.065;this.controls.enablePan=false;this.controls.minDistance=7.5;this.controls.maxDistance=65;this.controls.minPolarAngle=.12;this.controls.maxPolarAngle=Math.PI-.12;this.controls.rotateSpeed=.45;this.controls.zoomSpeed=.6;
  const state=this.timeline.sample(0,innerWidth<700);this.camera.position.copy(state.position);this.target.copy(state.target);this.camera.lookAt(this.target);this.camera.updateMatrixWorld();
 }
 resize(width,height){this.mobile=width<700;this.camera.aspect=width/height;this.camera.fov=this.mobile?63:43;this.camera.updateProjectionMatrix();}
 update(dt,reduced){
  if(this.mode==='free'){this.controls.update();this.interior=0;return;}
  if(this.mode==='transition'){this.camera.lookAt(this.target);return;}
  this.progress=reduced?this.targetProgress:MathUtils.damp(this.progress,this.targetProgress,5,dt);
  const state=this.timeline.sample(this.progress,this.mobile);this.camera.position.copy(state.position);this.target.copy(state.target);this.interior=state.interior;this.camera.lookAt(this.target);
 }
 explore(reduced){
  if(this.mode==='free')return;this.controls.enabled=false;this.controls.domElement.style.touchAction='none';this.mode='transition';
  const end=this.camera.position.clone();if(end.length()<12)end.set(13,5,19);
  this.transition?.kill();this.transition=gsap.timeline({defaults:{duration:reduced?0:1.4,ease:'power2.inOut'},onComplete:()=>{this.controls.target.set(0,0,0);this.controls.enableDamping=false;this.controls.update();this.controls.enableDamping=true;this.controls.enabled=true;this.mode='free';}});
  this.transition.to(this.camera.position,{x:end.x,y:end.y,z:end.z},0).to(this.target,{x:0,y:0,z:0},0).to(this,{interior:0},0);
 }
 returnToJourney(reduced){
  this.controls.enabled=false;this.controls.domElement.style.touchAction='pan-y';this.mode='transition';this.transition?.kill();
  const state=this.timeline.sample(this.progress,this.mobile);const pos=state.position.clone(),target=state.target.clone();
  this.transition=gsap.timeline({defaults:{duration:reduced?0:1.6,ease:'power2.inOut'},onComplete:()=>{this.mode='cinematic';}});
  this.transition.to(this.camera.position,{x:pos.x,y:pos.y,z:pos.z},0).to(this.target,{x:target.x,y:target.y,z:target.z},0).to(this,{interior:state.interior},0);
 }
 dispose(){this.transition?.kill();this.controls.dispose();}
}
