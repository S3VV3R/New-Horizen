import { Mesh, PlaneGeometry, ShaderMaterial, Vector3, Matrix4 } from 'three';
import vertexShader from '../shaders/blackhole.vert.glsl?raw';
import fragmentSource from '../shaders/blackhole.frag.glsl?raw';
import lensing from '../shaders/lensing.frag.glsl?raw';
import { AccretionDisk } from './AccretionDisk.js';
export class BlackHole {
 constructor(scene,stars){
  this.uniforms={uTime:{value:0},uAspect:{value:1},uTanFov:{value:.4},uStepScale:{value:1},uDetail:{value:1},uStarBrightness:{value:1},uInterior:{value:0},uReduced:{value:0},uSteps:{value:110},uCamera:{value:new Vector3()},uCameraMatrix:{value:new Matrix4()},uStarGrid:{value:stars}};
  this.material=new ShaderMaterial({vertexShader,fragmentShader:fragmentSource.replace('/* ACCRETION */',AccretionDisk.glsl).replace('/* LENSING */',lensing),uniforms:this.uniforms,depthTest:false,depthWrite:false});
  this.mesh=new Mesh(new PlaneGeometry(2,2),this.material);this.mesh.frustumCulled=false;this.mesh.renderOrder=-10;scene.add(this.mesh);
 }
 update(camera,time,interior,reduced){camera.updateMatrixWorld();this.uniforms.uCamera.value.copy(camera.position);this.uniforms.uCameraMatrix.value.copy(camera.matrixWorld);this.uniforms.uAspect.value=camera.aspect;this.uniforms.uTanFov.value=Math.tan(camera.fov*Math.PI/360);this.uniforms.uTime.value=time;this.uniforms.uInterior.value=interior;this.uniforms.uReduced.value=+reduced;}
 setQuality(preset,texture){this.uniforms.uSteps.value=preset.steps;this.uniforms.uStepScale.value=preset.stepScale;this.uniforms.uDetail.value=preset.detail;this.uniforms.uStarGrid.value=texture;}
 dispose(){this.mesh.geometry.dispose();this.material.dispose();}
}
