import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';

const assets=['public/favicon.svg','public/icon.svg','public/icon-v2.svg','public/icon-maskable.svg','public/icon-192.svg','public/apple-touch-icon.svg','public/og-workbench.svg','public/images/home/ecosystem.svg','public/images/story/journey.svg','public/images/projects/narwhal/platform-map.svg','public/images/projects/kubemetal/control-compute.svg','public/images/projects/beluga/data-flow.svg','public/images/projects/nfs-quota-agent/quota-flow.svg','public/images/projects/openforge/lifecycle.svg'];

describe('visual storytelling assets',()=>{
 test('all expected SVG assets exist',()=>{for(const asset of assets)expect(existsSync(asset)).toBe(true)});
 test('manifest exposes PWA icon sizes and maskable icon',()=>{const manifest=JSON.parse(readFileSync('public/manifest.json','utf8'));expect(manifest.icons.some((i:{sizes:string})=>i.sizes==='192x192')).toBe(true);expect(manifest.icons.some((i:{sizes:string,purpose:string})=>i.sizes==='512x512'&&i.purpose==='maskable')).toBe(true)});
 test('visual components include accessible figure/image semantics',()=>{const architecture=readFileSync('components/visual/ArchitectureDiagram.tsx','utf8');const projectImage=readFileSync('components/visual/ProjectArchitectureImage.tsx','utf8');expect(architecture).toContain('<figure');expect(architecture).toContain('<figcaption');expect(projectImage).toContain('alt=')});
});
