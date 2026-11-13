import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from '../ui/Chapters.js';
gsap.registerPlugin(ScrollTrigger);
export class ScrollExperience {
 constructor(onProgress){
  this.onProgress=onProgress;this.saved=0;
  this.trigger=ScrollTrigger.create({start:0,end:()=>Math.max(1,document.documentElement.scrollHeight-innerHeight),onUpdate:self=>onProgress(self.progress),invalidateOnRefresh:true});
  this.cancel=()=>this.tween?.kill();window.addEventListener('wheel',this.cancel,{passive:true});window.addEventListener('touchstart',this.cancel,{passive:true});
 }
 goTo(index,reduced=false){
  const progress=chapters[index].start+(index===0?0:.025);const y=progress*(document.documentElement.scrollHeight-innerHeight);
  this.tween?.kill();const proxy={y:scrollY};this.tween=gsap.to(proxy,{y,duration:reduced?0:1.9,ease:'power2.inOut',onUpdate:()=>window.scrollTo(0,proxy.y)});
 }
 pause(){this.cancel();this.saved=scrollY;this.trigger.disable(false);document.body.classList.add('is-exploring');}
 resume(){document.body.classList.remove('is-exploring');window.scrollTo(0,this.saved);this.trigger.enable(false,false);this.trigger.refresh();}
 dispose(){this.tween?.kill();this.trigger.kill();window.removeEventListener('wheel',this.cancel);window.removeEventListener('touchstart',this.cancel);}
}
