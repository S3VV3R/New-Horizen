import { Vector2 } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
export class PostProcessing {
 constructor(renderer,scene,camera){this.renderer=renderer;this.scene=scene;this.camera=camera;this.composer=new EffectComposer(renderer);this.composer.addPass(new RenderPass(scene,camera));this.bloom=new UnrealBloomPass(new Vector2(1,1),.35,.65,.65);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());this.enabled=true;}
 resize(width,height,ratio){this.composer.setPixelRatio(ratio);this.composer.setSize(width,height);}
 setQuality(preset){this.enabled=preset.bloom;}
 render(){if(this.enabled)this.composer.render();else this.renderer.render(this.scene,this.camera);}
 dispose(){this.composer.passes.forEach(pass=>pass.dispose?.());this.composer.dispose();}
}
