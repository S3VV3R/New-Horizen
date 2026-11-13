import test from 'node:test';
import assert from 'node:assert/strict';
import { CameraTimeline } from '../src/animation/CameraTimeline.js';
import { chapters, chapterAt } from '../src/ui/Chapters.js';

test('all five chapters have reversible boundaries',()=>{
 assert.equal(chapters.length,5);
 for(let i=1;i<chapters.length;i++){
  const boundary=chapters[i].start;
  assert.equal(chapterAt(boundary),i);
  assert.equal(chapterAt(boundary-1e-6),i-1);
 }
 assert.equal(chapterAt(1),4);
 assert.equal(chapterAt(0),0);
});

test('camera paths remain finite, continuous, and reversible for both viewports',()=>{
 for(const mobile of [false,true]){
  const path=new CameraTimeline();let previous=path.sample(0,mobile).position.clone();
  const snapshots=[];
  for(let i=0;i<=2000;i++){
   const p=i/2000,s=path.sample(p,mobile),position=s.position.clone();
   assert.ok(position.toArray().every(Number.isFinite));
   assert.ok(position.distanceTo(previous)<.15,`camera discontinuity at ${p}`);
   assert.ok(position.distanceTo(s.target)>.1);
   assert.ok(s.interior>=0&&s.interior<=1);
   snapshots.push(position);previous=position;
  }
  for(let i=2000;i>=0;i--)assert.ok(path.sample(i/2000,mobile).position.distanceTo(snapshots[i])<1e-10);
 }
});

test('the final path crosses the horizon, with explicit artistic fade',()=>{
 const path=new CameraTimeline();
 assert.ok(path.sample(.8).position.length()>1);
 assert.ok(path.sample(1).position.length()<1);
 assert.equal(path.sample(.8).interior,0);
 assert.equal(path.sample(.95).interior,1);
});
