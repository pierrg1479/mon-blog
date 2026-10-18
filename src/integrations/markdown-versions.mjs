// Version Markdown des pages, pour les moteurs de réponse IA (même principe que Guibolles).
// Chaque index.md est tiré de la page HTML finie, en fin de build : il ne peut rien dire
// que la page ne dise pas. Ne jamais écrire un .md à la main, il serait écrasé.
// Servi en text/markdown avec un Link canonical vers la page (vercel.json), hors sitemap.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import { tables } from '@joplin/turndown-plugin-gfm';
import { markdownKind } from '../markdown-pages.mjs';

const SITE = 'https://www.the-optimization-guy.com';

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const remove = (root, selector) => root.querySelectorAll(selector).forEach((el) => el.remove());

const LABELS = {
	fr: { colon: ' : ', image: 'Image', product: 'Produit', affiliate: 'lien affilié', readAlso: 'À lire aussi', rating: 'note' },
	en: { colon: ': ', image: 'Image', product: 'Product', affiliate: 'affiliate link', readAlso: 'Read also', rating: 'rating' },
};

/** Délimite le contenu utile de la page, selon son type */
function contentOf(doc, kind) {
	if (kind === 'article') {
		const prose = doc.querySelector('article .prose');
		// Tout ce qui suit la fin de l'article (partage, auteur, articles liés, commentaires) sort
		const end = prose.querySelector('[data-article-end]');
		let node = end;
		while (node) {
			const next = node.nextElementSibling;
			node.remove();
			node = next;
		}
		const h1 = text(doc.querySelector('.hero-title'));
		return parse(`<div><h1>${escapeHtml(h1)}</h1>${prose.innerHTML}</div>`);
	}
	if (kind === 'equipment') {
		const hero = doc.querySelector('.hero-split__content');
		const main = doc.querySelector('main.equipment-main');
		const root = parse(`<div>${hero.innerHTML}${main.innerHTML}</div>`);
		remove(root, '.hero-split__kicker, .eq-nav, .eq-filters, .eq-empty, .eq-section__count');
		return root;
	}
	const root = parse(`<div>${doc.querySelector('main').innerHTML}</div>`);
	remove(root, '.about-eyebrow, .about-actions, .about-hero__media, .about-cta');
	return root;
}

/** Remplace les composants par une forme lisible en Markdown */
function simplify(root, { lang, url }) {
	const t = LABELS[lang];
	remove(root, 'script, style, noscript, iframe, button, svg, .toc, .sr-only, [aria-hidden="true"]');

	// Liens absolus : un .md se lit hors du site
	root.querySelectorAll('a[href]').forEach((a) => {
		a.setAttribute('href', new URL(a.getAttribute('href'), url).href);
	});

	// FAQ : une question par H3, la réponse en dessous. Le titre du composant est masqué
	// sur la page (l'article pose déjà son H2 FAQ), il ne passe pas dans le .md
	root.querySelectorAll('.faq-block').forEach((faq) => {
		const items = faq
			.querySelectorAll('.faq-block__item')
			.map(
				(item) =>
					`<h3>${escapeHtml(text(item.querySelector('.faq-block__question')))}</h3>${item.querySelector('.faq-block__answer').innerHTML}`
			)
			.join('');
		faq.replaceWith(parse(`<div>${items}</div>`));
	});

	// Produit recommandé : nom en lien, prix, mention du lien affilié
	root.querySelectorAll('.aff-inline-wrapper').forEach((block) => {
		const a = block.querySelector('a');
		const name = text(block.querySelector('.aff-inline__title'));
		const price = text(block.querySelector('.aff-inline__price'));
		const disclaimer = text(block.querySelector('.aff-inline__disclaimer'));
		const details = [price, disclaimer].filter(Boolean).join(', ');
		block.replaceWith(
			parse(
				`<p>${t.product}${t.colon}<a href="${a.getAttribute('href')}">${escapeHtml(name)}</a>${details ? `, ${escapeHtml(details)}` : ''} (${t.affiliate})</p>`
			)
		);
	});

	root.querySelectorAll('.read-also').forEach((block) => {
		const a = block.querySelector('a');
		block.replaceWith(
			parse(`<p>${t.readAlso}${t.colon}<a href="${a.getAttribute('href')}">${escapeHtml(text(a))}</a></p>`)
		);
	});

	// Fiche matériel : une ligne par appareil
	root.querySelectorAll('.eq-card').forEach((card) => {
		const rating = card.getAttribute('data-rating');
		const parts = [
			rating ? `${t.rating} ${rating}/5` : '',
			text(card.querySelector('.eq-card__price')),
			...card.querySelectorAll('.eq-badge').map(text),
			text(card.querySelector('.eq-card__comment')),
		].filter(Boolean);
		const links = card.querySelectorAll('.eq-card__actions a').map((a) => {
			const sponsored = (a.getAttribute('rel') ?? '').includes('sponsored');
			return `<a href="${a.getAttribute('href')}">${escapeHtml(text(a))}</a>${sponsored ? ` (${t.affiliate})` : ''}`;
		});
		const name = escapeHtml(text(card.querySelector('.eq-card__name')));
		card.replaceWith(
			parse(`<li><strong>${name}</strong>${t.colon}${[...parts.map(escapeHtml), ...links].join(' · ')}</li>`)
		);
	});

	// Cartes-liens (un <a> qui englobe titre et résumé) : une entrée de liste
	root.querySelectorAll('a').forEach((a) => {
		const heading = a.querySelector('h2, h3, h4');
		if (!heading) return;
		const summary = text(a.querySelector('p:not([class*="more"])'));
		a.replaceWith(
			parse(
				`<ul><li><a href="${a.getAttribute('href')}">${escapeHtml(text(heading))}</a>${summary ? `${t.colon}${escapeHtml(summary)}` : ''}</li></ul>`
			)
		);
	});

	// Frise du parcours (à propos) : l'étiquette passe dans le titre, la liste disparaît
	root.querySelectorAll('ol.about-timeline').forEach((ol) => {
		const steps = ol.querySelectorAll(':scope > li').map((li) => {
			const label = li.querySelector('.about-timeline__label');
			const heading = li.querySelector('h3');
			if (label && heading) heading.set_content(escapeHtml(`${text(label)}${t.colon}${text(heading)}`));
			label?.remove();
			return li.innerHTML;
		});
		ol.replaceWith(parse(`<div>${steps.join('')}</div>`));
	});

	// Images : leur légende, ou à défaut leur texte alternatif
	root.querySelectorAll('figure').forEach((figure) => {
		const caption = text(figure.querySelector('figcaption')) || figure.querySelector('img')?.getAttribute('alt') || '';
		figure.replaceWith(parse(caption ? `<p><em>${t.image}${t.colon}${escapeHtml(caption)}</em></p>` : ''));
	});
	root.querySelectorAll('img').forEach((img) => {
		const alt = img.getAttribute('alt');
		img.replaceWith(parse(alt ? `<p><em>${t.image}${t.colon}${escapeHtml(alt)}</em></p>` : ''));
	});

	// Blocs repliés : le contenu sans le bouton « Voir le code YAML »
	root.querySelectorAll('details').forEach((details) => {
		const summary = details.querySelector('summary');
		const label = text(summary);
		summary?.remove();
		const keep = label && !/code/i.test(label) ? `<p><strong>${escapeHtml(label)}</strong></p>` : '';
		details.replaceWith(parse(`<div>${keep}${details.innerHTML}</div>`));
	});

	return root;
}

function turndown() {
	const service = new TurndownService({
		headingStyle: 'atx',
		codeBlockStyle: 'fenced',
		bulletListMarker: '-',
		emDelimiter: '*',
		hr: '---',
	});
	service.use(tables);
	// Blocs de code Shiki : la langue est sur le <pre>, le texte dans les <span class="line">
	service.addRule('shiki', {
		filter: (node) => node.nodeName === 'PRE',
		replacement: (_content, node) => {
			const lang = node.getAttribute('data-language') ?? '';
			const code = node.textContent.replace(/\n+$/, '');
			return `\n\n\`\`\`${lang === 'plaintext' ? '' : lang}\n${code}\n\`\`\`\n\n`;
		},
	});
	// Encadrés (note, astuce, avertissement) : en citation
	service.addRule('callout', {
		filter: (node) => node.nodeName === 'DIV' && /\bcallout\b/.test(node.getAttribute('class') ?? ''),
		replacement: (content) =>
			`\n\n${content
				.trim()
				.split('\n')
				.map((line) => (line ? `> ${line}` : '>'))
				.join('\n')}\n\n`,
	});
	return service;
}

function frontmatter(doc, url, lang) {
	const meta = (selector) => doc.querySelector(selector)?.getAttribute('content');
	const fields = {
		title: text(doc.querySelector('title')),
		description: meta('meta[name="description"]'),
		url,
		lang,
		published: meta('meta[property="article:published_time"]')?.slice(0, 10),
		updated: meta('meta[property="article:modified_time"]')?.slice(0, 10),
	};
	const lines = Object.entries(fields)
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
	return `---\n${lines.join('\n')}\n---\n\n`;
}

export function toMarkdown(html, pathname) {
	const kind = markdownKind(pathname);
	if (!kind) return null;
	const doc = parse(html, { comment: false });
	const lang = doc.querySelector('html')?.getAttribute('lang') === 'en' ? 'en' : 'fr';
	const url = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? new URL(pathname, SITE).href;
	const content = simplify(contentOf(doc, kind), { lang, url });
	const body = turndown()
		.turndown(content.toString())
		// Turndown aligne le texte des listes sur 4 colonnes (« -   ») : une espace suffit
		.replace(/^(\s*)(-|\d+\.)\s{2,}/gm, '$1$2 ')
		// « ### 2\. Titre » : l'échappement anti-liste n'a pas lieu d'être dans un titre
		.replace(/^(#+ \d+)\\\./gm, '$1.')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
	return `${frontmatter(doc, url, lang)}${body}\n`;
}

export default function markdownVersions() {
	return {
		name: 'markdown-versions',
		hooks: {
			'astro:build:done': async ({ dir, pages, logger }) => {
				const outDir = fileURLToPath(dir);
				let count = 0;
				for (const { pathname } of pages) {
					if (!markdownKind(pathname)) continue;
					const htmlPath = `${outDir}${pathname}index.html`;
					const markdown = toMarkdown(await readFile(htmlPath, 'utf-8'), pathname);
					await writeFile(`${outDir}${pathname}index.md`, markdown);
					count += 1;
				}
				logger.info(`${count} versions .md écrites`);
			},
		},
	};
}
