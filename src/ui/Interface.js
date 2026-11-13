import { gsap } from 'gsap';
import { chapters, chapterAt, chapterNotes } from './Chapters.js';
const $=s=>document.querySelector(s);
export class Interface {
 constructor(actions){
  this.actions=actions;this.index=-1;this.exploring=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.abort=new AbortController();const on=(el,event,fn)=>el.addEventListener(event,fn,{signal:this.abort.signal});
  $('#chapter-navigation').innerHTML=chapters.map((c,i)=>`<button data-chapter="${i}" aria-label="Chapter ${i+1}: ${c.name}">${String(i+1).padStart(2,'0')}</button>`).join('');
  document.querySelectorAll('[data-chapter]').forEach(b=>on(b,'click',()=>this.navigate(+b.dataset.chapter)));
  on($('#explore'),'click',()=>this.toggleExplore());
  on($('#brand'),'click',e=>{e.preventDefault();this.navigate(0);});
  on($('#begin'),'click',()=>this.navigate(1));on($('#restart'),'click',()=>this.navigate(0));
  on($('#next-chapter'),'click',()=>this.navigate(this.index===4?0:this.index+1));
  on(document,'keydown',e=>{if(e.key.toLowerCase()==='r'&&this.exploring&&!/INPUT|TEXTAREA/.test(e.target.tagName))this.toggleExplore();if(e.key==='Escape')this.closeSettings();});
  on($('#sound'),'click',async()=>{try{const active=await actions.sound();$('#sound').setAttribute('aria-pressed',String(active));$('#sound').setAttribute('aria-label',active?'Mute cinematic soundtrack':'Enable cinematic soundtrack');$('#sound span').textContent=active?'SOUND ON':'SOUND OFF';}catch{$('#sound span').textContent='UNAVAILABLE';$('#sound').setAttribute('aria-label','Audio unavailable in this browser');}});
  on($('#settings-button'),'click',()=>{const open=$('#settings').hidden;$('#settings').hidden=!open;$('#settings-button').setAttribute('aria-expanded',String(open));});
  on($('#settings-close'),'click',()=>this.closeSettings());
  document.querySelectorAll('[data-quality]').forEach(b=>on(b,'click',()=>{$('#auto-quality').checked=false;actions.auto(false);actions.quality(b.dataset.quality);}));
  on($('#auto-quality'),'change',e=>actions.auto(e.target.checked));
  $('#reduce-motion').checked=this.reduced;
  on($('#reduce-motion'),'change',e=>{this.reduced=e.target.checked;document.body.classList.toggle('reduced-motion',this.reduced);actions.motion(this.reduced);});
  on($('#annotation-toggle'),'click',()=>{const open=$('#annotation-detail').hidden;$('#annotation-detail').hidden=!open;$('#annotation-toggle').setAttribute('aria-expanded',String(open));$('#annotation-toggle>span:last-child').textContent=open?'−':'+';});
  this.noteIndex=0;
  const notes=[['GRAVITATIONAL LENSING','Gravity curves the paths of light, revealing the far side of the disk above and below the shadow.'],['ACCRETION DISK','Orbiting gas heats up as it moves inward. The bright bands trace a thin disk of turbulent plasma.'],['PHOTON RING','Light that travels close to the photon sphere can orbit the black hole. Its narrow images sit near the shadow, outside the event horizon.'],['SPACETIME CURVATURE','Mass changes the geometry of spacetime. Light follows these curved paths, even though it has no rest mass.']];
  on($('#next-note'),'click',()=>{this.noteIndex=(this.noteIndex+1)%notes.length;$('#annotation-name').textContent=notes[this.noteIndex][0];$('#annotation-copy').textContent=notes[this.noteIndex][1];$('#note-count').textContent=`0${this.noteIndex+1} / 04`;});
  on($('#about-button'),'click' ,()=>$('#about-dialog').showModal());on($('#about-close'),'click',()=>$('#about-dialog').close());
  on($('#about-dialog'),'click',e=>{if(e.target===$('#about-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  on($('#retry'),'click',()=>location.reload());
  this.update(0,true);document.body.classList.toggle('reduced-motion',this.reduced);
 }
 navigate(index){if(this.exploring)this.toggleExplore();this.actions.navigate(index);}
 toggleExplore(){this.exploring=!this.exploring;this.actions.explore(this.exploring);$('#explore span').textContent=this.exploring?'RETURN TO JOURNEY':'EXPLORE SPACE';$('#explore').setAttribute('aria-label',this.exploring?'Return to journey':'Explore space');$('#mode-label').textContent=this.exploring?'FREE EXPLORE':'CINEMATIC';$('#free-hint').hidden=!this.exploring;$('#story').hidden=this.exploring;$('#annotation').hidden=this.exploring||this.index!==2;$('#artistic-note').hidden=this.exploring||this.index!==4;$('#next-chapter').hidden=this.exploring;document.querySelector('.observation').style.opacity=this.exploring?'0':'1';}
 closeSettings(){$('#settings').hidden=true;$('#settings-button').setAttribute('aria-expanded','false');}
 update(progress,immediate=false){
  $('#journey-progress').style.transform=`scaleX(${progress})`;
  const index=chapterAt(progress);if(index===this.index)return;this.index=index;const c=chapters[index];$('#fallback-chapter-name').textContent=c.name;$('#fallback-chapter-text').textContent=chapterNotes[index];
  document.querySelectorAll('[data-chapter]').forEach((b,i)=>{b.classList.toggle('active',i===index);if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('#chapter-number').innerHTML=`${String(index+1).padStart(2,'0')} <i>/ 05</i>`;$('#chapter-name').textContent=c.name;$('#chapter-caption').textContent=c.caption;
  $('#annotation').hidden=index!==2||this.exploring;$('#artistic-note').hidden=index!==4||this.exploring;$('#scroll-label').textContent=index===4?'BACK TO THE BEGINNING':'SCROLL TO DISCOVER';
  const copy=$('#chapter-copy');gsap.killTweensOf(copy);
  const swap=()=>{copy.className=`chapter-copy ${index>0&&index<4?'compact':''} ${index===4?'final':''}`;$('#chapter-title').innerHTML=c.title;$('#chapter-kicker').textContent=c.kicker;$('#chapter-subtitle').textContent=c.subtitle;$('#begin').hidden=index!==0;$('#restart').hidden=index!==4;};
  if(immediate||this.reduced){swap();gsap.set(copy,{opacity:1,y:0});}else{gsap.to(copy,{opacity:0,y:-9,duration:.22,onComplete:()=>{swap();gsap.fromTo(copy,{y:12,opacity:0},{y:0,opacity:1,duration:.8,ease:'power2.out'});}});}
 }
 quality(name,auto,ratio){$('#quality-label').textContent=auto?'AUTO':name.toUpperCase();document.querySelectorAll('[data-quality]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.quality===name)));$('#resolution-label').textContent=`${Math.round(innerWidth*ratio)} × ${Math.round(innerHeight*ratio)}`;}
 loading(step,label){$('#loading-progress').value=step;$('#loading-label').textContent=label;}
 ready(){gsap.to('#loading',{opacity:0,duration:this.reduced?0:.75,onComplete:()=>$('#loading').hidden=true});}
 error(){document.body.classList.add('has-error');$('#loading').hidden=true;$('#fallback').hidden=false;$('#explore').disabled=true;}
 dispose(){this.abort.abort();gsap.killTweensOf('#chapter-copy');}
}
