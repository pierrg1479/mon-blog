// Paires FR ↔ EN, source unique pour le hreflang des pages et du sitemap.
// En .mjs pour être importable depuis astro.config.mjs.

/** Slug d'article FR → slug EN */
export const frToEnSlugMap = {
	'automatisation-recharge-velo-heures-creuses': 'automating-ebike-charging-off-peak-hours',
	'rappel-recharge-velo-electrique-home-assistant': 'ebike-charging-reminder-home-assistant',
	'home-assistant-erreurs-a-eviter': 'home-assistant-mistakes-to-avoid',
	'prises-connectees-economies-automatisations': 'smart-plugs-savings-automations',
	'tado-retour-2-ans-economies-gaz': 'tado-review-2-years-gas-savings',
	'tablette-murale-home-assistant': 'wall-mounted-home-assistant-tablet',
};

/** Slug d'article EN → slug FR */
export const enToFrSlugMap = Object.fromEntries(
	Object.entries(frToEnSlugMap).map(([fr, en]) => [en, fr])
);

/** Chemin FR → chemin EN, pour toutes les pages traduites */
export const frToEnPaths = {
	'/': '/en/',
	'/about/': '/en/about/',
	'/contact/': '/en/contact/',
	'/mon-materiel/': '/en/my-equipment/',
	...Object.fromEntries(
		Object.entries(frToEnSlugMap).map(([fr, en]) => [`/blog/${fr}/`, `/en/blog/${en}/`])
	),
};
