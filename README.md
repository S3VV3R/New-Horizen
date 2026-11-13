# EVENT HORIZON

A real-time WebGL black hole expedition. Vanilla JavaScript, Vite, Three.js, GLSL, GSAP and ScrollTrigger. No external visual or audio assets are needed at runtime.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build`; serve `dist`. `npm run preview` previews the production build.

## Interaction

Scroll in either direction through five chapters, or use the right-hand chapter navigation. Explore Space transfers camera ownership to damped OrbitControls: drag to orbit, wheel/pinch to zoom. Return to Journey or R restores the saved path position. Begin and Restart perform smooth navigation. Sound is off by default and synthesized only after an explicit click. The settings panel offers real Low/Medium/High presets, automatic downward adaptation, and reduced motion.

## Rendering model and limits

The full-screen mesh is a ray-tracing surface, not an image of a black hole. Each fragment constructs a world-space ray from the PerspectiveCamera. Rays integrate the effective central force `-1.5 rs L² r / |r|⁵`, motivated by Schwarzschild null orbits (rs = 1). Adaptive midpoint steps capture rays reaching the horizon and intersect the thin disk in world space, including multiple intersections that produce lensed secondary images. A deterministic procedural cube-sphere starfield is sampled along the outgoing bent ray. Disk ISCO radius is 3 rs; shadow critical impact parameter is approximately 2.598 rs; the photon sphere lies at 1.5 rs. The shadow, photon sphere and event horizon are not equated.

This is a physically inspired visualization, not a calibrated scientific ray tracer. Finite-distance initial conditions are approximate; the model has no spin, observer tetrad, full general-relativistic radiative transfer or instrument calibration. Step sizes and finite budgets trade fidelity for performance. The thin-disk emission, temperature palette, relativistic brightness factor, bloom and narrow photon-ring accent are art-directed. Artistic interior geometry begins after the final approach and is explicitly labeled. The original synthesized soundtrack is not sound propagating through a vacuum.

## Architecture

- `src/core`: renderer, size lifecycle, camera ownership, initialization and render loop.
- `src/world`: bent-ray black hole, disk emission module, deterministic procedural stars, particles.
- `src/shaders`: world-space ray construction, curved-ray integration, procedural plasma.
- `src/animation`: Catmull-Rom camera path and GSAP scroll navigation.
- `src/effects`: bloom and output tone mapping.
- `src/ui`: chapters, accessible controls and HUD state.
- `src/audio`: original Web Audio drone, muted by default.

The disk is intentionally evaluated inside the black-hole shader, rather than as an independently rasterized mesh: this preserves lensed images consistently from all camera angles. Procedural resources replace unused textures/audio/font downloads.

## Quality / lifecycle

Low uses 84 integration steps, 0.65 pixel ratio, fewer stars/particles, simpler plasma and no bloom. Medium uses 116 steps and capped native resolution. High uses 156 steps and up to 1.5 pixel ratio. Automatic quality decreases after sustained slow frames; it never silently raises the selected preset. Rendering pauses in hidden tabs. Modules dispose GPU resources, controls and listeners. WebGL initialization, context loss and shader failures expose a usable fallback. Reduced motion removes camera smoothing, drastically slows plasma and enables direct chapter jumps.

## References

- https://science.nasa.gov/universe/black-holes/anatomy/
- https://threejs.org/docs/pages/EffectComposer.html
- https://threejs.org/docs/pages/OrbitControls.html
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/

## Verification in the build environment

- `npm run build`: production bundle builds successfully.
- `npm test`: five automated tests cover all chapter boundaries in both directions, 2,001 samples of each camera path, horizon crossing, exclusive camera ownership, touch-scroll handoff and rapid mode switching.
- The GLSL core compiled and rendered in a separate native Mesa/EGL context. Nine desktop/mobile and free-orbit viewpoints were visually inspected, including directly above, below, and edge-on. This check adapted GLSL syntax to desktop OpenGL and used Three.js tone-mapping chunks; it does not verify the browser postprocessing pipeline.
- Browser checks confirmed chapter navigation, reverse scrolling, restart, settings selection, reduced motion, audio toggle, field notes, and the responsive 390 × 844 fallback layout.
- The provided cloud browser has WebGL disabled. Full browser 3D rendering, live GPU frame rate, and physical touch/pinch gestures could not be verified there. The fallback displays a clear explanation and keeps chapter notes accessible.

## GitHub Pages
Push the source files to the `main` branch of your GitHub repository. In Settings → Pages, select GitHub Actions. The included workflow installs dependencies, tests, builds with relative asset paths, and deploys `dist`. Do not push node_modules. The prepared ZIP omits Sites identity and Git metadata.

Explore hides the HUD text while retaining accessible icon controls. Open settings explicitly to see their labels. The final chapter contains an optional Rick Astley transmission, loaded from the official YouTube video only after clicking. Stars are brighter and denser, with a procedural dust band.
"# New-Horizen" 
