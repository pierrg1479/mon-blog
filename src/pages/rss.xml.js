import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export const prerender = true;

export async function GET(context) {
	const posts = (await getCollection('blog', ({ data }) => data.draft !== true)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		// Seuls les champs reconnus par @astrojs/rss : l'objet `author` du frontmatter le fait échouer
		items: posts.map((post) => ({
			title: post.data.h1 ?? post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
		})),
	});
}
