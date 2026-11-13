import { CatmullRomCurve3, Vector3, MathUtils } from 'three';
const p=(x,y,z)=>new Vector3(x,y,z);
export class CameraTimeline {
 constructor(){
  this.path=new CatmullRomCurve3([p(0,7.8,44),p(5,7,36),p(11,6,29),p(19,4.2,20),p(18,3.5,11),p(10,2.7,12),p(5,1.5,9),p(1.2,.4,4.4),p(.15,.05,.85),p(.02,.01,.2)],false,'centripetal');
  this.position=new Vector3();this.target=new Vector3();
 }
 sample(progress,mobile=false){
  this.path.getPoint(MathUtils.clamp(progress,0,1),this.position);
  const early=1.-MathUtils.smoothstep(progress,.12,.5);
  this.target.set(0,-3.7*early,0);
  if(mobile)this.position.multiplyScalar(1.2-.2*MathUtils.smoothstep(progress,.65,.9));
  return {position:this.position,target:this.target,fov:mobile?63:43,interior:MathUtils.smoothstep(progress,.83,.94)};
 }
}
