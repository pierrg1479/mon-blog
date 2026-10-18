import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

// llms.txt (https://llmstxt.org) : généré au build depuis les collections,
// un nouvel article publié y apparaît sans rien toucher ici.
export const GET: APIRoute = async ({ site }) => {
	const url = (path: string) => new URL(path, site).href;

	const published = async (collection: 'blog' | 'blogEn') =>
		(await getCollection(collection))
			.filter(({ data }) => data.draft !== true)
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const line = (title: string, path: string, description?: string) =>
		`- [${title}](${url(path)})${description ? `: ${description}` : ''}`;

	const frPosts = await published('blog');
	const fr = frPosts.map((post) =>
		line(post.data.h1 ?? post.data.title, `/blog/${post.id}/`, post.data.description)
	);
	const en = (await published('blogEn')).map((post) =>
		line(post.data.h1 ?? post.data.title, `/en/blog/${post.id}/`, post.data.description)
	);

	const body = `# The Optimization Guy

> Blog domotique de Pierre, centré sur Home Assistant, en français et en anglais.
> Chaque article raconte une installation réelle chez l'auteur : automatisations, intégrations
> Home Assistant, suivi de l'énergie et confort au quotidien, avec du code prêt à adapter et des
> retours d'expérience honnêtes sur ce qui fonctionne et ce qui fonctionne moins bien.

- Langues : français (/) et anglais (/en/), chaque article a sa traduction
- Version Markdown de chaque article et des pages matériel et à propos : ajouter index.md à l'URL (ex. ${url(`/blog/${frPosts[0].id}/index.md`)})
- Flux RSS : ${url('/rss.xml')}

## Articles (français)
${fr.join('\n')}

## Articles (English)
${en.join('\n')}

## Pages
- [Mon matériel domotique Home Assistant](${url('/mon-materiel/')}): le matériel utilisé au quotidien, chaque appareil noté sur 5
- [My smart home equipment](${url('/en/my-equipment/')})
- [Qui suis-je ?](${url('/about/')})
- [Who am I?](${url('/en/about/')})
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
