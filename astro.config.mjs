import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { frToEnPaths } from './src/translations.mjs';

const site = 'https://www.the-optimization-guy.com';
const enToFrPaths = Object.fromEntries(Object.entries(frToEnPaths).map(([fr, en]) => [en, fr]));

// Hreflang dans le sitemap : mêmes paires que le <head> (BaseHead), x-default sur le FR
function withHreflang(item) {
  const path = new URL(item.url).pathname;
  const frPath = frToEnPaths[path] ? path : enToFrPaths[path];
  if (!frPath) return item;
  const fr = new URL(frPath, site).href;
  const en = new URL(frToEnPaths[frPath], site).href;
  item.links = [
    { lang: 'fr', url: fr },
    { lang: 'en', url: en },
    { lang: 'x-default', url: fr },
  ];
  return item;
}

export default defineConfig({
  site,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => new URL(page).pathname !== '/admin/',
      serialize: withHreflang,
    }),
  ],
  output: 'server',
  adapter: vercel()
});
