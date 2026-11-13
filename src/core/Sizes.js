export class Sizes {
 constructor(onResize){this.onResize=onResize;this.update=this.update.bind(this);window.addEventListener('resize',this.update);this.update();}
 update(){this.width=innerWidth;this.height=innerHeight;this.mobile=this.width<700;this.onResize?.(this);}
 dispose(){window.removeEventListener('resize',this.update);}
}
