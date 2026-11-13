import { Experience } from './core/Experience.js';
const experience=new Experience();experience.init();
window.addEventListener('pagehide',()=>experience.audio.visibility(true));
if(import.meta.hot)import.meta.hot.dispose(()=>experience.dispose());

const rickButton=document.createElement('button');rickButton.textContent='DECODE THE UNKNOWN SIGNAL ↗';rickButton.className='begin-button';rickButton.hidden=true;document.querySelector('#chapter-copy').append(rickButton);
const observer=new MutationObserver(()=>{rickButton.hidden=document.querySelector('#chapter-name').textContent!=='THE UNKNOWN';});observer.observe(document.querySelector('#chapter-name'),{childList:true});
rickButton.addEventListener('click',()=>{document.querySelector('#rick-player').innerHTML='<iframe title="Rick Astley — official music video" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?playsinline=1" allow="fullscreen; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';document.querySelector('#rick-dialog').showModal();});
document.querySelector('#rick-close').addEventListener('click',()=>document.querySelector('#rick-dialog').close());document.querySelector('#rick-dialog').addEventListener('close',()=>{document.querySelector('#rick-player').replaceChildren();});
if(import.meta.hot)import.meta.hot.dispose(()=>{observer.disconnect();rickButton.remove();});
