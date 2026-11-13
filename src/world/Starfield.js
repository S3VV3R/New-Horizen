// Deterministic cube-sphere star grids evaluated along outgoing bent rays.
// Six cube faces, each with a 0.6% occupancy: ~4,400 / 9,000 / 15,200 stars.
// No large sky textures, draw calls or per-frame CPU allocations.
export class Starfield {
 create(quality='medium'){return {low:350,medium:500,high:650}[quality];}
 dispose(){}
}
