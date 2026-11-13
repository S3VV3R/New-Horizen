import { WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace } from 'three';
export const PRESETS={
 low:{pixelRatio:.65,maxWidth:1100,steps:84,stepScale:1.45,detail:0,bloom:false,particles:60},
 medium:{pixelRatio:1,maxWidth:1550,steps:116,stepScale:1.1,detail:1,bloom:true,particles:160},
 high:{pixelRatio:1.5,maxWidth:2300,steps:156,stepScale:.82,detail:1,bloom:true,particles:350}
};
export class Renderer {
 constructor(container){
  this.instance=new WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});
  this.instance.outputColorSpace=SRGBColorSpace;this.instance.toneMapping=ACESFilmicToneMapping;this.instance.toneMappingExposure=1.25;
  this.instance.setClearColor(0x050507,1);container.appendChild(this.instance.domElement);
  this.shaderError=null;this.instance.debug.onShaderError=(gl,program,vertex,fragment)=>{this.shaderError=[gl.getProgramInfoLog(program),gl.getShaderInfoLog(vertex),gl.getShaderInfoLog(fragment)].filter(Boolean).join('\n');console.error('Shader compilation failed:',this.shaderError);};
 }
 resize(sizes,preset){const ratio=Math.min(devicePixelRatio||1,preset.pixelRatio,preset.maxWidth/sizes.width);this.instance.setPixelRatio(ratio);this.instance.setSize(sizes.width,sizes.height);return ratio;}
 dispose(){this.instance.dispose();this.instance.domElement.remove();}
}
