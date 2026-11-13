import emissionGLSL from '../shaders/accretion.frag.glsl?raw';
// The disk is intersected by bent rays inside BlackHole, rather than separately
// rasterized: all viewing angles and secondary images share one emission model.
export class AccretionDisk {
 static glsl=emissionGLSL;
 static innerRadius=3;
 static outerRadius=12.5;
}
