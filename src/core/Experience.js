import { Scene, MathUtils } from 'three';
import { Renderer, PRESETS } from './Renderer.js';
import { Sizes } from './Sizes.js';
import { CameraController } from './CameraController.js';
import { BlackHole } from '../world/BlackHole.js';
import { Starfield } from '../world/Starfield.js';
import { Particles } from '../world/Particles.js';
import { PostProcessing } from '../effects/PostProcessing.js';
import { ScrollExperience } from '../animation/ScrollExperience.js';
import { Interface } from '../ui/Interface.js';
import { Soundtrack } from '../audio/Soundtrack.js';
const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
export class Experience {
 constructor(){
  this.autoQuality=true;this.quality=innerWidth<700?'low':'medium';this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.elapsed=0;this.last=0;this.samples=[];this.frames=0;this.failed=false;
  this.audio=new Soundtrack();
  this.ui=new Interface({navigate:i=>{this.scroll?.goTo(i,this.reduced);},explore:enabled=>this.setExplore(enabled),sound:()=>this.audio.toggle(),quality:q=>this.setQuality(q),auto:a=>{this.autoQuality=a;this.updateQualityUI();},motion:r=>{this.reduced=r;}});
  this.scroll=new ScrollExperience(p=>{if(this.controller)this.controller.targetProgress=p;this.ui.update(p);});
  this.abort=new AbortController();
 }
 async init(){
  try{
   this.ui.loading(0,'CREATING WEBGL CONTEXT');await nextFrame();
   this.renderer=new Renderer(document.querySelector('#viewport'));this.scene=new Scene();
   this.controller=new CameraController(this.renderer.instance.domElement);this.ui.loading(1,'MAPPING THE DISTANT STARS');await nextFrame();
   this.stars=new Starfield();const texture=this.stars.create(this.quality);this.ui.loading(2,'TRACING CURVED LIGHT PATHS');await nextFrame();
   this.blackhole=new BlackHole(this.scene,texture);this.particles=new Particles(this.scene);this.post=new PostProcessing(this.renderer.instance,this.scene,this.controller.camera);
   this.sizes=new Sizes(()=>this.resize());this.setQuality(this.quality);
   this.ui.loading(3,'COMPILING THE OBSERVATION SYSTEM');await nextFrame();
   this.blackhole.update(this.controller.camera,0,0,this.reduced);
   await this.renderer.instance.compileAsync(this.scene,this.controller.camera);this.post.render();
   if(this.renderer.shaderError)throw new Error(this.renderer.shaderError);
   this.ui.loading(4,'CALIBRATING THE JOURNEY');await nextFrame();
   this.controller.targetProgress=this.scroll.trigger.progress;this.controller.progress=this.controller.targetProgress;
   this.renderer.instance.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();this.fail(new Error('WebGL context lost'));},{signal:this.abort.signal});
   document.addEventListener('visibilitychange',()=>{this.audio.visibility(document.hidden);if(document.hidden){cancelAnimationFrame(this.raf);this.raf=null;}else if(!this.failed){this.last=performance.now();this.raf=requestAnimationFrame(t=>this.tick(t));}},{signal:this.abort.signal});
   this.ui.loading(5,'OBSERVATION SYSTEM READY');await nextFrame();this.ui.ready();this.last=performance.now();this.raf=requestAnimationFrame(t=>this.tick(t));
  }catch(error){this.fail(error);}
 }
 resize(){if(!this.sizes||!this.renderer||!this.controller)return;const p=PRESETS[this.quality];this.ratio=this.renderer.resize(this.sizes,p);this.controller.resize(this.sizes.width,this.sizes.height);this.post?.resize(this.sizes.width,this.sizes.height,this.ratio);this.updateQualityUI();}
 setQuality(name){if(!PRESETS[name])return;this.quality=name;if(this.blackhole){this.blackhole.setQuality(PRESETS[name],this.stars.create(name));this.particles.setQuality(PRESETS[name]);this.post.setQuality(PRESETS[name]);this.resize();}this.samples=[];this.lastQualityChange=performance.now();this.updateQualityUI();}
 updateQualityUI(){this.ui.quality(this.quality,this.autoQuality,this.ratio||1);}
 setExplore(enabled){if(!this.controller)return;if(enabled){this.scroll.pause();this.controller.explore(this.reduced);}else{this.scroll.resume();this.controller.returnToJourney(this.reduced);}}
 tick(now){
  if(this.failed||document.hidden)return;const raw=(now-this.last)/1000,dt=Math.min(raw,.08);this.last=now;this.elapsed+=dt*(this.reduced?.08:1);
  this.controller.update(dt,this.reduced);const p=this.controller.progress;
  this.blackhole.update(this.controller.camera,this.elapsed,this.controller.interior,this.reduced);
  this.particles.update(this.elapsed,p,this.controller.mode==='free');this.post.render();this.frames++;
  if(this.renderer.shaderError){this.fail(new Error(this.renderer.shaderError));return;}
  if(this.autoQuality&&this.frames>90&&this.quality!=='low'&&now-this.lastQualityChange>9000){
   this.samples.push(raw);if(this.samples.length>=80){const average=this.samples.reduce((a,b)=>a+b,0)/this.samples.length;if(average>.042)this.setQuality(this.quality==='high'?'medium':'low');this.samples=[];}
  }
  this.raf=requestAnimationFrame(t=>this.tick(t));
 }
 fail(error){console.error('EVENT HORIZON initialization/render failure',error);this.failed=true;cancelAnimationFrame(this.raf);this.ui.error();}
 dispose(){cancelAnimationFrame(this.raf);this.abort.abort();this.scroll?.dispose();this.controller?.dispose();this.blackhole?.dispose();this.particles?.dispose();this.stars?.dispose();this.post?.dispose();this.sizes?.dispose();this.renderer?.dispose();this.audio.dispose();this.ui.dispose();}
}
