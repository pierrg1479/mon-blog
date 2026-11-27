import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { frToEnPaths } from './src/translations.mjs';
import markdownVersions from './src/integrations/markdown-versions.mjs';
import { readdirSync, readFileSync } from 'node:fs';

const site = 'https://www.the-optimization-guy.com';

// Articles non répertoriés (`unlisted: true`) : hors sitemap
const unlistedPaths = new Set(
  [['src/content/blog', '/blog/'], ['src/content/blog-en', '/en/blog/']].flatMap(([dir, base]) =>
    readdirSync(dir)
      .filter((file) => /\.mdx?$/.test(file))
      .filter((file) => /^unlisted:\s*true\s*$/m.test(readFileSync(`${dir}/${file}`, 'utf-8').split(/^---\s*$/m)[1] ?? ''))
      .map((file) => `${base}${file.replace(/\.mdx?$/, '')}/`)
  )
);
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
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/admin/' && !unlistedPaths.has(path);
      },
      serialize: withHreflang,
    }),
    markdownVersions(),
  ],
  output: 'server',
  adapter: vercel()
});
