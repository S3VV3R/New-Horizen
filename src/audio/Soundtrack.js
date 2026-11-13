export class Soundtrack {
 constructor(){this.enabled=false;this.context=null;this.nodes=[];}
 async toggle(){
  if(!this.context){
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Web Audio is unavailable');
   this.context=new Audio();this.gain=this.context.createGain();this.gain.gain.value=0;this.gain.connect(this.context.destination);
   for(const [frequency,level] of [[42,.16],[63,.07],[84.1,.035],[126.05,.012]]){
    const osc=this.context.createOscillator(),gain=this.context.createGain();osc.type='sine';osc.frequency.value=frequency;gain.gain.value=level;osc.connect(gain);gain.connect(this.gain);osc.start();this.nodes.push(osc,gain);
   }
   const buffer=this.context.createBuffer(1,this.context.sampleRate*4,this.context.sampleRate);const data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+(Math.random()*2-1)*.018)/1.018;data[i]=last;}
   const noise=this.context.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=this.context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=180;noise.connect(filter);filter.connect(this.gain);noise.start();this.nodes.push(noise,filter);
  }
  await this.context.resume();this.enabled=!this.enabled;this.gain.gain.setTargetAtTime(this.enabled?.25:0,this.context.currentTime,.7);return this.enabled;
 }
 visibility(hidden){if(!this.context)return;if(hidden)this.context.suspend();else if(this.enabled)this.context.resume().catch(()=>{});}
 dispose(){this.nodes.forEach(n=>{try{n.stop?.();n.disconnect();}catch{}});this.context?.close();}
}
