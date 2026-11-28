import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Image principale d'un article déclinée aux trois formats que Google recommande pour
// le BlogPosting (16:9, 4:3, 1:1), recadrée au centre : le sujet d'une image principale
// y est en général (le recadrage « attention » de sharp coupait l'oiseau de la mangeoire).
const RATIOS = [
	[16, 9],
	[4, 3],
	[1, 1],
] as const;

export async function articleSchemaImages(hero: ImageMetadata, site: URL | string): Promise<string[]> {
	const urls = await Promise.all(
		RATIOS.map(async ([rw, rh]) => {
			// Plus grand cadre au bon ratio qui tient dans l'image d'origine (jamais d'agrandissement)
			const width = Math.min(hero.width, Math.floor((hero.height * rw) / rh));
			const height = Math.round((width * rh) / rw);
			if (width === hero.width && height === hero.height) return hero.src;
			const image = await getImage({ src: hero, width, height, fit: 'cover', format: 'jpg' });
			return image.src;
		})
	);
	return [...new Set(urls)].map((src) => new URL(src, site).href);
}
