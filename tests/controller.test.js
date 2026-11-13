import test from 'node:test';
import assert from 'node:assert/strict';
import { gsap } from 'gsap';
import { CameraController } from '../src/core/CameraController.js';

// A minimal input surface for unit-testing camera ownership without a GPU/browser.
class InputSurface extends EventTarget {
 constructor(){super();this.style={};this.root=new EventTarget();this.clientWidth=1364;this.clientHeight=936;}
 getRootNode(){return this.root;}
}
globalThis.innerWidth=1364;globalThis.innerHeight=936;

test('cinematic and orbit controls transfer ownership without changing saved progress',()=>{
 const canvas=new InputSurface(),c=new CameraController(canvas);
 c.resize(1364,936);c.progress=.45;c.targetProgress=.45;c.update(.016,false);
 const saved=c.camera.position.clone();
 assert.equal(c.controls.enabled,false);assert.equal(canvas.style.touchAction,'pan-y');
 c.explore(false);assert.equal(c.mode,'transition');assert.equal(c.controls.enabled,false);
 c.transition.progress(1);assert.equal(c.mode,'free');assert.equal(c.controls.enabled,true);assert.equal(canvas.style.touchAction,'none');
 c.camera.position.set(20,9,15);c.update(.016,false);assert.ok(c.camera.position.distanceTo(saved)>1);assert.equal(c.progress,.45);
 c.returnToJourney(false);assert.equal(c.controls.enabled,false);assert.equal(canvas.style.touchAction,'pan-y');
 c.transition.progress(1);assert.equal(c.mode,'cinematic');assert.ok(c.camera.position.distanceTo(saved)<1e-5);
 c.dispose();gsap.ticker.sleep();
});

test('rapid mode changes cancel the previous camera transition',()=>{
 const c=new CameraController(new InputSurface());
 c.explore(false);c.returnToJourney(false);c.explore(false);c.transition.progress(1);
 assert.equal(c.mode,'free');assert.equal(c.controls.enabled,true);
 c.returnToJourney(false);c.transition.progress(1);
 assert.equal(c.mode,'cinematic');assert.equal(c.controls.enabled,false);
 c.dispose();gsap.ticker.sleep();
});
