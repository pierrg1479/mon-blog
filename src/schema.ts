// Données structurées (JSON-LD) partagées par toutes les pages.
// Les @id permettent de relier l'auteur, le site et les articles entre eux.

export const SITE_URL = 'https://www.the-optimization-guy.com';
export const SITE_NAME = 'The Optimization Guy';
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/about/#person`;
export const AUTHOR_NAME = 'Pierre';

export type Lang = 'fr' | 'en';

export const langFromPath = (pathname: string): Lang =>
	pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';

// Référence courte à l'auteur, utilisée dans les articles
export const personRef = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: AUTHOR_NAME,
	url: `${SITE_URL}/about/`,
};

export const siteGraph = (lang: Lang) => ({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': WEBSITE_ID,
			url: `${SITE_URL}/`,
			name: SITE_NAME,
			description:
				lang === 'en'
					? 'A smart home blog about Home Assistant: automations, integrations, dashboards and energy tracking.'
					: 'Blog domotique sur Home Assistant : automatisations, intégrations, dashboards et suivi de l’énergie.',
			inLanguage: ['fr', 'en'],
			publisher: { '@id': PERSON_ID },
		},
		{
			...personRef,
			alternateName: SITE_NAME,
			image: `${SITE_URL}/hannibal-cercle.png`,
			knowsAbout: ['Home Assistant', 'Home automation', 'Energy optimization'],
			sameAs: ['https://x.com/OptimizGuy', 'https://www.reddit.com/user/Patient-Gene703/'],
		},
	],
});

// URL canonique avec slash final (sauf fichiers), pour ne pas exposer /about et /about/ en double
export const canonicalFor = (pathname: string) => {
	const path = pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;
	return new URL(path, SITE_URL).href;
};
