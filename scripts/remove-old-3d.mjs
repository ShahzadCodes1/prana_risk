// One-time cleanup: removes files from earlier design versions that are no longer used.
// Safe to run more than once. Run from the project folder: node scripts/remove-old-3d.mjs
import { rm } from 'node:fs/promises';
const OLD = [
  // v1 3D (Three.js) version
  'src/scene', 'public/data',
  'src/ui/stage.ts', 'src/ui/partners.ts', 'src/ui/problem.ts', 'src/ui/coverage.ts', 'src/ui/products.ts', 'src/ui/reach.ts', 'src/ui/founder.ts',
  'src/styles/hero.css', 'src/styles/partners.css', 'src/styles/problem.css', 'src/styles/coverage.css', 'src/styles/products.css', 'src/styles/reach.css',
  'public/images/poster-tall.avif', 'public/images/poster-tall.webp', 'public/images/poster-wide.avif', 'public/images/poster-wide.webp',
  // v4/v5 3D sections, sheet transitions and cinematic frames (replaced in v6)
  'src/ui/fx3d.ts', 'src/styles/sections.css', 'src/styles/sections-3d.css', 'src/styles/cine.css',
];
for (const p of OLD) {
  await rm(p, { recursive: true, force: true });
  console.log('removed', p);
}
console.log('Done.');
