import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

// Inline the vector logo and the flat US map into index.html at build time so they paint with the first byte.
const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8');
const logo = read('./src/ui/logo.svg').replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
const usMap = read('./src/ui/us-map.svg');

export default defineConfig({
  plugins: [
    {
      name: 'inline-svg',
      transformIndexHtml: (html) => html.split('%LOGO%').join(logo).split('%USMAP%').join(usMap),
    },
  ],
  build: { target: 'es2020', cssCodeSplit: false },
  server: { host: true, port: 5173 },
});
